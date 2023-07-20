import { EnergyType, GearBoxType } from '@prisma/client';
import { IsString, IsEnum, IsInt, Min, IsDate } from 'class-validator';

export class CreateCarInputDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsDate()
  firstCirculationDate: string;

  @IsInt()
  @Min(0)
  mileage: number;

  @IsEnum(EnergyType)
  energy: EnergyType;

  @IsEnum(GearBoxType)
  gearBox: GearBoxType;

  @IsString()
  insideColor: string;

  @IsString()
  outsideColor: string;

  // carOptions CarOptions[]
  // carPictures carPicture[]
}

export type UpdateCarInputDto = CreateCarInputDto;

export interface GetAllCarInputDto {
  q?: string;
  limit?: number;
  offset?: number;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  minCirculationDate?: number;
  maxCirculationDate?: number;
  gearBox?: GearBoxType;
  energy?: EnergyType;
}

export interface CarGetAllStats {
  count: number;
  minPriceLimit?: number;
  maxPriceLimit?: number;
  minMileageLimit?: number;
  maxMileageLimit?: number;
  minCirculationDateLimit?: number;
}
