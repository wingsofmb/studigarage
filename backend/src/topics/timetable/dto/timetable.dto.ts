import { Days } from 'src/topics/timetable/day.enum';

export class UpdateTimetableInputDto {
  day: Days;
  businessHour: string;
}
