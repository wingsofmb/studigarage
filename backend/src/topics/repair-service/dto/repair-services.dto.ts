import { ServiceTheme } from '@prisma/client';
import { IsString, IsNumber, IsEnum } from 'class-validator';

export class CreateRepairServiceInputDto {
  @IsEnum(ServiceTheme)
  theme: ServiceTheme;

  @IsString()
  name: string;

  @IsNumber()
  price: number;
}
