import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/data-layer/_shared/backend.service';
import { UpdateSettingPayload } from 'src/data-layer/setting/setting-api.dto';
import { Setting } from 'src/data-layer/setting/setting.model';

@Injectable()
export class SettingApiService {
  constructor(private backendService: BackendService) {}

  public get(): Observable<Setting> {
    return this.backendService.get<Setting>(`setting`);
  }

  public update(payload: UpdateSettingPayload): Observable<Setting> {
    return this.backendService.put<Setting, UpdateSettingPayload>(`setting`, payload);
  }
}
