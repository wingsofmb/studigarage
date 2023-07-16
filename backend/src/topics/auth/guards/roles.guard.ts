import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/topics/auth/decorators/roles.decorator';
import { UserRoles } from 'src/topics/user/role.enum';
import * as _ from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    const { user, method, originalUrl } = context.switchToHttp().getRequest();
    if (_.isNil(requiredRoles)) return true;
    if (_.isEmpty(requiredRoles)) throw new Error(`requiredRoles must be defined for route ${method} ${originalUrl}`);

    return requiredRoles.includes(user.role);
  }
}
