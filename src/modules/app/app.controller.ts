import { Controller, Request, Post, Get, Body } from '@nestjs/common';

import { AuthService } from '../../modules/auth/auth.service';
import { CreateUserDto } from '../../modules/users/dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('auth/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Get('profile')
  getProfile(@Request() request) {
    return this.authService.getUserProfile(request.user.userId);
  }
}
