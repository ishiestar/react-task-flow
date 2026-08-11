import type {
  Task,
  TaskPriority,
  TaskStatus,
} from '@/features/tasks';

export type StatusFilter = 'ALL' | TaskStatus;
export type PriorityFilter = 'ALL' | TaskPriority;

export interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete?: (taskId: string) => void;
  onAddTaskClick?: () => void;
}