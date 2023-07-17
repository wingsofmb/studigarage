import { Days } from 'src/data-layer/timetable/day.enum';

export const dayMapping: { [key in Days]: string } = {
  [Days.MONDAY]: 'Lun',
  [Days.TUESDAY]: 'Mar',
  [Days.WEDNESDAY]: 'Mer',
  [Days.THURSDAY]: 'Jeu',
  [Days.FRIDAY]: 'Ven',
  [Days.SATURDAY]: 'Sam',
  [Days.SUNDAY]: 'Dim',
};

export const dayOrder: { [key in Days]: number } = {
  [Days.MONDAY]: 1,
  [Days.TUESDAY]: 2,
  [Days.WEDNESDAY]: 3,
  [Days.THURSDAY]: 4,
  [Days.FRIDAY]: 5,
  [Days.SATURDAY]: 6,
  [Days.SUNDAY]: 7,
};
