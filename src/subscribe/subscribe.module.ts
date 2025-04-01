import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Subscription,
  SubscriptionSchema,
} from 'src/schemas/subscription.schema';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [SubscribeController],
  providers: [SubscribeService],
  exports: [SubscribeService],
})
export class SubscribeModule {}
