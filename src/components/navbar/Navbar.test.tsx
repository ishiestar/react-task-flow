import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from './Navbar';
import { renderWithProviders } from '@/test/helpers';
import { mockUsers } from '@/test/mocks';
import { ThemeProvider } from '@/theme/context/ThemeContext';

const mockLogout = vi.fn();

vi.mock('../../features/auth/context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../features/auth/context/AuthContext')>();
  return {
    ...actual,
    useAuth: () => ({
      user: mockUsers.sarah,
      logout: mockLogout,
    }),
  };
});

const renderWithThemeProvider = (ui: React.ReactElement) => {
  return renderWithProviders(ui, { extraProviders: [ThemeProvider] });
}

describe('<Navbar />', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup({ delay: null });
    vi.clearAllMocks();
  });

  it('renders brand, nav links, and active user credentials with role badge', () => {
    renderWithThemeProvider(<Navbar />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getAllByText('Tasks')).toHaveLength(2); // One in the nav and one in the search placeholder
    expect(screen.getAllByText('Analytics')).toHaveLength(2); // One in the nav and one in the page header  
    expect(screen.getByText('Sarah Connor')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it('triggers logout callback on clicking the logout action button', async () => {
    renderWithThemeProvider(<Navbar />);

    const logoutButton = screen.getByRole('button', { name: /sign out|logout/i });
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});