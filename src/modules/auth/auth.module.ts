import { Module } from '@nestjs/common';

import { PrismaService } from '@/infra/prisma/prisma.service';
import { AuthService } from './auth.service';

import { UsersService } from '../users/users.service';

@Module({
  providers: [AuthService, UsersService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
