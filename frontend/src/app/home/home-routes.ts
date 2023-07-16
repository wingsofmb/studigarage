import { type Routes } from '@angular/router';
import { HomeContainerComponent } from 'src/app/home/home-container/home-container.component';
import { HomePageComponent } from 'src/app/home/home-page/home-page.component';

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
        path: 'contact',
        component: HomePageComponent,
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
