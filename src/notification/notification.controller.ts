// src/notification/notification.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from '../schemas/notification.schema';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() notification: Notification): Promise<Notification> {
    return this.notificationService.create(notification);
  }

  @Get()
  async findAll(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Notification | null> {
    return this.notificationService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() notification: Partial<Notification>,
  ): Promise<Notification | null> {
    return this.notificationService.update(id, notification);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Notification | null> {
    return this.notificationService.remove(id);
  }

  @Get('user/:userId')
  async getNotificationsForUser(
    @Param('userId') userId: string,
  ): Promise<Notification[]> {
    return this.notificationService.getNotificationsForUser(userId);
  }

  @Get('user/:userId/unread-count')
  async getUnreadCount(@Param('userId') userId: string): Promise<number> {
    return this.notificationService.getUnreadCount(userId);
  }

  @Put('user/:userId/mark-all-read')
  async markAllAsRead(@Param('userId') userId: string): Promise<void> {
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete('user/:userId/clear-all')
  async clearAllNotifications(@Param('userId') userId: string): Promise<void> {
    return this.notificationService.clearAllNotifications(userId);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string): Promise<Notification | null> {
    return this.notificationService.markAsRead(id);
  }
}
