import { Controller, Post, Body, Get, Query, Delete } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { Subscription } from 'src/schemas/subscription.schema';

interface SubscriptionErrorResponse {
  type: 'error';
  message: string;
}

interface SubscribtionSuccessResponse {
  type: 'success';
  message: string;
}

type SubscribtionResponse =
  | SubscribtionSuccessResponse
  | SubscriptionErrorResponse;

@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly SubscribeService: SubscribeService) {}

  @Post()
  async subscribe(
    @Body() subscribeData: Subscription,
  ): Promise<SubscribtionResponse> {
    try {
      const result =
        await this.SubscribeService.addSubscribedArea(subscribeData);
      if (result.success) {
        return {
          type: 'success',
          message: result.message || 'Subscribed area added successfully',
        };
      } else {
        return {
          type: 'error',
          message: 'Subscribing success error',
        };
      }
    } catch (error: unknown) {
      console.error('Error in subscribe endpoint:', error);
      return {
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Error while subscribing to area',
      };
    }
  }

  @Get()
  async getSubscribeAreas(
    @Query('userId') userId: string,
  ): Promise<Subscription[]> {
    const data = await this.SubscribeService.getSubscribedAreas(userId);
    return data;
  }

  @Delete()
  async deleteSubscribeArea(
    @Query('id') id: string,
  ): Promise<SubscribtionResponse> {
    try {
      const result = await this.SubscribeService.deleteSubscribedArea(id);
      if (result.success) {
        return {
          type: 'success',
          message: result.message || 'Subscribed area deleted successfully',
        };
      } else {
        return {
          type: 'error',
          message: 'UnSubscribing success error',
        };
      }
    } catch (error) {
      console.log('Error unsubscribing', error);
      return {
        type: 'error',
        message: 'Error while unsubscribing',
      };
    }
  }
}
