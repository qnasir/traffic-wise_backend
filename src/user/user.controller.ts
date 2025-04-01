/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

interface LoginSuccessResponse {
  type: 'success';
  access_token: string;
  user: Omit<User, 'password'>;
  message: string;
}

interface LoginErrorResponse {
  type: 'error';
  message: string;
}

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() user: User): Promise<LoginResponse> {
    try {
      const creationResult = await this.userService.create(user);
      if (!creationResult.success) {
        return {
          type: 'error',
          message: creationResult.message ?? 'An error occurred',
        };
      }
      if (!creationResult.user) {
        return {
          type: 'error',
          message: 'User creation failed',
        };
      }
      const payload = {
        sub: creationResult.user.email,
        username: creationResult.user.name,
      };
      const accessToken = await this.jwtService.signAsync(payload);
      const { password: _, ...result } = creationResult.user;

      return {
        type: 'success',
        access_token: accessToken,
        user: result as Omit<User, 'password'>,
        message: 'User Registered successfully',
      };
    } catch (error) {
      return {
        type: 'error',
        message: error.message || 'Internal Server Error',
      };
    }
  }

  @Post('login')
  async login(@Body() { email, password }): Promise<LoginResponse> {
    const user = await this.userService.findOne(email);

    if (!user) {
      return {
        type: 'error',
        message: 'User does not exist',
      };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return {
        type: 'error',
        message: 'Password is incorrect',
      };
    }

    const payload = { sub: user.email, username: user.name };
    const accessToken = await this.jwtService.signAsync(payload);

    const { password: _, ...result } = user.toObject();

    return {
      type: 'success',
      access_token: accessToken,
      user: result as Omit<User, 'password'>,
      message: 'Logged in successfully',
    };
  }
}
