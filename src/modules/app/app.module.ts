import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { UsersModule } from '../../modules/users/users.module';
import { AuthModule } from '../../modules/auth/auth.module';
import { PropertiesModule } from '../properties/properties.module';

import { OnboardingModule } from '../onboarding/onboarding.module';
import { ComplianceModule } from '../compliance/compliance.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ComplianceModule,
    OnboardingModule,
    PropertiesModule,
    OnboardingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
