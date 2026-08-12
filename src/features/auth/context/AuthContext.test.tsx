import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { AuthProvider, useAuth } from './AuthContext';
import type { User } from '../auth.types';

const mockAdminUser: User = {
  id: 'user-admin',
  email: 'admin@taskflow.dev',
  name: 'Admin User',
  role: 'ADMIN',
};

const server = setupServer(
  http.post('/api/auth/login', async ({ request }) => {
    const { email } = (await request.json()) as { email: string };
    if (email === 'admin@taskflow.dev') {
      return HttpResponse.json({ user: mockAdminUser, token: 'valid-jwt-token' });
    }
    return HttpResponse.json({ message: 'auth.invalidCredentials' }, { status: 401 });
  }),
  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (authHeader === 'Bearer valid-jwt-token') {
      return HttpResponse.json(mockAdminUser);
    }
    return new HttpResponse(null, { status: 401 });
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  it('initializes with unauthenticated state when localStorage is empty', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('restores user session on mount when valid token exists in localStorage', async () => {
    localStorage.setItem('taskflow_auth_token', 'valid-jwt-token');

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('admin@taskflow.dev');
  });

  it('authenticates user successfully on login()', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login({ email: 'admin@taskflow.dev', password: 'password123' });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.name).toBe('Admin User');
    expect(localStorage.getItem('taskflow_auth_token')).toBe('valid-jwt-token');
  });

  it('clears session on logout()', async () => {
    localStorage.setItem('taskflow_auth_token', 'valid-jwt-token');

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('taskflow_auth_token')).toBeNull();
  });
});