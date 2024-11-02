import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [MovieModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
