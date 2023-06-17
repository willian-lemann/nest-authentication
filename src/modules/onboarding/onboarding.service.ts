import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';

import { Onboarding } from './entities/onboarding.entity';
import { ChangeCurrentStepDto } from './dto/change-current-step.dto';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  initiateOnboarding(createOnboardingDto: CreateOnboardingDto) {
    const onboarding = new Onboarding();
    onboarding.currentStep = createOnboardingDto.currentStep;
    onboarding.user = { connect: { userId: createOnboardingDto.userId } };
    onboarding.userId = createOnboardingDto.userId;
  }

  async changeCurrentStep(changeCurrentStepDto: ChangeCurrentStepDto) {
    const currentUserStep = await this.prisma.onboarding.findUnique({
      where: { userId: changeCurrentStepDto.userId },
    });

    const increasedCurrentStep = currentUserStep.currentStep + 1;

    if (increasedCurrentStep > 2) {
      throw new BadRequestException('Usuário ja finalizou onboarding.');
    }

    currentUserStep.currentStep + 1;

    return await this.prisma.onboarding.update({
      data: currentUserStep,
      where: { userId: currentUserStep.userId },
    });
  }

  finishOnboarding(id: string) {
    return this.prisma.onboarding.delete({ where: { id } });
  }
}
