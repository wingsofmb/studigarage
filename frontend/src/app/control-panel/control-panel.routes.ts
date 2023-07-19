import { type Routes } from '@angular/router';
import { rolesGuard } from 'src/app/auth/_guards/roles.guard';
import { UserRoles } from 'src/data-layer/user/role.enum';
import { CarManagementComponent } from 'src/app/control-panel/car-management/car-management.component';
import { ControlPanelContainerComponent } from 'src/app/control-panel/control-panel-container/control-panel-container.component';
import { UserManagementComponent } from 'src/app/control-panel/user-management/user-management.component';
import { TimetableManagementComponent } from 'src/app/control-panel/timetable-management/timetable-management.component';
import { SettingManagementComponent } from 'src/app/control-panel/setting-management/setting-management.component';
import { RepairServiceManagementComponent } from 'src/app/control-panel/repair-service-management/repair-service-management.component';
import { ReviewManagementComponent } from 'src/app/control-panel/review-management/review-management.component';

export const controlPanelRoutes: Routes = [
  {
    path: '',
    component: ControlPanelContainerComponent,
    children: [
      {
        path: 'car-management',
        canActivate: [rolesGuard([UserRoles.ADMIN, UserRoles.EMPLOYEE])],
        component: CarManagementComponent,
      },
      {
        path: 'user-management',
        canActivate: [rolesGuard([UserRoles.ADMIN], ['control-panel', '**'])],
        component: UserManagementComponent,
      },
      {
        path: 'setting-management',
        canActivate: [rolesGuard([UserRoles.ADMIN], ['control-panel', '**'])],
        component: SettingManagementComponent,
      },
      {
        path: 'timetable-management',
        canActivate: [rolesGuard([UserRoles.ADMIN], ['control-panel', '**'])],
        component: TimetableManagementComponent,
      },
      {
        path: 'service-management',
        canActivate: [rolesGuard([UserRoles.ADMIN], ['control-panel', '**'])],
        component: RepairServiceManagementComponent,
      },
      {
        path: 'review-management',
        canActivate: [rolesGuard([UserRoles.ADMIN, UserRoles.EMPLOYEE], ['control-panel', '**'])],
        component: ReviewManagementComponent,
      },
      { path: '', redirectTo: 'car-management', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'car-management', pathMatch: 'full' },
];
