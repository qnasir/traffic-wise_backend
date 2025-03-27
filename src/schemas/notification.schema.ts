import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export type NotificationType = 'alert' | 'badge' | 'system';

@Schema()
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  reportId?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  read: boolean;

  @Prop({ required: true, enum: ['alert', 'badge', 'system'] })
  type: NotificationType;

  @Prop({ required: true })
  userId: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
