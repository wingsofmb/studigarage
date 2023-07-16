import { HttpInterceptorFn } from '@angular/common/http';
import { authInterceptorFn } from 'src/app/auth/interceptors/auth.interceptor';
import { httpLogInterceptorFn } from 'src/app/shared/interceptors/http-log.interceptor';

export const httpInterceptors: HttpInterceptorFn[] = [authInterceptorFn, httpLogInterceptorFn];
