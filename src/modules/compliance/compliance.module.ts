import { Module } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { ComplianceController } from './compliance.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { ClerkService } from '../auth/clerk.service';

@Module({
  imports: [HttpModule],
  controllers: [ComplianceController],
  providers: [ComplianceService, PrismaService, ClerkService],
  exports: [ComplianceService],
})
export class ComplianceModule {}
