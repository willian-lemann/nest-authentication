import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../modules/auth/guards/local-auth.guard';

import { AuthService } from '../../modules/auth/auth.service';
import { CreateUserDto } from '../../modules/users/dto/create-user.dto';
import { UsersService } from '../../modules/users/users.service';
import { CreateTokenDto } from './dto/create-token.dto';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() request) {
    return await this.authService.authenticate(request.user);
  }

  @Post('auth/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('auth/refresh-token')
  async createTokenFromRefreshToken(@Body() createTokenDto: CreateTokenDto) {
    const { refresh_token } = createTokenDto;

    return await this.authService.createTokenFromRefreshToken(refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() request) {
    return this.authService.getUserProfile(request.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/accept_regulation')
  acceptRegulation(@Request() request) {
    return this.usersService.acceptRegulation(request.user.userId);
  }
}
