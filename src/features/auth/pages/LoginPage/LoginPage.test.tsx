import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './LoginPage';

const mockLogin = vi.fn();
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

const renderLoginPage = () => {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<div>Dashboard Home</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('<LoginPage />', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup({ delay: null });
    vi.clearAllMocks();
  });

  it('renders login form elements correctly', () => {
    renderLoginPage();

    // Match actual rendered translated button / heading text ("Sign In")
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('user@taskflow.dev')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('displays validation errors on submitting empty fields', async () => {
    renderLoginPage();

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitBtn);

    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('calls login() and navigates to target path on valid credentials', async () => {
    mockLogin.mockResolvedValue(undefined);
    renderLoginPage();

    await user.type(screen.getByPlaceholderText('user@taskflow.dev'), 'admin@taskflow.dev');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'admin@taskflow.dev',
      password: 'password123',
    });

    expect(await screen.findByText('Dashboard Home')).toBeInTheDocument();
  });

  it('renders auth error message on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('auth.invalidCredentials'));
    renderLoginPage();

    await user.type(screen.getByPlaceholderText('user@taskflow.dev'), 'wrong@taskflow.dev');
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpass');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });
});