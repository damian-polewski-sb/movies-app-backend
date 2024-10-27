import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  List,
  ListEntry,
  ListType,
  MediaType as PrismaMediaType,
} from '@prisma/client';
import { MovieService } from 'src/movie/movie.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListEntryDto } from './dto';
import { ProcessedList } from './types';
import { MediaType } from 'src/tmdb/types';
import { convertToPrismaMediaType } from './utils';

@Injectable()
export class ListService {
  constructor(
    private prisma: PrismaService,
    private movieService: MovieService,
  ) {}

  async createPredefinedListsForUser(userId: number): Promise<void> {
    await this.prisma.list.createMany({
      data: [
        { authorId: userId, listType: ListType.Watched },
        { authorId: userId, listType: ListType.ToWatch },
      ],
    });
  }

  async getListById(listId: number): Promise<ProcessedList> {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      include: { entries: true },
    });

    return this.processListData(list);
  }

  async getUserLists(userId: number): Promise<ProcessedList[]> {
    const userLists = await this.prisma.list.findMany({
      where: { authorId: userId },
      include: { entries: true },
    });

    return userLists.map((list) => this.processListData(list));
  }

  async getUserWatchedList(userId: number): Promise<ProcessedList> {
    const watchedList = await this.prisma.list.findFirst({
      where: { authorId: userId, listType: ListType.Watched },
      include: { entries: true },
    });

    return this.processListData(watchedList);
  }

  async getUserToWatchList(userId: number): Promise<ProcessedList> {
    const toWatchedList = await this.prisma.list.findFirst({
      where: { authorId: userId, listType: ListType.ToWatch },
      include: { entries: true },
    });

    return this.processListData(toWatchedList);
  }

  async addEntryToList(
    userId: number,
    listId: number,
    dto: ListEntryDto,
  ): Promise<ListEntry> {
    const list = await this.prisma.list.findUnique({
      where: {
        id: listId,
        authorId: userId,
      },
    });

    if (!list) throw new ForbiddenException('Access Denied!');

    const listEntry = await this.prisma.listEntry.findFirst({
      where: {
        listId: listId,
        mediaId: dto.mediaId,
        mediaType: convertToPrismaMediaType(dto.mediaType),
      },
    });

    if (listEntry) throw new ConflictException('Media already on the list!');

    const mediaDetails =
      convertToPrismaMediaType(dto.mediaType) === PrismaMediaType.Movie
        ? await this.movieService.getMovieDetails(dto.mediaId.toString())
        : await this.movieService.getShowDetails(dto.mediaId.toString());

    return this.prisma.listEntry.create({
      data: {
        listId,
        mediaId: dto.mediaId,
        mediaType: convertToPrismaMediaType(dto.mediaType),
        title: mediaDetails.title,
        posterUrl: mediaDetails.posterUrl,
      },
    });
  }

  async removeEntryFromList(
    userId: number,
    listId: number,
    dto: ListEntryDto,
  ): Promise<void> {
    const list = await this.prisma.list.findFirst({
      where: {
        id: listId,
        authorId: userId,
      },
    });

    if (!list) throw new ForbiddenException('Access Denied!');

    const listEntry = await this.prisma.listEntry.findFirst({
      where: {
        listId: listId,
        mediaId: dto.mediaId,
        mediaType: convertToPrismaMediaType(dto.mediaType),
      },
    });

    if (!listEntry) throw new NotFoundException('Entry not found in the list!');

    await this.prisma.listEntry.delete({
      where: {
        id: listEntry.id,
      },
    });
  }

  processListData(list: List & { entries: ListEntry[] }): ProcessedList {
    return {
      id: list.id,
      listType: list.listType,
      entries: list.entries.map((entry) => ({
        id: entry.mediaId,
        title: entry.title,
        posterUrl: entry.posterUrl,
        mediaType:
          entry.mediaType === PrismaMediaType.Movie
            ? MediaType.Movie
            : MediaType.Show,
      })),
    };
  }
}
