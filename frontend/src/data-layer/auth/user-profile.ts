import { UserRoles } from 'src/data-layer/user/role.enum';

export interface UserProfile {
  id: number;
  email: string;
  role: UserRoles;
}
