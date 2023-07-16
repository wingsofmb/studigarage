import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_STORAGE_KEY, StoredAuthProfile } from 'src/app/auth/models/auth-storage-keys';

type Headers = HttpHeaders | { [header: string]: string | string[] };
type QueryParams = HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private http: HttpClient) {}

  public get<T>(url: string, params?: QueryParams): Observable<T> {
    return this.http.get(this.pimpUrl(url), this.getOptions(params)) as Observable<T>;
  }

  public delete<T>(url: string, params?: QueryParams): Observable<T> {
    return this.http.delete(this.pimpUrl(url), this.getOptions(params)) as Observable<T>;
  }

  public post<T, U>(url: string, body: U, params?: QueryParams): Observable<T> {
    return this.http.post(this.pimpUrl(url), body, this.getOptions(params)) as Observable<T>;
  }

  public put<T, U>(url: string, body: U, params?: QueryParams): Observable<T> {
    return this.http.put(this.pimpUrl(url), body, this.getOptions(params)) as Observable<T>;
  }

  private getOptions(params?: QueryParams): { params?: QueryParams; headers?: Headers } {
    return {
      headers: this.getHeaders(),
      ...(params ? { params: params } : {}),
    };
  }

  private getHeaders(): Headers {
    const rawAuthProfile: string | null = sessionStorage.getItem(AUTH_STORAGE_KEY);
    let authProfile: StoredAuthProfile;
    try {
      authProfile = JSON.parse(rawAuthProfile ?? '{}');
    } catch (e) {
      authProfile = {} as StoredAuthProfile;
    }
    return {
      ...(authProfile.token ? { Authorization: `Bearer ${authProfile.token}` } : {}),
    };
  }

  private pimpUrl(url: string): string {
    return `api/${url}`;
  }
}
