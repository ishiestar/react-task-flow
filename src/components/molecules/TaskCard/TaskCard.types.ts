import type { Task, TaskStatus } from '@/features/tasks';

export interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete?: (taskId: string) => void;
}