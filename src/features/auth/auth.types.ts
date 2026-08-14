import { z } from 'zod';

export const USER_ROLES = ['ADMIN', 'USER'] as const;
export const userRoleSchema = z.enum(USER_ROLES);
export type UserRole = z.infer<typeof userRoleSchema>;

export const loginSchema = z.object({
  email: z.email('auth.validation.invalidEmail'),
  password: z.string().min(6, 'auth.validation.passwordTooShort'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, 'auth.profile.validation.nameMin'),
  email: z.email('auth.validation.emailInvalid'),
  avatarUrl: z.url('auth.profile.validation.invalidUrl').or(z.literal('')).optional(),
  bio: z.string().max(160, 'auth.profile.validation.bioMax').optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UpdateProfileInput {
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileInput) => Promise<void>;
}
