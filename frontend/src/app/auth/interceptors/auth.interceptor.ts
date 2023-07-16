import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public intercept<T, U>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<U>> {
    console.log('before', req);
    return next.handle(req).pipe(
      tap((response: HttpEvent<U>) => {
        console.log('after', response);
      }),
    );
  }
}
