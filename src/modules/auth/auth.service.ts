import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';

import { CreateUserDto } from '../users/dto/create-user.dto';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as dayjs from 'dayjs';

interface IRefreshPayload {
  expiresIn: number;
  userId: string;
}
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

  async validateRefreshToken(refresh_token: string) {
    const decodedRefreshToken = this.jwtService.decode(
      refresh_token,
    ) as IRefreshPayload;

    if (!decodedRefreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }

    const { expiresIn, userId } = decodedRefreshToken;

    const hasUserWithTheRefreshToken = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!hasUserWithTheRefreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }

    const hasRefreshTokenExpired = dayjs().isAfter(dayjs.unix(expiresIn));

    if (hasRefreshTokenExpired) {
      const newRefreshToken = await this.generateRefreshToken(userId);

      const updatedUser = await this.usersService.update(userId, {
        refresh_token: newRefreshToken,
      });

      return {
        userId: updatedUser.id,
      };
    }

    return {
      userId: hasUserWithTheRefreshToken.id,
    };
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

    const token = this.jwtService.sign(payload);

    const { refresh_token } = await this.usersService.findOne(user.id);

    if (refresh_token) {
      return {
        ...user,
        token,
      };
    }

    const newRefreshtoken = await this.generateRefreshToken(user.id);

    return {
      ...user,
      refresh_token: newRefreshtoken,
      token,
    };
  }

  private async generateRefreshToken(userId: string) {
    const expiresIn = dayjs().add(7, 'day').unix();

    const refreshTokenPayload = {
      userId,
      expiresIn,
    };

    const refreshToken = this.jwtService.sign(refreshTokenPayload);

    const updatedUser = await this.usersService.update(userId, {
      refresh_token: refreshToken,
    });

    return updatedUser.refresh_token;
  }

  async createTokenFromRefreshToken(refresh_token: string) {
    const { userId } = await this.validateRefreshToken(refresh_token);

    const user = await this.usersService.findOne(userId);

    user.password = undefined;

    const payload = { email: user.email, sub: user.id };

    const token = this.jwtService.sign(payload);

    return { ...user, token };
  }

  async logOut(userId: string) {
    await this.usersService.update(userId, { refresh_token: null });
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
