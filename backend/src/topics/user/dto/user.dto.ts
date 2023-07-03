import type { Prisma } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserInputDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

export type UpdateUserInputDto = Partial<Prisma.UserUpdateInput>;
