import { describe, expect, it } from 'vitest';
import type { Task } from '../tasks';
import { computeTaskMetrics } from './analytics.utils';

describe('computeTaskMetrics', () => {
  it('returns zeroed metrics for empty task array', () => {
    const metrics = computeTaskMetrics([]);
    expect(metrics.totalTasks).toBe(0);
    expect(metrics.completionRate).toBe(0);
    expect(metrics.completedTasks).toBe(0);
    expect(metrics.overdueTasks).toBe(0);
  });

  it('computes status and priority distributions and completion percentage correctly', () => {
    const mockTasks: Task[] = [
      { id: '1', title: 'T1', status: 'COMPLETED', priority: 'HIGH' },
      { id: '2', title: 'T2', status: 'COMPLETED', priority: 'LOW' },
      { id: '3', title: 'T3', status: 'IN_PROGRESS', priority: 'MEDIUM' },
      { id: '4', title: 'T4', status: 'TODO', priority: 'HIGH' },
    ];

    const metrics = computeTaskMetrics(mockTasks);

    expect(metrics.totalTasks).toBe(4);
    expect(metrics.completedTasks).toBe(2);
    expect(metrics.inProgressTasks).toBe(1);
    expect(metrics.todoTasks).toBe(1);
    expect(metrics.completionRate).toBe(50); // 2/4 = 50%

    expect(metrics.priorityDistribution.HIGH).toBe(2);
    expect(metrics.priorityDistribution.MEDIUM).toBe(1);
    expect(metrics.priorityDistribution.LOW).toBe(1);
  });

  it('identifies overdue tasks when dueDate is in the past and task is not completed', () => {
    const pastDate = new Date(Date.now() - 86400000).toISOString();
    const futureDate = new Date(Date.now() + 86400000).toISOString();

    const mockTasks: Task[] = [
      { id: '1', title: 'Overdue Todo', status: 'TODO', priority: 'HIGH', dueDate: pastDate },
      { id: '2', title: 'Completed Past Due', status: 'COMPLETED', priority: 'LOW', dueDate: pastDate },
      { id: '3', title: 'Future Due', status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: futureDate },
    ];

    const metrics = computeTaskMetrics(mockTasks);
    expect(metrics.overdueTasks).toBe(1);
  });
});