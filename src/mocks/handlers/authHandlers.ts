import { http, HttpResponse } from "msw";
import { MOCK_USERS } from "../mockData";
import type { LoginCredentials } from "@/features/auth";

export const authHandlers = [
  // POST /api/auth/login
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginCredentials;
    const foundUser = MOCK_USERS[email];

    if (foundUser && password === 'password123') {
      return HttpResponse.json({
        user: foundUser,
        token: `mock-jwt-token-${foundUser.id}`,
      });
    }

    return HttpResponse.json(
      { message: 'auth.invalidCredentials' },
      { status: 401 }
    );
  }),

  // GET /api/auth/me
  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    const userId = authHeader.replace('Bearer mock-jwt-token-', '');
    const foundUser = Object.values(MOCK_USERS).find((u) => u.id === userId);

    if (foundUser) {
      return HttpResponse.json(foundUser);
    }

    return new HttpResponse(null, { status: 401 });
  }),
];