import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';

import { PrismaService } from '@/infra/prisma/prisma.service';
import { CustomGuard } from '../auth/guards/custom.auth.guard';
import { ClerkService } from '../auth/clerk.service';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService, PrismaService, CustomGuard, ClerkService],
})
export class PropertiesModule {}
