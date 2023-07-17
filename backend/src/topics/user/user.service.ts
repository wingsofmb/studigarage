import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserInputDto, UpdateUserInputDto, userPublicFieldsFilter } from 'src/topics/user/dto/user.dto';
import * as _ from 'lodash';
import { PasswordService } from 'src/topics/auth/password.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService, private passwordService: PasswordService) {}

  public async fetchUsersByPk(id: number): Promise<User> {
    return this.prismaService.user.findUnique({ where: { id }, select: userPublicFieldsFilter });
  }

  public async fetchUsersByEmail(email: string): Promise<User> {
    return this.prismaService.user.findUnique({ where: { email }, select: userPublicFieldsFilter });
  }

  public async fetchUsers(): Promise<User[]> {
    return this.prismaService.user.findMany({ select: userPublicFieldsFilter });
  }

  public async createUser(requestBody: CreateUserInputDto): Promise<User> {
    const saltedPassword = await this.passwordService.hashPassword(requestBody.password);
    const data = {
      saltedPassword,
      ..._.omit(requestBody, 'password'),
    };
    return this.prismaService.user.create({ data, select: userPublicFieldsFilter });
  }

  public async updateUser(id: number, requestBody: UpdateUserInputDto): Promise<User> {
    await this.prismaService.user.findUniqueOrThrow({ where: { id }, select: userPublicFieldsFilter });

    const saltedPassword = await this.passwordService.hashPassword(requestBody.password);
    const data = {
      saltedPassword,
      ..._.omit(requestBody, 'password'),
    };
    return this.prismaService.user.update({ where: { id }, data, select: userPublicFieldsFilter });
  }

  public async deleteUser(id: number): Promise<User> {
    return this.prismaService.user.delete({ where: { id: Number(id) }, select: userPublicFieldsFilter });
  }
}
