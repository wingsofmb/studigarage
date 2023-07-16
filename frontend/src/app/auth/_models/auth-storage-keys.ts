import { UserRoles } from 'src/app/auth/_models/role.enum';

export interface StoredAuthProfile {
  token: string;
  id: number;
  email: string;
  role: UserRoles;
}

export const AUTH_STORAGE_KEY = 'CURRENT_AUTH_SESSION';
