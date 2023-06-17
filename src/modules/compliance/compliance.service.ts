import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosInstance } from 'axios';
import { CpfInfo } from './dto/cpf';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { Steps } from '../onboarding/enumerators/steps-enum';

@Injectable()
export class ComplianceService {
  private http: AxiosInstance;

  constructor(
    private readonly httpService: HttpService,
    private prisma: PrismaService,
  ) {
    this.http = httpService.axiosRef;
  }

  async verifyCPF(cpf: string) {
    // const token = await this.generateToken();
    // const consultedCPF = await this.fetchCPF(token, cpf);
    // const cpfinfo = new CpfInfo();
    // cpfinfo.ni = consultedCPF.ni;
    // cpfinfo.nome = consultedCPF.nome;
    // cpfinfo.nascimento = consultedCPF.nascimento;
    // const isNotRegular = cpfinfo.situacao.descricao !== 'Regular';
    // const userInfo = {
    //   cpf: consultedCPF.ni,
    //   name: consultedCPF.nome,
    //   birthday: consultedCPF.nascimento,
    // };
    // if (isNotRegular) {
    //   return {
    //     isRegular: false,
    //     userInfo,
    //   };
    // }
    // try {
    //   await this.prisma.user.update({
    //     data: {
    //       isVerified: true,
    //       onboarding: { update: { currentStep: Steps.ContractStep } },
    //     },
    //     where: { userId: "" },
    //   });
    // } catch (error) {}
    // return {
    //   isRegular: true,
    //   userInfo,
    // };
  }

  private async fetchCPF(token: string, cpf: string) {
    const response = await this.http.get(`/consulta-cpf-df/v1/cpf/${cpf}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  private async generateToken() {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const response = await this.http.post(
      'https://gateway.apiserpro.serpro.gov.br/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${process.env.SERPRO_KEY}`,
        },
      },
    );

    const token = response.data.access_token;
    return token as string;
  }
}
