import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import clerk, { Clerk } from '@clerk/clerk-sdk-node';

import { CreateUserDto } from '../users/dto/create-user.dto';

import { UsersService } from '../users/users.service';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { ClerkService } from './clerk.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const newUser = createUserDto;

    const user = await this.usersService.findOneByEmail(newUser.email);

    if (user) {
      throw new BadRequestException(
        `User ${user.email} Already exist in database.`,
      );
    }
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    return user;
  }
}
