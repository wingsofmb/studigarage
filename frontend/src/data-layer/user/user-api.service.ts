import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/data-layer/_shared/backend.service';
import { CreateUserPayload, GetAllUserPayload, UpdateUserPayload } from 'src/data-layer/user/user-api.dto';
import { User } from 'src/data-layer/user/user.model';

@Injectable()
export class UserApiService {
  constructor(private backendService: BackendService) {}

  public getAll(payload: GetAllUserPayload): Observable<User[]> {
    return this.backendService.get<User[]>('users', payload);
  }

  public get(id: number): Observable<User> {
    return this.backendService.get<User>(`users/${id}`);
  }

  public create(payload: CreateUserPayload): Observable<User> {
    return this.backendService.post<User, CreateUserPayload>('users', payload);
  }

  public update(id: number, payload: UpdateUserPayload): Observable<User> {
    return this.backendService.put<User, UpdateUserPayload>(`users/${id}`, payload);
  }

  public delete(id: number): Observable<User> {
    return this.backendService.delete<User>(`users/${id}`);
  }
}
