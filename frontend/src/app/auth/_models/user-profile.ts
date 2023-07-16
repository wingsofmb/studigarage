import { UserRoles } from 'src/app/auth/_models/role.enum';

export interface UserProfile {
  id: number;
  email: string;
  role: UserRoles;
}
