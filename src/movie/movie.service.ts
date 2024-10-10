// src/movie/movie.service.ts
import { Injectable } from '@nestjs/common';
import { TMDBService } from '../tmdb/tmdb.service';

@Injectable()
export class MovieService {
  constructor(private readonly tmdbService: TMDBService) {}

  async getMovieDetails(id: string): Promise<any> {
    const movieData = await this.tmdbService.getMovieDetails(id);

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

  async getShowDetails(id: string): Promise<any> {
    const showData = await this.tmdbService.getShowDetails(id);

    const processedData = {
      id: showData?.id,
      title: showData?.name,
      releaseDate: showData?.release_date,
      overview: showData?.overview,
      rating: showData?.vote_average,
      posterUrl: showData.poster_path
        ? this.tmdbService.getMoviePosterUrl(showData.poster_path)
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

    const trendingShows = (data.results ?? []).map((show) => ({
      id: show?.id,
      title: show?.name,
      releaseDate: show?.release_date,
      overview: show?.overview,
      rating: show?.vote_average,
      posterUrl: show.poster_path
        ? this.tmdbService.getMoviePosterUrl(show.poster_path)
        : undefined,
    }));

    return trendingShows;
  }
}
