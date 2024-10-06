import { Controller, Get, Param } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get(':id')
  async getMovie(@Param('id') id: string): Promise<any> {
    return this.movieService.getMovieDetails(id);
  }
}
