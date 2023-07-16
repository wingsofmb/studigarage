import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AUTH_STORAGE_KEY, StoredAuthProfile } from 'src/app/auth/_models/auth-storage-keys';
import { UserProfile } from 'src/app/auth/_models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLogged$: Observable<boolean>;
  public userProfile: UserProfile | null = null;
  private autorizationToken: BehaviorSubject<string | null>;

  constructor() {
    this.autorizationToken = new BehaviorSubject<string | null>(null);
    this.isLogged$ = this.autorizationToken.pipe(map((token: string | null) => !!token));
  }

  public login(token: string): void {
    this.autorizationToken.next(token);
    this.persistProfile({ token });
  }

  public logout(): void {
    this.userProfile = null;
    this.cleanStoredProfile();
    this.autorizationToken.next(null);
    console.info('Frontend logged out');
  }

  public setProfile(profile: UserProfile): void {
    this.userProfile = profile;
    this.persistProfile(profile);
  }

  public restoreProfileIfExist(): void {
    const sessionData = this.retrieveStoredProfile();
    if (!sessionData.token) return;
    this.autorizationToken.next(sessionData.token);
    const { id, email, role } = sessionData;
    this.userProfile = { id, email, role } as UserProfile;
  }

  public getToken(): string | undefined {
    const sessionData = this.retrieveStoredProfile();
    return sessionData.token ?? undefined;
  }

  private persistProfile(data: Partial<StoredAuthProfile>): void {
    if (!data) return;
    const sessionData = this.retrieveStoredProfile();
    const payload = {
      ...sessionData,
      ...data,
    };
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  }

  private retrieveStoredProfile(): Partial<StoredAuthProfile> {
    const rawSessionData: string | null = sessionStorage.getItem(AUTH_STORAGE_KEY);
    let sessionData;
    try {
      sessionData = JSON.parse(rawSessionData ?? '{}');
    } catch (e) {
      sessionData = {};
    }
    return sessionData;
  }

  private cleanStoredProfile(): void {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
