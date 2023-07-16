import { type Routes } from '@angular/router';
import { rolesGuard } from 'src/app/auth/_guards/roles.guard';
import { UserRoles } from 'src/app/auth/_models/role.enum';
import { CarManagementComponent } from 'src/app/setting/car-management/car-management.component';
import { SettingContainerComponent } from 'src/app/setting/setting-container/setting-container.component';
import { UserManagementComponent } from 'src/app/setting/user-management/user-management.component';

export const settingRoutes: Routes = [
  {
    path: '',
    component: SettingContainerComponent,
    children: [
      {
        path: 'car-management',
        canActivate: [rolesGuard([UserRoles.ADMIN, UserRoles.EMPLOYEE])],
        component: CarManagementComponent,
      },
      {
        path: 'user-management',
        canActivate: [rolesGuard([UserRoles.ADMIN], ['setting', '**'])],
        component: UserManagementComponent,
      },
      { path: '', redirectTo: 'car-management', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'car-management', pathMatch: 'full' },
];
