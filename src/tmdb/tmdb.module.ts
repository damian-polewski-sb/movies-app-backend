import { Module } from '@nestjs/common';
import { TMDBService } from './tmdb.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TMDBService],
  exports: [TMDBService],
})
export class TMDBModule {}
