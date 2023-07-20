import { EnergyType } from 'src/data-layer/car/energy-type.enum';

export const energyTypeMapping = {
  [EnergyType.DIESEL as string]: `Diesel`,
  [EnergyType.PETROL as string]: `Essence`,
  [EnergyType.HYBRID as string]: `Hybride`,
  [EnergyType.ELECTRIC as string]: `Electrique`,
};
