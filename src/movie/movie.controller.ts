import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { PaginatedProcessedMediaData, ProcessedMediaData } from './types';

@Controller('content')
@UseInterceptors(CacheInterceptor)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('trending-movies')
  async getTrendingMovies(): Promise<ProcessedMediaData[]> {
    return this.movieService.getTrendingMovies();
  }

  @Get('trending-shows')
  async getTrendingShows(): Promise<ProcessedMediaData[]> {
    return this.movieService.getTrendingShows();
  }

  @Get('movie/:id')
  async getMovieDetails(@Param('id') id: string): Promise<ProcessedMediaData> {
    return this.movieService.getMovieDetails(id);
  }

  @Get('show/:id')
  async getShowDetails(@Param('id') id: string): Promise<ProcessedMediaData> {
    return this.movieService.getShowDetails(id);
  }

  @Get('search')
  async search(
    @Query('query') query: string,
    @Query('page') page: number,
  ): Promise<PaginatedProcessedMediaData> {
    return this.movieService.search(query, page);
  }
}
