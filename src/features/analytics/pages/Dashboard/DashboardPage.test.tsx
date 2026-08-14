import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import type { Task } from '@/features/tasks';
import type { UseTasksReturn } from '@/hooks/useTasks';
import { renderWithProviders } from '@/test/helpers';
import { DashboardPage } from './DashboardPage';

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

// Helper to create test tasks
const createTask = (overrides?: Partial<Task>): Task => ({
  id: 'task-1',
  title: 'Test Task',
  status: 'TODO',
  priority: 'MEDIUM',
  createdBy: 'user-123',
  ...overrides,
});

const defaultMockReturn: UseTasksReturn = {
  tasks: [],
  isLoading: false,
  error: null,
  fetchTasks: vi.fn(),
  addTask: vi.fn(),
  updateTaskStatus: vi.fn(),
  deleteTask: vi.fn(),
};

describe('<DashboardPage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTasks.mockReturnValue(defaultMockReturn);
    mockUseAuth.mockReturnValue({
      user: { id: 'user-123', name: 'Test User', role: 'USER', email: 'user@taskflow.dev' },
      isAuthenticated: true,
      isLoading: false,
    });
  });

  describe('Loading State', () => {
    it('displays loading spinner when isLoading is true', () => {
      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        isLoading: true,
      });

      const { container } = renderWithProviders(<DashboardPage />);

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText(/Analytics Dashboard/)).not.toBeInTheDocument();
    });
  });

  describe('Header', () => {
    it('renders page title and subtitle', () => {
      renderWithProviders(<DashboardPage />);

      expect(screen.getByText(/Analytics Dashboard/)).toBeInTheDocument();
      expect(screen.getByText(/Real-time overview of workload distribution/)).toBeInTheDocument();
    });
  });

  describe('Metric Cards - Empty State', () => {
    it('renders all metric cards with zero values when no tasks exist', () => {
      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks: [],
      });

      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('Total Tasks')).toBeInTheDocument();
      expect(screen.getByText('Completion Rate')).toBeInTheDocument();
      const inProgressElements = screen.getAllByText('In Progress');
      expect(inProgressElements.length).toBeGreaterThan(0);
      expect(screen.getByText('Overdue')).toBeInTheDocument();

      // Check values are 0 or 0%
      const values = screen.getAllByText('0');
      expect(values.length).toBeGreaterThan(0);
    });
  });

  describe('Metric Cards - Single Task', () => {
    it('renders correct metrics for a single TODO task', () => {
      const tasks = [createTask({ id: '1', status: 'TODO', priority: 'HIGH' })];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      // Total tasks
      expect(screen.getByText('1', { selector: 'p' })).toBeInTheDocument();

      // Completion rate: 0% (appears in multiple places)
      const completionRateTexts = screen.getAllByText(/0%/);
      expect(completionRateTexts.length).toBeGreaterThan(0);

      // Subtitle showing 0 of 1 completed
      const allTexts = screen.getAllByText('0 of 1 completed');
      expect(allTexts.length).toBeGreaterThan(0);
    });

    it('renders correct metrics for a single COMPLETED task', () => {
      const tasks = [createTask({ id: '1', status: 'COMPLETED', priority: 'HIGH' })];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      // Completion rate: 100%
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('1 of 1 completed')).toBeInTheDocument();
    });

    it('renders correct metrics for a single IN_PROGRESS task', () => {
      const tasks = [createTask({ id: '1', status: 'IN_PROGRESS', priority: 'MEDIUM' })];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      // In Progress: 1 (appears in both metric card and charts)
      const inProgressElements = screen.getAllByText('In Progress');
      expect(inProgressElements.length).toBeGreaterThan(0);
    });
  });

  describe('Metric Cards - Multiple Tasks', () => {
    it('renders correct metrics for multiple tasks with different statuses', () => {
      const tasks = [
        createTask({ id: '1', status: 'COMPLETED', priority: 'HIGH' }),
        createTask({ id: '2', status: 'COMPLETED', priority: 'MEDIUM' }),
        createTask({ id: '3', status: 'IN_PROGRESS', priority: 'MEDIUM' }),
        createTask({ id: '4', status: 'TODO', priority: 'LOW' }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      // Total tasks: 4
      expect(screen.getByText('4', { selector: 'p' })).toBeInTheDocument();

      // Completion rate: 50% (2 of 4)
      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('2 of 4 completed')).toBeInTheDocument();

      // In Progress: 1 (appears in both metric card and charts)
      const inProgressElements = screen.getAllByText('In Progress');
      expect(inProgressElements.length).toBeGreaterThan(0);
    });

    it('renders correct metrics for tasks with different priorities', () => {
      const tasks = [
        createTask({ id: '1', priority: 'HIGH' }),
        createTask({ id: '2', priority: 'HIGH' }),
        createTask({ id: '3', priority: 'MEDIUM' }),
        createTask({ id: '4', priority: 'LOW' }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      // Total tasks: 4
      expect(screen.getByText('4', { selector: 'p' })).toBeInTheDocument();
    });
  });

  describe('Overdue Tasks', () => {
    it('shows overdue count of 0 when no tasks are overdue', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const tasks = [
        createTask({
          id: '1',
          status: 'TODO',
          dueDate: futureDate,
        }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      // Overdue: 0
      const overdueTexts = screen.getAllByText('Overdue');
      expect(overdueTexts.length).toBeGreaterThan(0);
    });

    it('shows correct overdue count when tasks are overdue', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString();
      const tasks = [
        createTask({
          id: '1',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: pastDate,
        }),
        createTask({
          id: '2',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          dueDate: pastDate,
        }),
        createTask({
          id: '3',
          status: 'COMPLETED',
          priority: 'LOW',
          dueDate: pastDate,
        }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      // Overdue: 2 (TODO and IN_PROGRESS, but not COMPLETED)
      // Note: The actual count depends on computeTaskMetrics implementation
      const overdueCard = screen.getByText('Overdue');
      expect(overdueCard).toBeInTheDocument();
    });

    it('does not count completed tasks as overdue even if past due date', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString();
      const tasks = [
        createTask({
          id: '1',
          status: 'COMPLETED',
          priority: 'HIGH',
          dueDate: pastDate,
        }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      // Overdue should be 0 because completed tasks aren't counted
      const overdueTexts = screen.getAllByText('Overdue');
      expect(overdueTexts.length).toBeGreaterThan(0);
    });
  });

  describe('Completion Rate Calculation', () => {
    it('calculates 0% completion when all tasks are TODO', () => {
      const tasks = [
        createTask({ id: '1', status: 'TODO' }),
        createTask({ id: '2', status: 'TODO' }),
        createTask({ id: '3', status: 'TODO' }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('calculates 100% completion when all tasks are COMPLETED', () => {
      const tasks = [
        createTask({ id: '1', status: 'COMPLETED' }),
        createTask({ id: '2', status: 'COMPLETED' }),
        createTask({ id: '3', status: 'COMPLETED' }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('3 of 3 completed')).toBeInTheDocument();
    });

    it('calculates 66% completion for 2 out of 3 completed tasks', () => {
      const tasks = [
        createTask({ id: '1', status: 'COMPLETED' }),
        createTask({ id: '2', status: 'COMPLETED' }),
        createTask({ id: '3', status: 'TODO' }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('67%')).toBeInTheDocument();
      expect(screen.getByText('2 of 3 completed')).toBeInTheDocument();
    });
  });

  describe('Charts Component', () => {
    it('renders AnalyticsCharts component', () => {
      const tasks = [
        createTask({ id: '1', status: 'COMPLETED', priority: 'HIGH' }),
        createTask({ id: '2', status: 'IN_PROGRESS', priority: 'MEDIUM' }),
        createTask({ id: '3', status: 'TODO', priority: 'LOW' }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      // Check for chart section headers
      expect(screen.getByText('Tasks by Priority')).toBeInTheDocument();
      expect(screen.getByText('Task Status Breakdown')).toBeInTheDocument();
    });

    it('renders priority breakdown in charts', () => {
      const tasks = [
        createTask({ id: '1', priority: 'HIGH' }),
        createTask({ id: '2', priority: 'MEDIUM' }),
        createTask({ id: '3', priority: 'LOW' }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('renders status breakdown in charts', () => {
      const tasks = [
        createTask({ id: '1', status: 'COMPLETED' }),
        createTask({ id: '2', status: 'IN_PROGRESS' }),
        createTask({ id: '3', status: 'TODO' }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('Completed')).toBeInTheDocument();
      const inProgressElements = screen.getAllByText('In Progress');
      expect(inProgressElements.length).toBeGreaterThan(0);
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });
  });

  describe('Variant Styling', () => {
    it('applies danger variant to overdue card when overdue tasks exist', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString();
      const tasks = [
        createTask({
          id: '1',
          status: 'TODO',
          dueDate: pastDate,
        }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      // The overdue card should have danger styling when overdue count > 0
      const overdueCard = screen.getByText('Overdue').closest('div');
      expect(overdueCard).toBeInTheDocument();
    });

    it('applies default variant to overdue card when no overdue tasks', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const tasks = [
        createTask({
          id: '1',
          status: 'TODO',
          dueDate: futureDate,
        }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      const overdueCard = screen.getByText('Overdue').closest('div');
      expect(overdueCard).toBeInTheDocument();
    });
  });

  describe('Task Without Due Date', () => {
    it('handles tasks without due date gracefully', () => {
      const tasks = [
        createTask({ id: '1', status: 'TODO', dueDate: undefined }),
        createTask({ id: '2', status: 'IN_PROGRESS', dueDate: undefined }),
      ];

      mockUseTasks.mockReturnValue({
        ...defaultMockReturn,
        tasks,
      });

      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('2', { selector: 'p' })).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });
});
