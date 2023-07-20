import { EnergyType } from 'src/data-layer/car/energy-type.enum';
import { GearBoxType } from 'src/data-layer/car/gear-box-type.enum';

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
  // carOptions CarOptions[]
  // carPictures carPicture[]
}
