import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskPage } from './TaskPage';
import type { UseTasksReturn } from '@/hooks/useTasks';
import { renderWithProviders } from '@/test/helpers';

// Mock custom hooks
const mockUseTasks = vi.fn();
vi.mock('@/hooks/useTasks', () => ({
  useTasks: () => mockUseTasks(),
}));

const mockUseAuth = vi.fn();
vi.mock('@/features/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/auth')>();
  return {
    ...actual,
    useAuth: () => mockUseAuth(),
  };
});

const mockTasksData: UseTasksReturn = {
  tasks: [
    { id: '1', title: 'Setup CI/CD Pipeline', status: 'TODO', priority: 'HIGH' },
    { id: '2', title: 'Write Integration Tests', status: 'IN_PROGRESS', priority: 'MEDIUM' },
  ],
  isLoading: false,
  error: null,
  fetchTasks: vi.fn(),
  addTask: vi.fn().mockResolvedValue({ id: '3', title: 'New Created Task', status: 'TODO', priority: 'LOW' }),
  updateTaskStatus: vi.fn(),
  deleteTask: vi.fn(),
};

describe('<TaskPage />', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup({ delay: null });
    vi.clearAllMocks();
    mockUseTasks.mockReturnValue(mockTasksData);
    mockUseAuth.mockReturnValue({
      user: { id: 'user-123', name: 'Test User', role: 'USER', email: 'user@taskflow.dev' },
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('renders page header and list of tasks correctly', () => {
    renderWithProviders(<TaskPage />);

    expect(screen.getByText('Task Overview')).toBeInTheDocument();
    expect(screen.getByText('Setup CI/CD Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Write Integration Tests')).toBeInTheDocument();
  });

  it('opens TaskForm modal when New Task button is clicked', async () => {
    renderWithProviders(<TaskPage />);

    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'New Task' }));

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('displays error banner when error state is present', async () => {
    mockUseTasks.mockReturnValue({
      ...mockTasksData,
      error: 'Failed to connect to backend server',
    });

    renderWithProviders(<TaskPage />);

    expect(screen.getByText('Failed to connect to backend server')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: 'Retry' });
    await user.click(retryBtn);

    expect(mockTasksData.fetchTasks).toHaveBeenCalledTimes(1);
  });

  it('submits new task through TaskForm modal and closes modal', async () => {
    renderWithProviders(<TaskPage />);

    // Open Modal
    await user.click(screen.getByRole('button', { name: 'New Task' }));

    // Fill Title
    const titleInput = screen.getByPlaceholderText('e.g. Implement Auth Guard');
    await user.type(titleInput, 'New Created Task');

    // Submit
    await user.click(screen.getByRole('button', { name: 'Create Task' }));

    await waitFor(() => {
      expect(mockTasksData.addTask).toHaveBeenCalledTimes(1);
    });

    expect(mockTasksData.addTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Created Task',
      })
    );

    // Modal should close on success
    await waitFor(() => {
      expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
    });
  });
});