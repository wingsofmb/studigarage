import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/topics/user/role.enum';

export const ROLES_KEY = 'userRoles';
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
