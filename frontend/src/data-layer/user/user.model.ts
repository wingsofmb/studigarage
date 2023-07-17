import { UserRoles } from 'src/data-layer/user/role.enum';

export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
}
