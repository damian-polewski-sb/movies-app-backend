export enum MediaType {
  Movie = 'movie',
  Show = 'tv',
}

type BaseMediaData = {
  id: number;
  overview: string;
  vote_average: number;
  poster_path: string;
  release_date: string;
};

export type MovieData = BaseMediaData & {
  title: string;
  media_type: MediaType.Movie;
};

export type ShowData = BaseMediaData & {
  name: string;
  media_type: MediaType.Show;
};

export type MediaData = MovieData | ShowData;

export type PaginatedMediaData = {
  page: number;
  results: MediaData[];
  total_pages: number;
  total_results: number;
};
