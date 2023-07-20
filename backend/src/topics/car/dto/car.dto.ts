import { EnergyType, GearBoxType, carPicture } from '@prisma/client';
import { IsString, IsEnum, IsInt, Min, IsDateString } from 'class-validator';

export class CreateCarInputDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsDateString()
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

  carPictures?: Array<Partial<carPicture>>;
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
