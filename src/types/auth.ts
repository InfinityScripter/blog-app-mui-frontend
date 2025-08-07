import type { User } from './domain';

export interface AccessTokenResponse {
  accessToken: string;
  user: User;
} 