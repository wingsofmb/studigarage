import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/auth/interceptors/auth.interceptor';
import { HttpLogInterceptor } from 'src/app/shared/interceptors/http-log.interceptor';

export const httpProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpLogInterceptor, multi: true },
];
