import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';

import { User } from '@prisma/client';

import { GetUser } from '../auth/decorators';
import { EditUserDto } from './dto';
import { UsersService } from './users.service';

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
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.usersService.editUser(userId, dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.getUserById(userId);
  }
}
