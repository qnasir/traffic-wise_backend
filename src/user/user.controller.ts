/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body() user: User,
  ): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    try {
      const newUser = await this.userService.create(user);
      const payload = { sub: newUser.email, username: newUser.name };
      const accessToken = await this.jwtService.signAsync(payload);
      const { password: _, ...result } = newUser.toObject();

      return {
        access_token: accessToken,
        user: result as Omit<User, 'password'>,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Post('login')
  async login(
    @Body() { email, password },
  ): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const payload = { sub: user.email, username: user.name };
    const accessToken = await this.jwtService.signAsync(payload);

    const { password: _, ...result } = user.toObject();

    return {
      access_token: accessToken,
      user: result as Omit<User, 'password'>,
    };
  }
}
