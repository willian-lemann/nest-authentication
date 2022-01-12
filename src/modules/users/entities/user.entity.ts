import { Prisma } from '@prisma/client';

export class User implements Prisma.UserCreateInput {
  id?: string;
  avatar?: string;
  name: string;
  email: string;
  password: string;
  accepted_regulation: boolean;
}
