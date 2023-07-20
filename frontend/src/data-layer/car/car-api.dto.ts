import { QueryParams } from 'src/data-layer/_shared/http.model';
import { EnergyType } from 'src/data-layer/car/energy-type.enum';
import { GearBoxType } from 'src/data-layer/car/gear-box-type.enum';

export type GetAllCarQP = QueryParams & {
  q?: string;
  offset?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  minCirculationDate?: string;
  maxCirculationDate?: string;
  energy: EnergyType;
  gearBox: GearBoxType;
};

export interface CreateCarPayload {
  brand: string;
  model: string;
  price: number;
  firstCirculationDate: string;
  mileage: number;
  energy: EnergyType;
  gearBox: GearBoxType;
  insideColor: string;
  outsideColor: string;
}

export type updateCarPayload = CreateCarPayload;

export interface GlobalReviewStats {
  averageScore: number;
  amount: number;
}

export interface CarGetAllStats {
  count: number;
  minPriceLimit?: number;
  maxPriceLimit?: number;
  minMileageLimit?: number;
  maxMileageLimit?: number;
  minCirculationDateLimit?: number;
}
