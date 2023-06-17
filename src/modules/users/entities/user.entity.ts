import { Prisma } from '@prisma/client';

export class User implements Prisma.UserCreateInput {
  id?: string;
  avatar?: string;
  name?: string;
  email?: string;
  userId: string;
  isVerified?: boolean;
  hasFinishedOnboarding?: boolean;
  role?: Prisma.RoleCreateNestedOneWithoutUserInput;
  onboarding?: Prisma.OnboardingCreateNestedOneWithoutUserInput;
}
