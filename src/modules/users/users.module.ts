import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '@/infra/prisma/prisma.service';

import { CustomGuard } from '../auth/guards/custom.auth.guard';
import { ClerkService } from '../auth/clerk.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, CustomGuard, ClerkService],
  exports: [UsersService],
})
export class UsersModule {}
