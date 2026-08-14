import { vi } from 'vitest';
import type { Task } from '@/features/tasks';
import type { UseTasksReturn } from '@/hooks/useTasks';
import type { AnalyticsMetrics } from '@/features/analytics/analytics.types';

/**
 * Mock user objects for testing
 */
export const mockUsers = {
  admin: {
    id: 'user-admin',
    name: 'Admin User',
    role: 'ADMIN' as const,
    email: 'admin@taskflow.dev',
  },
  user: {
    id: 'user-123',
    name: 'Test User',
    role: 'USER' as const,
    email: 'user@taskflow.dev',
  },
  sarah: {
    id: 'usr-admin',
    name: 'Sarah Connor',
    email: 'sarah@taskflow.dev',
    role: 'ADMIN' as const,
    bio: 'Lead Engineer',
  },
};

/**
 * Helper to create test tasks
 */
export const createTask = (overrides?: Partial<Task>): Task => ({
  id: 'task-123',
  title: 'Implement TaskCard Component',
  description: 'Build a co-located React component for daily task management.',
  status: 'TODO',
  priority: 'HIGH',
  dueDate: '2026-08-01T00:00:00.000Z',
  createdBy: 'user-admin',
  ...overrides,
});

/**
 * Default mock return value for useTasks hook
 */
export const defaultMockTasksReturn: UseTasksReturn = {
  tasks: [],
  isLoading: false,
  error: null,
  fetchTasks: vi.fn(),
  addTask: vi.fn(),
  updateTaskStatus: vi.fn(),
  deleteTask: vi.fn(),
};

/**
 * Sample mock tasks for testing
 */
export const mockTasksData: UseTasksReturn = {
  tasks: [
    {
      id: '1',
      title: 'Setup CI/CD Pipeline',
      status: 'TODO',
      priority: 'HIGH',
      createdBy: 'user-123',
    },
    {
      id: '2',
      title: 'Write Integration Tests',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      createdBy: 'user-123',
    },
  ],
  isLoading: false,
  error: null,
  fetchTasks: vi.fn(),
  addTask: vi.fn().mockResolvedValue({
    id: '3',
    title: 'New Created Task',
    status: 'TODO',
    priority: 'LOW',
    createdBy: 'user-123',
  }),
  updateTaskStatus: vi.fn(),
  deleteTask: vi.fn(),
};

/**
 * Default auth mock return value for most tests
 */
export const defaultAuthReturn = {
  user: mockUsers.user,
  isAuthenticated: true,
  isLoading: false,
};

/**
 * Admin auth mock return value for tests requiring admin permissions
 */
export const adminAuthReturn = {
  user: mockUsers.admin,
  isAuthenticated: true,
  isLoading: false,
};

/**
 * Helper to create test analytics metrics
 */
export const createMetrics = (overrides?: Partial<AnalyticsMetrics>): AnalyticsMetrics => ({
  totalTasks: 4,
  completedTasks: 2,
  inProgressTasks: 1,
  todoTasks: 1,
  completionRate: 50,
  overdueTasks: 0,
  priorityDistribution: {
    HIGH: 2,
    MEDIUM: 1,
    LOW: 1,
  },
  statusDistribution: {
    COMPLETED: 2,
    IN_PROGRESS: 1,
    TODO: 1,
  },
  ...overrides,
});
