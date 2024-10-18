// src/movie/movie.service.ts
import { Injectable } from '@nestjs/common';
import { TMDBService } from '../tmdb/tmdb.service';
import { MediaData, MediaType, MovieData, ShowData } from 'src/tmdb/types';
import { PaginatedProcessedMediaData, ProcessedMediaData } from './types';

@Injectable()
export class MovieService {
  constructor(private readonly tmdbService: TMDBService) {}

  async getMovieDetails(id: string): Promise<ProcessedMediaData> {
    const movieData = await this.tmdbService.getMovieDetails(id);

    return this.processMediaData(movieData, MediaType.Movie);
  }

  async getShowDetails(id: string): Promise<ProcessedMediaData> {
    const showData = await this.tmdbService.getShowDetails(id);

    return this.processMediaData(showData, MediaType.Show);
  }

  async getTrendingMovies(): Promise<ProcessedMediaData[]> {
    const data = await this.tmdbService.getTrendingMovies();

    const trendingMovies = (data.results ?? []).map((movie) =>
      this.processMediaData(movie, MediaType.Movie),
    );

    return trendingMovies;
  }

  async getTrendingShows(): Promise<ProcessedMediaData[]> {
    const data = await this.tmdbService.getTrendingShows();

    const trendingShows = (data.results ?? []).map((show) =>
      this.processMediaData(show, MediaType.Show),
    );

    return trendingShows;
  }

  async searchMovies(
    query: string,
    page: number,
  ): Promise<PaginatedProcessedMediaData> {
    const data = await this.tmdbService.searchMovies(query, page);

    const searchResults = {
      page: data?.page,
      results: (data?.results ?? [])
        .map((result) => this.processMediaData(result, MediaType.Movie))
        .filter((element) => element ?? false),
      totalPages: data?.total_pages,
      totalResults: data?.total_results,
    };

    return searchResults;
  }

  async searchShows(
    query: string,
    page: number,
  ): Promise<PaginatedProcessedMediaData> {
    const data = await this.tmdbService.searchShows(query, page);

    const searchResults = {
      page: data?.page,
      results: (data?.results ?? [])
        .map((result) => this.processMediaData(result, MediaType.Show))
        .filter((element) => element ?? false),
      totalPages: data?.total_pages,
      totalResults: data?.total_results,
    };

    return searchResults;
  }

  processMediaData(
    mediaData: MediaData,
    mediaType?: MediaType,
  ): ProcessedMediaData | null {
    const typeToCheck = mediaType ?? mediaData.media_type;

    if (typeToCheck === MediaType.Movie) {
      const movieData = mediaData as MovieData;

      return {
        id: movieData.id,
        title: movieData.title,
        releaseDate: movieData.release_date,
        overview: movieData.overview,
        rating: movieData.vote_average,
        posterUrl: movieData.poster_path
          ? this.tmdbService.getMoviePosterUrl(movieData.poster_path)
          : '',
        mediaType: typeToCheck,
      };
    } else if (typeToCheck === MediaType.Show) {
      const showData = mediaData as ShowData;

      return {
        id: showData.id,
        title: showData.name,
        releaseDate: showData.release_date,
        overview: showData.overview,
        rating: showData.vote_average,
        posterUrl: showData.poster_path
          ? this.tmdbService.getMoviePosterUrl(showData.poster_path)
          : '',
        mediaType: typeToCheck,
      };
    } else {
      return null;
    }
  }
}
