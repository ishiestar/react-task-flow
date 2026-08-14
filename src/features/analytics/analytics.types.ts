import type { TaskPriority, TaskStatus } from "../tasks";

export interface AnalyticsMetrics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionRate: number; // percentage (0 - 100)
  overdueTasks: number;
  priorityDistribution: Record<TaskPriority, number>;
  statusDistribution: Record<TaskStatus, number>;
}
