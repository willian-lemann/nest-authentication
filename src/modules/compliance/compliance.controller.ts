import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { CustomGuard } from '../auth/guards/custom.auth.guard';
import { User } from '../app/decorators/request-user.decorator';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @UseGuards(CustomGuard)
  @Get('verify-cpf/:cpf')
  async verifyCPF(@Param('cpf') cpf: string, @User() user) {
    console.log(user);
    await this.complianceService.verifyCPF(cpf);
  }
}
