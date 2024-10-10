import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

import { MovieData, ShowData } from './types';

@Injectable()
export class TMDBService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = this.configService.get<string>('TMDB_API_URL');
    this.apiKey = this.configService.get<string>('TMDB_API_KEY');
  }

  getMoviePosterUrl(posterPath: string): string {
    return `https://image.tmdb.org/t/p/w500/${posterPath}`;
  }

  async getMovieDetails(id: string): Promise<MovieData> {
    try {
      const url = `${this.apiUrl}/movie/${id}`;

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch movie from TMDB: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getShowDetails(id: string): Promise<ShowData> {
    try {
      const url = `${this.apiUrl}/tv/${id}`;

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch movie from TMDB: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTrendingMovies(): Promise<{ results: MovieData[] }> {
    try {
      const url = `${this.apiUrl}/movie/popular`;

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch trending movies from TMDB: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTrendingShows(): Promise<{ results: ShowData[] }> {
    try {
      const url = `${this.apiUrl}/tv/popular`;

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch trending movies from TMDB: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
