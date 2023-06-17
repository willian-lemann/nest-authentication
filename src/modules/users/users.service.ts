import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    // validate user

    const user = new User();
    user.email = createUserDto.email;
    user.name = createUserDto.name;
    user.isVerified = createUserDto.isVerified;
    user.role = { connect: { id: '123' } };
    user.userId = createUserDto.userId;

    // await this.onboardingService.changeCurrentStep(1, {});

    return this.prisma.user.create({ data: user });
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      data: {},
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
