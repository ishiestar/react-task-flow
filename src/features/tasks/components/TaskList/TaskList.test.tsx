import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from './TaskList';
import type { Task } from '../../task.types';
import { renderWithRouter } from '@/test/helpers';

const mockTasks: Task[] = [
  { id: '1', title: 'Fix Layout Bug', status: 'TODO', priority: 'HIGH' },
  { id: '2', title: 'Write Documentation', status: 'IN_PROGRESS', priority: 'LOW' },
  { id: '3', title: 'Deploy to Vercel', status: 'COMPLETED', priority: 'MEDIUM' },
];

describe('<TaskList />', () => {
  it('renders all tasks by default', () => {
    renderWithRouter(<TaskList tasks={mockTasks} onStatusChange={vi.fn()} />);

    expect(screen.getByText('Fix Layout Bug')).toBeInTheDocument();
    expect(screen.getByText('Write Documentation')).toBeInTheDocument();
    expect(screen.getByText('Deploy to Vercel')).toBeInTheDocument();
  });

  it('filters tasks based on search text input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskList tasks={mockTasks} onStatusChange={vi.fn()} />);

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    await user.type(searchInput, 'Bug');

    expect(screen.getByText('Fix Layout Bug')).toBeInTheDocument();
    expect(screen.queryByText('Write Documentation')).not.toBeInTheDocument();
  });

  it('filters tasks based on selected status option', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskList tasks={mockTasks} onStatusChange={vi.fn()} />);

    const statusSelect = screen.getByRole('combobox', { name: 'Filter by Status' });
    await user.selectOptions(statusSelect, 'COMPLETED');

    expect(screen.getByText('Deploy to Vercel')).toBeInTheDocument();
    expect(screen.queryByText('Fix Layout Bug')).not.toBeInTheDocument();
  });
});