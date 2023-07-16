import { Injectable } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';
import { AuthLoginPayload, AuthLoginResponse, AuthProfileResponse } from 'src/app/auth/models/auth-api.dto';
import { UserProfile } from 'src/app/auth/models/user-profile';
import { AuthService } from 'src/app/auth/services/auth.service';

import { BackendService } from 'src/app/shared/services/backend.service';

@Injectable()
export class AuthApiService {
  constructor(private backendService: BackendService, private authService: AuthService) {}

  public login(email: string, password: string): Observable<UserProfile> {
    return this.backendService.post<AuthLoginResponse, AuthLoginPayload>('auth/login', { email, password }).pipe(
      map((response) => response.access_token),
      tap((access_token: string) => this.authService.login(access_token)),
      switchMap(() => this.getProfile()),
    );
  }

  public getProfile(): Observable<UserProfile> {
    return this.backendService.get<AuthProfileResponse>('auth/me').pipe(tap((profile: AuthProfileResponse) => this.authService.setProfile(profile)));
  }
}
