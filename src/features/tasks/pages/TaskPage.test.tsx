import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskPage } from './TaskPage';
import type { UseTasksReturn } from '@/hooks/useTasks';
import { renderWithRouter } from '@/test/helpers';

// Mock custom hook
const mockUseTasks = vi.fn();
vi.mock('@/hooks/useTasks', () => ({
  useTasks: () => mockUseTasks(),
}));

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
  });

  it('renders page header and list of tasks correctly', () => {
    renderWithRouter(<TaskPage />);

    expect(screen.getByText('Task Overview')).toBeInTheDocument();
    expect(screen.getByText('Setup CI/CD Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Write Integration Tests')).toBeInTheDocument();
  });

  it('opens TaskForm modal when New Task button is clicked', async () => {
    renderWithRouter(<TaskPage />);

    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'New Task' }));

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('displays error banner when error state is present', async () => {
    mockUseTasks.mockReturnValue({
      ...mockTasksData,
      error: 'Failed to connect to backend server',
    });

    renderWithRouter(<TaskPage />);

    expect(screen.getByText('Failed to connect to backend server')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: 'Retry' });
    await user.click(retryBtn);

    expect(mockTasksData.fetchTasks).toHaveBeenCalledTimes(1);
  });

  it('submits new task through TaskForm modal and closes modal', async () => {
    renderWithRouter(<TaskPage />);

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