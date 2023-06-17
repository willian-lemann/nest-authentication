import { Prisma } from '@prisma/client';

export class Onboarding implements Prisma.OnboardingCreateInput {
  id?: string;
  currentStep: number;
  userId: string;
  user?: Prisma.UserCreateNestedOneWithoutOnboardingInput;
}
