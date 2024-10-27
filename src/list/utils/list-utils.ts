import { MediaType as PrismaMediaType } from '@prisma/client';
import { MediaType } from 'src/tmdb/types';

export const convertToMediaType = (mediaType: PrismaMediaType): MediaType =>
  mediaType === PrismaMediaType.Movie ? MediaType.Movie : MediaType.Show;

export const convertToPrismaMediaType = (
  mediaType: MediaType,
): PrismaMediaType =>
  mediaType === MediaType.Movie ? PrismaMediaType.Movie : PrismaMediaType.Show;
