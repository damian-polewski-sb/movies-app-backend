import { MediaType } from 'src/tmdb/types';

export type ProcessedMediaData = {
  id: number;
  title: string;
  releaseDate: string;
  overview: string;
  rating: number;
  posterUrl: string;
  mediaType: MediaType;
};

export type PaginatedProcessedMediaData = {
  page: number;
  results: ProcessedMediaData[];
  totalPages: number;
  totalResults: number;
};
