import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpLogInterceptor implements HttpInterceptor {
  public intercept<T, U>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<U>> {
    console.info(`[${req.method}] ${req.urlWithParams}`);
    return next.handle(req);
  }
}
