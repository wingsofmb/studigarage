import { type Routes } from '@angular/router';
import { healthCheckGuard } from 'src/app/shared/_guards/health-check.guard';

export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [healthCheckGuard],
    loadChildren: () => import('src/app/home/home-routes').then((mod) => mod.homeRoutes),
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
