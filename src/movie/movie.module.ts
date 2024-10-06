import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TMDBModule } from 'src/tmdb/tmdb.module';

@Module({
  imports: [TMDBModule],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
