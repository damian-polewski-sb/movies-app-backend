import { Controller, Get, Param, Patch } from '@nestjs/common';

import { NotificationService } from './notification.service';

import { GetUser } from 'src/auth/decorators';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(@GetUser('id') userId: number) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') notificationId: number,
    @GetUser('id') userId: number,
  ) {
    return this.notificationService.markAsRead(notificationId, userId);
  }

  @Patch('read-all')
  async markAllAsRead(@GetUser('id') userId: number) {
    return this.notificationService.markAllAsRead(userId);
  }
}
