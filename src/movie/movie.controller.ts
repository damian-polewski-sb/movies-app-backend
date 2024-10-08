import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('movies')
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

  @Get(':id')
  async getMovie(@Param('id') id: string): Promise<any> {
    return this.movieService.getMovieDetails(id);
  }
}
