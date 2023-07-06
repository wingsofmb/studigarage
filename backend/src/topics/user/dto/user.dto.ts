import type { Prisma } from '@prisma/client';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserInputDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsStrongPassword()
  password: string;
}

export type UpdateUserInputDto = Partial<Prisma.UserUpdateInput>;

export const userSecretFields = ['saltedPassword'];
