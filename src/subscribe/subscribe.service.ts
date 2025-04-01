import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from 'src/schemas/subscription.schema';

interface SubscriptionResult {
  success: boolean;
  message?: string;
}

@Injectable()
export class SubscribeService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscribeModel: Model<SubscriptionDocument>,
  ) {}

  async addSubscribedArea(
    subscribeData: Subscription,
  ): Promise<SubscriptionResult> {
    try {
      const createdSubscription = new this.subscribeModel(subscribeData);
      await createdSubscription.save();
      return {
        success: true,
        message: 'Subscribed area added successfully',
      };
    } catch (error) {
      console.error('Error adding subscribed area:', error);
      return {
        success: false,
        message: 'Failed to add subscribed area',
      };
    }
  }

  async getSubscribedAreas(userId: string): Promise<Subscription[]> {
    try {
      const subscribedAreas = await this.subscribeModel
        .find({ id: userId })
        .exec();
      return subscribedAreas;
    } catch (error) {
      console.log('Error finding subscribed areas:', error);
      return [];
    }
  }

  async deleteSubscribedArea(id: string): Promise<SubscriptionResult> {
    try {
      await this.subscribeModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Subscribed area deleted successfully',
      };
    } catch (error) {
      console.log('Error unsubscribing', error);
      return {
        success: false,
        message: 'Failed to unsubscribe',
      };
    }
  }
}
