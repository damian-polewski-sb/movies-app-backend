import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MovieModule } from 'src/movie/movie.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [MovieModule, NotificationModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
