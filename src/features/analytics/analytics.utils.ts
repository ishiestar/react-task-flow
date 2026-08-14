import type { Task } from "../tasks";
import type { AnalyticsMetrics } from "./analytics.types";

export const computeTaskMetrics = (tasks: Task[]): AnalyticsMetrics => {
  const now = new Date();

  const initialMetrics: AnalyticsMetrics = {
    totalTasks: tasks.length,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    completionRate: 0,
    overdueTasks: 0,
    priorityDistribution: {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
    },
    statusDistribution: {
      TODO: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    },
  };

  if (tasks.length === 0) return initialMetrics;

  const result = tasks.reduce((acc, task) => {
    // Status metrics
    acc.statusDistribution[task.status] = (acc.statusDistribution[task.status] || 0) + 1;
    if (task.status === 'COMPLETED') acc.completedTasks += 1;
    if (task.status === 'IN_PROGRESS') acc.inProgressTasks += 1;
    if (task.status === 'TODO') acc.todoTasks += 1;

    // Priority metrics
    acc.priorityDistribution[task.priority] = (acc.priorityDistribution[task.priority] || 0) + 1;

    // Overdue check
    if (task.dueDate && task.status !== 'COMPLETED') {
      const due = new Date(task.dueDate);
      if (due < now) {
        acc.overdueTasks += 1;
      }
    }

    return acc;
  }, initialMetrics);

  result.completionRate = Math.round((result.completedTasks / result.totalTasks) * 100);
  return result;
}