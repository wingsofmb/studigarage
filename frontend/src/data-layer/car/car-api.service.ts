import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/data-layer/_shared/backend.service';
import { ResultAndStat } from 'src/data-layer/_shared/result-and-stat.model';
import { CarGetAllStats, CreateCarPayload, GetAllCarQP, updateCarPayload } from 'src/data-layer/car/car-api.dto';
import { Car } from 'src/data-layer/car/car.model';

@Injectable()
export class CarApiService {
  constructor(private backendService: BackendService) {}

  public getAll(qp?: GetAllCarQP): Observable<ResultAndStat<Car[], CarGetAllStats>> {
    return this.backendService.get<ResultAndStat<Car[], CarGetAllStats>>('cars', qp);
  }

  public getAllStats(qp?: GetAllCarQP): Observable<CarGetAllStats> {
    return this.backendService.get<CarGetAllStats>('cars/stats', qp);
  }

  public get(id: number): Observable<Car> {
    return this.backendService.get<Car>(`cars/${id}`);
  }

  public create(payload: CreateCarPayload): Observable<Car> {
    return this.backendService.post<Car, CreateCarPayload>('cars', payload);
  }

  public update(id: number, payload: updateCarPayload): Observable<Car> {
    return this.backendService.put<Car, updateCarPayload>(`cars/${id}`, payload);
  }

  public delete(id: number): Observable<Car> {
    return this.backendService.delete<Car>(`cars/${id}`);
  }
}
