import { QueryParams } from 'src/data-layer/_shared/http.model';

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type UpdateUserPayload = CreateUserPayload;

export type GetAllUserPayload = QueryParams & {
  offset?: number;
  limit?: number;
};
