import type { User } from '../auth.types';
import type { Task } from '@/features/tasks';

/**
 * Rules:
 * - ADMIN can delete ANY task.
 * - USER can delete ONLY tasks they created (task.createdBy === user.id).
 */
export const canDeleteTask = (user: User | null, task: Task): boolean => {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  if (user.role === 'USER' && task.createdBy && task.createdBy === user.id) return true;
  return false;
};

/**
 * Rules:
 * - Both ADMIN and USER can update status.
 */
export const canUpdateTaskStatus = (user: User | null): boolean => {
  return !!user;
};