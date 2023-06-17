import { User } from '../entities/user.entity';

export class CreateUserDto {
  avatar?: string;
  name?: string;
  email?: string;
  userId: string;
  isVerified?: boolean;
  hasFinishedOnboarding?: boolean;
  role?: string;
  currentStep: number;
}
