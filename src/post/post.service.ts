import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddCommentDto, AddReviewDto } from './dto';
import { Like, Post, Comment } from '@prisma/client';
import { MediaType } from 'src/tmdb/types';
import { convertToPrismaMediaType } from 'src/list/utils';
import { EditCommentDto } from './dto/edit-comment.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getReview(reviewId: number): Promise<Post> {
    const review = await this.prisma.post.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async addOrUpdateReview(
    userId: number,
    mediaId: number,
    mediaType: MediaType,
    dto: AddReviewDto,
  ): Promise<Post> {
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
        mediaId,
        mediaType: convertToPrismaMediaType(mediaType),
        rating: dto.rating,
        content: dto.content,
      },
    });
  }

  async deleteReview(userId: number, reviewId: number): Promise<Post> {
    const review = await this.prisma.post.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own review');
    }

    return this.prisma.post.delete({
      where: { id: reviewId },
    });
  }

  async likePost(userId: number, postId: number): Promise<Like> {
    return this.prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
  }

  async unlikePost(userId: number, postId: number): Promise<void> {
    await this.prisma.like.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
  }

  async addComment(
    userId: number,
    postId: number,
    dto: AddCommentDto,
  ): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        userId,
        postId,
        content: dto.content,
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
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comment');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: dto.content,
      },
    });
  }

  async deleteComment(userId: number, commentId: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comment');
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
