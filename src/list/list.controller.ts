import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ListService } from './list.service';
import { GetUser } from 'src/auth/decorators';
import { ListEntryDto } from './dto';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get(':listId')
  async getListById(@Param('listId', ParseIntPipe) listId: number) {
    return this.listService.getListById(listId);
  }

  @Get('user/:userId')
  async getUserLists(@Param('userId', ParseIntPipe) userId: number) {
    return this.listService.getUserLists(userId);
  }

  @Post(':listId/entries')
  async addEntryToList(
    @GetUser('id') userId: number,
    @Param('listId', ParseIntPipe) listId: number,
    @Body() dto: ListEntryDto,
  ) {
    return this.listService.addEntryToList(userId, listId, dto);
  }

  @Delete(':listId/entries')
  async removeEntryFromList(
    @GetUser('id') userId: number,
    @Param('listId', ParseIntPipe) listId: number,
    @Body() dto: ListEntryDto,
  ) {
    await this.listService.removeEntryFromList(userId, listId, dto);
    return { message: 'Entry removed from the list' };
  }
}
