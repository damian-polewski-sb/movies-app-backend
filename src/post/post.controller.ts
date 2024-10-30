import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { PostService } from './post.service';
import { GetUser } from 'src/auth/decorators';
import { AddCommentDto, AddReviewDto } from './dto';
import { MediaType } from 'src/tmdb/types';
import { EditCommentDto } from './dto/edit-comment.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':reviewId')
  async getReview(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.postService.getReview(reviewId);
  }

  @Post(':mediaType/:mediaId/review')
  async addOrUpdateReview(
    @Param('mediaId', ParseIntPipe) mediaId: number,
    @Param('mediaType') mediaType: MediaType,
    @Body() dto: AddReviewDto,
    @GetUser('id') userId: number,
  ) {
    return this.postService.addOrUpdateReview(userId, mediaId, mediaType, dto);
  }

  @Delete(':reviewId')
  deleteReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @GetUser('id') userId: number,
  ) {
    return this.postService.deleteReview(userId, reviewId);
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

  @Post(':postId/comment')
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
