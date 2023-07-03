import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserInputDto, UpdateUserInputDto } from 'src/topics/user/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async fetchUsersByPk(id: number): Promise<User> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  public async fetchUsers(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  public async createUser(requestBody: CreateUserInputDto): Promise<User> {
    return this.prismaService.user.create({ data: requestBody });
  }

  public async updateUser(id: number, requestBody: UpdateUserInputDto): Promise<User> {
    await this.prismaService.user.findUniqueOrThrow({ where: { id } });

    return this.prismaService.user.update({
      where: { id },
      data: requestBody,
    });
  }

  public async deleteUser(id: number): Promise<User> {
    return this.prismaService.user.delete({ where: { id: Number(id) } });
  }
}
