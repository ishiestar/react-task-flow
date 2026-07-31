import type { Task, TaskStatus, TaskFormValues } from '@/features/tasks';

export interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (values: TaskFormValues) => Promise<Task | undefined>;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}