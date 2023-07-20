import { CarPicture } from 'src/data-layer/car/car-picture.model';
import type { EnergyType } from 'src/data-layer/car/energy-type.enum';
import type { GearBoxType } from 'src/data-layer/car/gear-box-type.enum';

export interface Car {
  id: number;
  createdAt: string;
  updatedAt: string;
  brand: string;
  model: string;
  price: number;
  firstCirculationDate: string;
  mileage: number;
  energy: EnergyType;
  gearBox: GearBoxType;
  insideColor: string;
  outsideColor: string;
  carPictures: CarPicture[];
}
