import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/data-layer/_shared/backend.service';
import { CreateRepairServicePayload } from 'src/data-layer/repair-service/repair-service-api.dto';
import { RepairService } from 'src/data-layer/repair-service/repair-service.model';

@Injectable()
export class RepairServiceApiService {
  constructor(private backendService: BackendService) {}

  public getAll(): Observable<RepairService[]> {
    return this.backendService.get<RepairService[]>('repair-services');
  }

  public create(payload: CreateRepairServicePayload): Observable<RepairService> {
    return this.backendService.post<RepairService, CreateRepairServicePayload>('repair-services', payload);
  }

  public delete(id: number): Observable<RepairService> {
    return this.backendService.delete<RepairService>(`repair-services/${id}`);
  }
}
