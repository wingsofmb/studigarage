import { ServiceTheme } from 'src/data-layer/repair-service/service-theme.enum';

export const serviceThemeMapping = {
  [ServiceTheme.REPAIR_MAINTENANCE as string]: `Services de réparation et d'entretien`,
  [ServiceTheme.REVIEW as string]: 'Services de révisions',
  [ServiceTheme.DIAGNOSTIC as string]: 'Services de diagnostic',
  [ServiceTheme.CAR_BODY_AND_PAINTING as string]: 'Services de carrosserie et de peinture',
  [ServiceTheme.ADMIN as string]: 'Services administratifs',
  [ServiceTheme.OTHER as string]: 'Autres services',
};
