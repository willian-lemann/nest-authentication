import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';

import { ChangeCurrentStepDto } from './dto/change-current-step.dto';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  create(@Body() createOnboardingDto: CreateOnboardingDto) {
    return this.onboardingService.initiateOnboarding(createOnboardingDto);
  }

  @Put('finish/:userId')
  async finish(@Param('userId') userId: string) {
    return await this.onboardingService.finishOnboarding(userId);
  }

  @Put('change-current-step')
  changeCurrentStep(@Body() changeCurrentStepDto: ChangeCurrentStepDto) {
    return this.onboardingService.changeCurrentStep(changeCurrentStepDto);
  }
}
