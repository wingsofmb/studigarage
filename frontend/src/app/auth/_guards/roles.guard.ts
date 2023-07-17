import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRoles } from 'src/data-layer/user/role.enum';
import { RolesService } from 'src/app/auth/_services/roles.service';

type RoleGuardFn = (authorizedRoles: UserRoles[], redirectTo?: string[]) => CanActivateFn;

export const rolesGuard: RoleGuardFn = (authorizedRoles, redirectTo) => {
  const handleFailure = () => {
    const router = inject(Router);
    return redirectTo ? router.createUrlTree(redirectTo) : false;
  };

  return () => {
    if (!authorizedRoles?.length) throw new Error('authorizedRoles must be defined and not empty');
    const rolesService = inject(RolesService);
    const currentRole = rolesService.getRole();
    if (!currentRole) return handleFailure();
    return authorizedRoles.includes(currentRole) ? true : handleFailure();
  };
};
