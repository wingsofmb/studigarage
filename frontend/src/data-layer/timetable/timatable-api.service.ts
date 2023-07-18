import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/data-layer/_shared/backend.service';
import { UpdateTimetablePayload } from 'src/data-layer/timetable/timetable-api.dto';
import { Timetable } from 'src/data-layer/timetable/timetable.model';

@Injectable()
export class TimetableApiService {
  constructor(private backendService: BackendService) {}

  public getAll(): Observable<Timetable[]> {
    return this.backendService.get<Timetable[]>(`timetables`);
  }

  public update(id: number, payload: UpdateTimetablePayload): Observable<Timetable> {
    return this.backendService.put<Timetable, UpdateTimetablePayload>(`timetables/${id}`, payload);
  }
}
