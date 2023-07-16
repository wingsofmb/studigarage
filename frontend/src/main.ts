import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from 'src/app/app-routes';
import { provideHttpClient } from '@angular/common/http';
import { httpProviders } from 'src/app/shared/http-interceptors-provider';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

bootstrapApplication(AppComponent, {
  providers: [
    ...httpProviders,
    provideHttpClient(),
    provideRouter(appRoutes),
    provideAnimations(),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
  ],
}).catch((e) => {
  console.error(e);
});
