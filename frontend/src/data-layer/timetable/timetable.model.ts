import { Days } from 'src/data-layer/timetable/day.enum';

export interface Timetable {
  id: number;
  createdAt: string;
  updatedAt: string;
  day: Days;
  businessHour: string;
}
