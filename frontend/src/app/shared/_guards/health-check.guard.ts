import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { BackendService } from 'src/data-layer/_shared/backend.service';

export const healthCheckGuard: CanActivateFn = () => {
  const backendService = inject(BackendService);
  const router = inject(Router);
  return backendService.get('health-check').pipe(
    map(() => true),
    catchError((error) => {
      console.error(error);
      return of(router.createUrlTree(['500']));
    }),
  );
};
