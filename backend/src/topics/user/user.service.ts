import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserInputDto, UpdateUserInputDto, userSecretFields } from 'src/topics/user/dto/user.dto';
import _ from 'lodash';
import { PasswordService } from 'src/topics/auth/password.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService, private passwordService: PasswordService) {}

  public async fetchUsersByPk(id: number): Promise<User> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  public async fetchUsersByEmail(email: string): Promise<User> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  public async fetchUsers(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  public async createUser(requestBody: CreateUserInputDto): Promise<User> {
    const saltedPassword = await this.passwordService.hashPassword(requestBody.password);
    const data = {
      saltedPassword,
      ..._.omit(requestBody, 'password'),
    };
    const createdUser = this.prismaService.user.create({ data });
    return _.omit(createdUser, userSecretFields);
  }

  public async updateUser(id: number, requestBody: UpdateUserInputDto): Promise<User> {
    await this.prismaService.user.findUniqueOrThrow({ where: { id } });

    const updatedUser = this.prismaService.user.update({
      where: { id },
      data: requestBody,
    });
    return _.omit(updatedUser, userSecretFields);
  }

  public async deleteUser(id: number): Promise<User> {
    return this.prismaService.user.delete({ where: { id: Number(id) } });
  }
}
