import type { TaskPriority, TaskStatus } from '@/features/tasks';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const priorityConfig: Record<TaskPriority, { labelKey: string; color: string }> = {
  HIGH: { labelKey: 'tasks.priority.high', color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' },
  MEDIUM: { labelKey: 'tasks.priority.medium', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  LOW: { labelKey: 'tasks.priority.low', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' },
};

export const statusIcons: Record<TaskStatus, React.ReactNode> = {
  TODO: <Clock className="w-4 h-4 text-slate-500" />,
  IN_PROGRESS: <AlertCircle className="w-4 h-4 text-amber-500" />,
  COMPLETED: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
};
