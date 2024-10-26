import { ListType } from '@prisma/client';
import { MediaType } from 'src/tmdb/types';

export type ProcessedListEntry = {
  id: number;
  title: string;
  posterUrl: string;
  mediaType: MediaType;
};

export type ProcessedList = {
  id: number;
  listType: ListType;
  entries: ProcessedListEntry[];
};
