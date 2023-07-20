import { GearBoxType } from 'src/data-layer/car/gear-box-type.enum';

export const gearBoxMapping = {
  [GearBoxType.MANUAL as string]: `Manuelle`,
  [GearBoxType.AUTOMATIC as string]: `Automatique`,
};
