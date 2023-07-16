import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from 'src/app/app-routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { authInterceptorFn } from 'src/app/auth/_interceptors/auth.interceptor';
import { httpLogInterceptorFn } from 'src/app/shared/_interceptors/http-log.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptorFn, httpLogInterceptorFn])),
    provideRouter(appRoutes),
    provideAnimations(),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
  ],
}).catch((e) => {
  console.error(e);
});
