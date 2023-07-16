import { UserProfile } from 'src/app/auth/_models/user-profile';

export interface AuthLoginPayload {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  access_token: string;
}

export type AuthProfileResponse = UserProfile;
