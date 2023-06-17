import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Module({
  controllers: [OnboardingController],
  providers: [OnboardingService, PrismaService],
})
export class OnboardingModule {}
