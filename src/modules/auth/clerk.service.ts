import { UserAPI } from '@clerk/backend/dist/types/api/endpoints';
import { Clerk } from '@clerk/clerk-sdk-node';
import { Injectable } from '@nestjs/common';

type ClerkInstance = {
  users: UserAPI;
};

@Injectable()
export class ClerkService {
  private clerkInstance: ClerkInstance;
  public users: UserAPI;

  constructor() {
    if (this.clerkInstance) {
      this.users = this.clerkInstance.users;
      return;
    }

    this.clerkInstance = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

    this.users = this.clerkInstance.users;
  }
}
