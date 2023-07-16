import { HttpEvent, HttpRequest, HttpInterceptorFn, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

export const httpLogInterceptorFn: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const started = Date.now();

  const logFn = (response: HttpResponse<unknown>) => {
    if (response.type < 4) return; // We expect a response, not all httpEvents
    const responseStatus = (response as HttpResponse<unknown>).status;
    const statusStr = responseStatus >= 400 ? `\x1b[31m${responseStatus}\x1b[0m` : `\x1b[32m${responseStatus}\x1b[0m`;
    const elapsed = Date.now() - started;
    console.info(`\x1b[35m[${req.method}]:${statusStr} \x1b[0m${req.urlWithParams} in ${elapsed}ms`);
  };

  const handlerFn = (event: HttpEvent<unknown>) => {
    if (event.type < 4) return; // We expect a response, not all httpEvents
    logFn(event as HttpResponse<unknown>);
  };

  return next(req).pipe(
    tap({
      next: handlerFn,
      error: handlerFn,
    }),
  );
};
