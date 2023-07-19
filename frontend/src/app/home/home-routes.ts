import { type Routes } from '@angular/router';
import { logInGuard } from 'src/app/auth/_guards/log-in.guard';
import { HomeContainerComponent } from 'src/app/home/home-container/home-container.component';
import { HomePageComponent } from 'src/app/home/home-page/home-page.component';
import { ServicesContainerComponent } from 'src/app/home/services-container/services-container.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeContainerComponent,
    children: [
      {
        path: 'home',
        component: HomePageComponent,
      },
      {
        path: 'offers',
        component: HomePageComponent,
      },
      {
        path: 'services',
        component: ServicesContainerComponent,
      },
      {
        path: 'control-panel',
        canActivateChild: [logInGuard],
        loadChildren: () => import('src/app/control-panel/control-panel.routes').then((mod) => mod.controlPanelRoutes),
      },
      {
        path: 'auth',
        loadChildren: () => import('src/app/auth/auth-routes').then((mod) => mod.authRoutes),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
