import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '@prisma/client';

import { GetUser } from '../auth/decorators';
import { EditUserDto } from './dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.editUser(userId, dto, file);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.getUserById(userId);
  }
}
