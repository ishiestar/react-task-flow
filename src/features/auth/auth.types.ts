import { z } from 'zod';

export const USER_ROLES = ['ADMIN', 'USER'] as const;
export const userRoleSchema = z.enum(USER_ROLES);
export type UserRole = z.infer<typeof userRoleSchema>;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export const loginSchema = z.object({
  email: z.email('auth.validation.invalidEmail').min(1, 'auth.validation.emailRequired'),
  password: z.string().min(6, 'auth.validation.passwordTooShort'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}