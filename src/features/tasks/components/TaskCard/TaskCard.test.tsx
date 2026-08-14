import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/helpers';
import { createTask, adminAuthReturn, mockUsers } from '@/test/mocks';
import { TaskCard } from './TaskCard';

// Mock the auth module
vi.mock('@/features/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/auth')>();
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

import { useAuth } from '@/features/auth';

describe('<TaskCard />', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup({ delay: null });
    vi.clearAllMocks();
    // Default to admin user
    (useAuth as any).mockReturnValue(adminAuthReturn);
  });

  describe('Rendering', () => {
    it('renders task with all properties', () => {
      const task = createTask();
      renderWithProviders(<TaskCard task={task} onStatusChange={vi.fn()} onDelete={vi.fn()} />);

      expect(screen.getByText('Implement TaskCard Component')).toBeInTheDocument();
      expect(
        screen.getByText('Build a co-located React component for daily task management.')
      ).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Aug 1, 2026')).toBeInTheDocument();
    });

    it('renders task without description', () => {
      const task = createTask({ description: undefined });
      renderWithProviders(<TaskCard task={task} onStatusChange={vi.fn()} />);

      expect(screen.getByText('Implement TaskCard Component')).toBeInTheDocument();
      expect(screen.queryByText(/Build a co-located/)).not.toBeInTheDocument();
    });

    it('renders task without due date', () => {
      const task = createTask({ dueDate: undefined });
      renderWithProviders(<TaskCard task={task} onStatusChange={vi.fn()} />);

      expect(screen.getByText('Implement TaskCard Component')).toBeInTheDocument();
      expect(screen.queryByText(/Aug 1, 2026/)).not.toBeInTheDocument();
    });

    it('renders task without description and due date', () => {
      const task = createTask({ description: undefined, dueDate: undefined });
      renderWithProviders(<TaskCard task={task} onStatusChange={vi.fn()} />);

      expect(screen.getByText('Implement TaskCard Component')).toBeInTheDocument();
      expect(screen.queryByText(/Build a co-located/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Aug 1, 2026/)).not.toBeInTheDocument();
    });

    it('renders task card with proper styling for TODO status', () => {
      const task = createTask({ status: 'TODO' });
      const { container } = renderWithProviders(
        <TaskCard task={task} onStatusChange={vi.fn()} />
      );

      const cardDiv = container.querySelector('[data-testid="task-card-task-123"]');
      expect(cardDiv).not.toHaveClass('opacity-75');
    });

    it('renders task card with completed styling when status is COMPLETED', () => {
      const task = createTask({ status: 'COMPLETED' });
      const { container } = renderWithProviders(
        <TaskCard task={task} onStatusChange={vi.fn()} />
      );

      const cardDiv = container.querySelector('[data-testid="task-card-task-123"]');
      expect(cardDiv).toHaveClass('opacity-75');

      const titleElement = screen.getByText('Implement TaskCard Component');
      expect(titleElement).toHaveClass('line-through', 'text-slate-500');
    });
  });

  describe('Priority Badge', () => {
    it('renders LOW priority badge', () => {
      const task = createTask({ priority: 'LOW' });
      renderWithProviders(<TaskCard task={task} onStatusChange={vi.fn()} />);

      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('renders MEDIUM priority badge', () => {
      const task = createTask({ priority: 'MEDIUM' });
      renderWithProviders(<TaskCard task={task} onStatusChange={vi.fn()} />);

      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('renders HIGH priority badge', () => {
      const task = createTask({ priority: 'HIGH' });
      renderWithProviders(<TaskCard task={task} onStatusChange={vi.fn()} />);

      expect(screen.getByText('High')).toBeInTheDocument();
    });
  });

  describe('Status Changes', () => {
    it('changes status from TODO to IN_PROGRESS', async () => {
      const handleStatusChange = vi.fn();
      const task = createTask({ status: 'TODO' });

      renderWithProviders(
        <TaskCard task={task} onStatusChange={handleStatusChange} />
      );

      const statusSelect = screen.getByRole('combobox', {
        name: 'Change status for Implement TaskCard Component',
      });

      await user.selectOptions(statusSelect, 'IN_PROGRESS');

      expect(handleStatusChange).toHaveBeenCalledWith('task-123', 'IN_PROGRESS');
    });

    it('changes status from TODO to COMPLETED', async () => {
      const handleStatusChange = vi.fn();
      const task = createTask({ status: 'TODO' });

      renderWithProviders(
        <TaskCard task={task} onStatusChange={handleStatusChange} />
      );

      const statusSelect = screen.getByRole('combobox', {
        name: 'Change status for Implement TaskCard Component',
      });

      await user.selectOptions(statusSelect, 'COMPLETED');

      expect(handleStatusChange).toHaveBeenCalledWith('task-123', 'COMPLETED');
    });

    it('changes status from COMPLETED to TODO', async () => {
      const handleStatusChange = vi.fn();
      const task = createTask({ status: 'COMPLETED' });

      renderWithProviders(
        <TaskCard task={task} onStatusChange={handleStatusChange} />
      );

      const statusSelect = screen.getByRole('combobox', {
        name: 'Change status for Implement TaskCard Component',
      });

      await user.selectOptions(statusSelect, 'TODO');

      expect(handleStatusChange).toHaveBeenCalledWith('task-123', 'TODO');
    });

    it('displays current status in dropdown', () => {
      const task = createTask({ status: 'IN_PROGRESS' });
      renderWithProviders(<TaskCard task={task} onStatusChange={vi.fn()} />);

      const statusSelect = screen.getByRole('combobox') as HTMLSelectElement;
      expect(statusSelect.value).toBe('IN_PROGRESS');
    });
  });

  describe('Delete Button', () => {
    it('shows delete button when ADMIN user', () => {
      const task = createTask();
      (useAuth as any).mockReturnValue({
        user: mockUsers.admin,
      });

      renderWithProviders(
        <TaskCard task={task} onStatusChange={vi.fn()} onDelete={vi.fn()} />
      );

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('shows delete button when USER created the task', () => {
      const task = createTask({ createdBy: 'user-123' });
      (useAuth as any).mockReturnValue({
        user: mockUsers.user,
      });

      renderWithProviders(
        <TaskCard task={task} onStatusChange={vi.fn()} onDelete={vi.fn()} />
      );

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('hides delete button when USER did not create the task', () => {
      const task = createTask({ createdBy: 'user-admin' });
      (useAuth as any).mockReturnValue({
        user: mockUsers.user,
      });

      renderWithProviders(
        <TaskCard task={task} onStatusChange={vi.fn()} onDelete={vi.fn()} />
      );

      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('hides delete button when onDelete is not provided', () => {
      const task = createTask();
      renderWithProviders(<TaskCard task={task} onStatusChange={vi.fn()} />);

      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('hides delete button when user is null', () => {
      const task = createTask();
      (useAuth as any).mockReturnValue({
        user: null,
      });

      renderWithProviders(
        <TaskCard task={task} onStatusChange={vi.fn()} onDelete={vi.fn()} />
      );

      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('calls onDelete with task id when delete button is clicked', async () => {
      const handleDelete = vi.fn();
      const task = createTask();

      renderWithProviders(
        <TaskCard task={task} onStatusChange={vi.fn()} onDelete={handleDelete} />
      );

      const deleteBtn = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteBtn);

      expect(handleDelete).toHaveBeenCalledTimes(1);
      expect(handleDelete).toHaveBeenCalledWith('task-123');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label on delete button with task title', () => {
      const task = createTask({ title: 'Custom Task Title' });
      renderWithProviders(
        <TaskCard task={task} onStatusChange={vi.fn()} onDelete={vi.fn()} />
      );

      const deleteBtn = screen.getByRole('button', { name: /delete.*Custom Task Title/i });
      expect(deleteBtn).toBeInTheDocument();
    });

    it('has proper aria-label on status select with task title', () => {
      const task = createTask({ title: 'Custom Task Title' });
      renderWithProviders(<TaskCard task={task} onStatusChange={vi.fn()} />);

      const statusSelect = screen.getByRole('combobox', {
        name: /change status.*Custom Task Title/i,
      });
      expect(statusSelect).toBeInTheDocument();
    });
  });
});