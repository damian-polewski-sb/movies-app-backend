import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddCommentDto, AddReviewDto } from './dto';
import {
  Like,
  Post,
  Comment,
  MediaType as PrismaMediaType,
} from '@prisma/client';
import { MediaType } from 'src/tmdb/types';
import { convertToMediaType, convertToPrismaMediaType } from 'src/list/utils';
import { EditCommentDto } from './dto/edit-comment.dto';
import { GetAllPostsDto } from './dto/get-posts.dto';
import { MovieService } from 'src/movie/movie.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private movieService: MovieService,
  ) {}

  async getPostById(postId: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found!');
    }

    return post;
  }

  async getAllPaginatedPosts(dto: GetAllPostsDto, userId: number) {
    const { page, pageSize } = dto;
    const skip = (page - 1) * pageSize;

    const posts = await this.prisma.post.findMany({
      where: {
        userId: dto.userId,
      },
      skip: skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        likes: {
          where: {
            userId: userId,
          },
        },
      },
    });

    const totalPosts = await this.prisma.post.count({
      where: {
        userId: dto.userId,
      },
    });

    return {
      posts: posts.map((post) => ({
        ...post,
        isLiked: post.likes.length > 0 ? true : false,
        mediaType: convertToMediaType(post.mediaType),
      })),
      pagination: {
        page,
        pageSize,
        totalPosts,
        totalPages: Math.ceil(totalPosts / pageSize),
      },
    };
  }

  async deletePostById(userId: number, postId: number): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found!');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('Access denied!');
    }

    await this.prisma.post.delete({
      where: { id: postId },
    });
  }

  async getUserReview(
    userId: number,
    mediaId: number,
    mediaType: MediaType,
  ): Promise<Post> {
    const review = await this.prisma.post.findUnique({
      where: {
        userId_mediaId_mediaType: {
          userId,
          mediaId,
          mediaType: convertToPrismaMediaType(mediaType),
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found!');
    }

    return review;
  }

  async addOrUpdateReview(
    userId: number,
    mediaId: number,
    mediaType: MediaType,
    dto: AddReviewDto,
  ): Promise<Post> {
    const mediaDetails =
      convertToPrismaMediaType(mediaType) === PrismaMediaType.Movie
        ? await this.movieService.getMovieDetails(mediaId.toString())
        : await this.movieService.getShowDetails(mediaId.toString());

    return this.prisma.post.upsert({
      where: {
        userId_mediaId_mediaType: {
          userId,
          mediaId,
          mediaType: convertToPrismaMediaType(mediaType),
        },
      },
      update: {
        rating: dto.rating,
        content: dto.content,
      },
      create: {
        userId,
        title: mediaDetails.title,
        mediaId,
        mediaType: convertToPrismaMediaType(mediaType),
        posterUrl: mediaDetails.posterUrl,
        rating: dto.rating,
        content: dto.content,
      },
    });
  }

  async likePost(userId: number, postId: number): Promise<Like> {
    const like = await this.prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (like) {
      throw new ConflictException('Post is already liked!');
    }

    return this.prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
  }

  async unlikePost(userId: number, postId: number): Promise<void> {
    const like = await this.prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (!like) {
      throw new NotFoundException('Post is not liked!');
    }

    await this.prisma.like.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found!');
    }

    return this.prisma.comment.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  async addComment(
    userId: number,
    postId: number,
    dto: AddCommentDto,
  ): Promise<Comment> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found!');
    }

    return this.prisma.comment.create({
      data: {
        userId,
        postId,
        content: dto.content,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  async editComment(
    userId: number,
    commentId: number,
    dto: EditCommentDto,
  ): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found!');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('Access denied!');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: dto.content,
      },
    });
  }

  async deleteComment(userId: number, commentId: number): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found!');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('Access denied!');
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
