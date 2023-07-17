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

export const userPublicFieldsFilter = {
  createdAt: true,
  email: true,
  firstName: true,
  id: true,
  lastName: true,
  role: true,
  saltedPassword: false,
  updatedAt: true,
};

export type UpdateUserInputDto = CreateUserInputDto;

export const userSecretFields = ['saltedPassword'];
