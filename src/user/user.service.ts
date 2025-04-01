/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

interface UserCreationResult {
  success: boolean;
  user?: User;
  message?: string;
}

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<UserCreationResult> {
    const existingUser = await this.userModel.findOne({ email: user.email });
    if (existingUser) {
      return {
        success: false,
        message: 'User already exists',
      };
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });
    const savedUser = await createdUser.save();
    return {
      success: true,
      message: 'User registered successfully',
      user: savedUser.toObject(),
    };
  }

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    return user || undefined;
  }

  // async addSubscribedArea(
  //   userId: string,
  //   subscribeData: SubscribedArea,
  // ): Promise<SubscriptionResult> {
  //   try {
  //     const user = await this.userModel.findById(userId);
  //     if (!user) {
  //       return {
  //         success: false,
  //         message: 'User not found',
  //       };
  //     }
  //     user.subscribedAreas.push(subscribeData);
  //     await user.save();
  //     return {
  //       success: true,
  //       message: 'Subscribed area added successfully',
  //     };
  //   } catch (error) {
  //     console.error('Error adding subscribed area:', error);
  //     return {
  //       success: false,
  //       message: 'Failed to add subscribed area',
  //     };
  //   }
  // }
}
