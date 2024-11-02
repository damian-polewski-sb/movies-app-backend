import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  ParseIntPipe,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { GetUser } from 'src/auth/decorators';
import { AddCommentDto, AddReviewDto } from './dto';
import { MediaType } from 'src/tmdb/types';
import { EditCommentDto } from './dto/edit-comment.dto';
import { GetAllPostsDto } from './dto/get-posts.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':postId')
  async getPostById(@Param('postId', ParseIntPipe) postId: number) {
    return this.postService.getPostById(postId);
  }

  @Get()
  getAllPaginatedPosts(
    @Query() dto: GetAllPostsDto,
    @GetUser('id') userId: number,
  ) {
    return this.postService.getAllPaginatedPosts(dto, userId);
  }

  @Delete(':postId')
  deletePostById(
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser('id') userId: number,
  ) {
    return this.postService.deletePostById(userId, postId);
  }

  @Get('review/:mediaType/:mediaId')
  async getUserReview(
    @Param('mediaId', ParseIntPipe) mediaId: number,
    @Param('mediaType') mediaType: MediaType,
    @GetUser('id') userId: number,
  ) {
    return this.postService.getUserReview(userId, mediaId, mediaType);
  }

  @Post('review/:mediaType/:mediaId')
  async addOrUpdateUserReview(
    @Param('mediaId', ParseIntPipe) mediaId: number,
    @Param('mediaType') mediaType: MediaType,
    @Body() dto: AddReviewDto,
    @GetUser('id') userId: number,
  ) {
    return this.postService.addOrUpdateReview(userId, mediaId, mediaType, dto);
  }

  @Post(':postId/like')
  async likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser('id') userId: number,
  ) {
    return this.postService.likePost(userId, postId);
  }

  @Delete(':postId/like')
  async unlikePost(
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser('id') userId: number,
  ) {
    return this.postService.unlikePost(userId, postId);
  }

  @Get(':postId/comments')
  async getPostComments(@Param('postId', ParseIntPipe) postId: number) {
    return this.postService.getPostComments(postId);
  }

  @Post(':postId/comments')
  async addComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: AddCommentDto,
    @GetUser('id') userId: number,
  ) {
    return this.postService.addComment(userId, postId, dto);
  }

  @Patch('comments/:commentId')
  editComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @GetUser('id') userId: number,
    @Body() dto: EditCommentDto,
  ) {
    return this.postService.editComment(userId, commentId, dto);
  }

  @Delete('comments/:commentId')
  deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @GetUser('id') userId: number,
  ) {
    return this.postService.deleteComment(userId, commentId);
  }
}
