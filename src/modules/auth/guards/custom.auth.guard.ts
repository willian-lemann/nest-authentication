import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ClerkService } from '../clerk.service';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private clerkService: ClerkService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const headers = context.switchToHttp().getRequest().headers;

    const authorization = headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const userId = authorization.split(' ')[1] as string;

    try {
      const user = await this.clerkService.users.getUser(userId);

      if (!user) {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: any,
    status?: any,
  ) {
    console.log('user request');

    return user;
  }
}
