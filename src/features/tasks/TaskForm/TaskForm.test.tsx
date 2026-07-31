import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from './TaskForm';
import type { Task } from '@/features/tasks';

const mockInitialTask: Task = {
  id: 'task-100',
  title: 'Existing Refactor Task',
  description: 'Refactor types and components',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  dueDate: '2026-08-15T00:00:00.000Z',
};

describe('<TaskForm />', () => {
  it('does not render when isOpen is false', () => {
    render(<TaskForm isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
  });

  it('renders create modal title when no initialValues are passed', () => {
    render(<TaskForm isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Task' })).toBeInTheDocument();
  });

  it('populates initial form values correctly in edit mode', () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        initialValues={mockInitialTask}
      />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Refactor Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Refactor types and components')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-08-15')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });

  it('displays validation error when submitting an empty title', async () => {
    const user = userEvent.setup();
    render(<TaskForm isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    const submitBtn = screen.getByRole('button', { name: 'Create Task' });
    await user.click(submitBtn);

    expect(await screen.findByText('Task title is required')).toBeInTheDocument();
  });

  it('triggers onSubmit with validated form values', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<TaskForm isOpen={true} onClose={vi.fn()} onSubmit={handleSubmit} />);

    const titleInput = screen.getByPlaceholderText('e.g. Implement Auth Guard');
    await user.type(titleInput, 'Build TaskPage Dashboard');

    const descInput = screen.getByPlaceholderText('Add details about this task...');
    await user.type(descInput, 'Integrate TaskList with useTasks hook');

    await user.click(screen.getByRole('button', { name: 'Create Task' }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Build TaskPage Dashboard',
        description: 'Integrate TaskList with useTasks hook',
        status: 'TODO',
        priority: 'MEDIUM',
      }),
      expect.anything()
    );
  });

  it('calls onClose when cancel button or close icon is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(<TaskForm isOpen={true} onClose={handleClose} onSubmit={vi.fn()} />);

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});