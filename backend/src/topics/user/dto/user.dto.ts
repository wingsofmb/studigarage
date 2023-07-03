import type { Prisma } from '@prisma/client';

export class CreateUserInputDto {
  email: string;
  firstName: string;
  lastName: string;
}

export type UpdateUserInputDto = Partial<Prisma.UserUpdateInput>;
