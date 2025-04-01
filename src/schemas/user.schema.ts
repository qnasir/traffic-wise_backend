import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  toObject(): { [x: string]: any; password: any } {
    throw new Error('Method not implemented.');
  }
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: 0 })
  points: number;

  @Prop({ type: [{ type: Object }] })
  badges: Badge[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}
