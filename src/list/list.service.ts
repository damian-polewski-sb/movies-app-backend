import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { List, ListEntry, ListType, MediaType } from '@prisma/client';
import { MovieService } from 'src/movie/movie.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListEntryDto } from './dto';

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

  async getListById(listId: number): Promise<List> {
    return this.prisma.list.findUnique({
      where: { id: listId },
      include: { entries: true },
    });
  }

  async getUserLists(userId: number): Promise<List[]> {
    return this.prisma.list.findMany({
      where: { authorId: userId },
      include: { entries: true },
    });
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
        mediaType: dto.mediaType,
      },
    });

    if (listEntry) throw new ConflictException('Media already on the list!');

    const mediaDetails =
      dto.mediaType === MediaType.Movie
        ? await this.movieService.getMovieDetails(dto.mediaId.toString())
        : await this.movieService.getShowDetails(dto.mediaId.toString());

    return this.prisma.listEntry.create({
      data: { listId, ...dto, posterUrl: mediaDetails.posterUrl },
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
        mediaType: dto.mediaType,
      },
    });

    if (!listEntry) throw new NotFoundException('Entry not found in the list!');

    await this.prisma.listEntry.delete({
      where: {
        id: listEntry.id,
      },
    });
  }
}
