import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/helpers';
import { mockUsers } from '@/test/mocks';
import { ProfilePage } from './ProfilePage';

const mockUpdateProfile = vi.fn();

vi.mock('../../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../context/AuthContext')>();
  return {
    ...actual,
    useAuth: () => ({
      user: mockUsers.sarah,
      updateProfile: mockUpdateProfile,
    }),
  };
});

describe('<ProfilePage />', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup({ delay: null });
    vi.clearAllMocks();
  });

  it('renders initial user profile data and admin badge', () => {
    renderWithProviders(<ProfilePage />);

    expect(screen.getByRole('heading', { name: /account settings/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sarah Connor')).toBeInTheDocument();
    expect(screen.getByDisplayValue('sarah@taskflow.dev')).toBeInTheDocument();
    expect(screen.getByText(/Role: ADMIN/i)).toBeInTheDocument();
  });

  it('submits updated profile details on form save', async () => {
    mockUpdateProfile.mockResolvedValue(undefined);

    renderWithProviders(<ProfilePage />);

    const nameInput = screen.getByDisplayValue('Sarah Connor');
    await user.clear(nameInput);
    await user.type(nameInput, 'Sarah J. Connor');

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
    });

    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Sarah J. Connor',
        email: 'sarah@taskflow.dev',
      })
    );

    expect(await screen.findByText(/profile updated successfully/i)).toBeInTheDocument();
  });
});