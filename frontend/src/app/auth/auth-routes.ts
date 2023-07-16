import { type Routes } from '@angular/router';
import { AuthContainerComponent } from 'src/app/auth/auth-container/auth-container.component';
import { logInGuard } from 'src/app/auth/guards/log-in.guard';
import { logOutGuard } from 'src/app/auth/guards/log-out.guard';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { LogoutComponent } from 'src/app/auth/logout/logout.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthContainerComponent,
    children: [
      {
        path: 'login',
        canActivate: [logOutGuard],
        component: LoginComponent,
      },
      {
        path: 'logout',
        canActivate: [logInGuard],
        component: LogoutComponent,
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
