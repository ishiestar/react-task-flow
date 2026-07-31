import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskStatus, TaskFormValues } from '@/features/tasks';
import type { UseTasksReturn } from './useTasks.types';

const API_ENDPOINT = '/api/tasks';

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // GET /api/tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // POST /api/tasks
  const addTask = async (values: TaskFormValues): Promise<Task | undefined> => {
    setError(null);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.statusText}`);
      }

      const newTask: Task = await response.json();
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add task';
      setError(message);
      return undefined;
    }
  };

  // PATCH /api/tasks/:id
  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus): Promise<void> => {
    setError(null);
    // Optimistic UI Update
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );

    try {
      const response = await fetch(`${API_ENDPOINT}/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      // Rollback on error
      await fetchTasks();
    }
  };

  // DELETE /api/tasks/:id
  const deleteTask = async (taskId: string): Promise<void> => {
    setError(null);
    // Optimistic UI Update
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    try {
      const response = await fetch(`${API_ENDPOINT}/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      // Rollback on error
      await fetchTasks();
    }
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    updateTaskStatus,
    deleteTask,
  };
};