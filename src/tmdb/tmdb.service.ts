import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

import { MediaData, PaginatedMediaData } from './types';

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

  async getMovieDetails(id: string): Promise<MediaData> {
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

  async getShowDetails(id: string): Promise<MediaData> {
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

  async getTrendingMovies(): Promise<PaginatedMediaData> {
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

  async getTrendingShows(): Promise<PaginatedMediaData> {
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

  async search(query: string, page: number): Promise<PaginatedMediaData> {
    try {
      const url = `${this.apiUrl}/search/multi`;

      const queryParams = new URLSearchParams({
        query: query,
        page: (page ?? 1).toString(),
      });

      const response = await lastValueFrom(
        this.httpService.get(`${url}?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to search movies on TMDB: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
