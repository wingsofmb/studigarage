import { UserRoles } from 'src/data-layer/user/role.enum';

export interface StoredAuthProfile {
  token: string;
  id: number;
  email: string;
  role: UserRoles;
}

export const AUTH_STORAGE_KEY = 'CURRENT_AUTH_SESSION';
