import { HttpRequest, HttpInterceptorFn, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/auth/_services/auth.service';

export const authInterceptorFn: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const authRequest = token ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }) : req;
  return next(authRequest).pipe(
    tap({
      error: (event: HttpEvent<unknown>) => {
        if (event.type < 4) return;
        if (+(event as HttpResponse<unknown>).status !== 401) return;

        authService.logout();
      },
    }),
  );
};
