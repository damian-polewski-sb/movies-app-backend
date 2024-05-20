import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { User } from '@prisma/client';

import { GetUser } from '../auth/decorators';

@Controller('users')
export class UsersController {
  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@GetUser() user: User) {
    return user;
  }
}
