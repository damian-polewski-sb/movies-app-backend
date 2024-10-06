// src/movie/movie.service.ts
import { Injectable } from '@nestjs/common';
import { TMDBService } from '../tmdb/tmdb.service';

@Injectable()
export class MovieService {
  constructor(private readonly tmdbService: TMDBService) {}

  async getMovieDetails(id: string): Promise<any> {
    const movieData = await this.tmdbService.getMovie(id);

    const processedData = {
      id: movieData?.id,
      title: movieData?.title,
      releaseDate: movieData?.release_date,
      overview: movieData?.overview,
      rating: movieData?.vote_average,
      posterUrl: movieData.poster_path
        ? this.tmdbService.getMoviePosterUrl(movieData.poster_path)
        : undefined,
    };

    return processedData;
  }
}
