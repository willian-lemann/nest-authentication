import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';

import { CreateUserDto } from '../users/dto/create-user.dto';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(`User ${email} not found.`);
    }

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (!isSamePassword) {
      throw new BadRequestException('User or password is incorrect');
    }

    user.password = undefined;

    return user;
  }

  async register(createUserDto: CreateUserDto) {
    const newUser = createUserDto;

    const user = await this.usersService.findOneByEmail(newUser.email);

    if (user) {
      throw new BadRequestException(
        `User ${user.email} Already exist in database.`,
      );
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    newUser.password = hashedPassword;

    const createdUser = await this.prisma.user.create({
      data: newUser,
    });

    createdUser.password = undefined;

    const token = this.jwtService.sign({
      email: createdUser.email,
      sub: createdUser.id,
    });

    return {
      ...createdUser,
      token,
    };
  }

  async authenticate(user: User) {
    const payload = { email: user.email, sub: user.id };

    user.password = undefined;
    user.chats = undefined;

    return {
      ...user,
      token: this.jwtService.sign(payload),
    };
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

    user.password = undefined;

    return user;
  }
}
