import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/topics/auth/decorators/roles.decorator';
import { UserRoleMapping, UserRoles } from 'src/topics/user/role.enum';
import * as _ from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) return true;
    if (requiredRoles.includes(UserRoles.PUBLIC)) return true;

    const { user } = context.switchToHttp().getRequest();
    const highestRequiredRole = _.max(requiredRoles.map((role: UserRoles) => UserRoleMapping[role]));
    return UserRoleMapping[user.role] >= highestRequiredRole;
  }
}
