import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

@Schema()
export class Subscription {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  radius: number;

  @Prop({ required: true, type: Object })
  location: Location;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
