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

  async getTrendingMovies(): Promise<any> {
    const data = await this.tmdbService.getTrendingMovies();

    const trendingMovies = (data.results ?? []).map((movie) => ({
      id: movie?.id,
      title: movie?.title,
      releaseDate: movie?.release_date,
      overview: movie?.overview,
      rating: movie?.vote_average,
      posterUrl: movie.poster_path
        ? this.tmdbService.getMoviePosterUrl(movie.poster_path)
        : undefined,
    }));

    return trendingMovies;
  }

  async getTrendingShows(): Promise<any> {
    const data = await this.tmdbService.getTrendingShows();

    const trendingShows = (data.results ?? []).map((movie) => ({
      id: movie?.id,
      title: movie?.name,
      releaseDate: movie?.release_date,
      overview: movie?.overview,
      rating: movie?.vote_average,
      posterUrl: movie.poster_path
        ? this.tmdbService.getMoviePosterUrl(movie.poster_path)
        : undefined,
    }));

    return trendingShows;
  }
}
