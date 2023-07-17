import { Days } from 'src/data-layer/timetable/day.enum';

export interface UpdateTimetablePayload {
  day: Days;
  businessHour: string;
}
