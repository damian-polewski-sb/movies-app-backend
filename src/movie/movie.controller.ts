import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('content')
@UseInterceptors(CacheInterceptor)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('trending-movies')
  async getTrendingMovies(): Promise<any> {
    return this.movieService.getTrendingMovies();
  }

  @Get('trending-shows')
  async getTrendingShows(): Promise<any> {
    return this.movieService.getTrendingShows();
  }

  @Get('movie/:id')
  async getMovieDetails(@Param('id') id: string): Promise<any> {
    return this.movieService.getMovieDetails(id);
  }

  @Get('show/:id')
  async getShowDetails(@Param('id') id: string): Promise<any> {
    return this.movieService.getShowDetails(id);
  }
}
