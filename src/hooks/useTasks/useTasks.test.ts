import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { useTasks } from './useTasks';
import type { Task } from '@/features/tasks';

const mockTasks: Task[] = [
  { id: '1', title: 'Task 1', status: 'TODO', priority: 'HIGH' },
  { id: '2', title: 'Task 2', status: 'IN_PROGRESS', priority: 'LOW' },
];

const server = setupServer(
  http.get('/api/tasks', () => HttpResponse.json(mockTasks)),
  http.post('/api/tasks', async ({ request }) => {
    const body = (await request.json()) as Omit<Task, 'id'>;
    return HttpResponse.json({ id: '3', ...body }, { status: 201 });
  }),
  http.patch('/api/tasks/:id', () => HttpResponse.json({ success: true })),
  http.delete('/api/tasks/:id', () => HttpResponse.json({ success: true }))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useTasks()', () => {
  it('fetches initial tasks on mount', async () => {
    const { result } = renderHook(() => useTasks());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks[0].title).toBe('Task 1');
  });

  it('adds a new task successfully', async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addTask({
        title: 'New Task',
        status: 'TODO',
        priority: 'MEDIUM',
      });
    });

    expect(result.current.tasks).toHaveLength(3);
    expect(result.current.tasks[0].title).toBe('New Task');
  });

  it('updates task status optimistically', async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateTaskStatus('1', 'COMPLETED');
    });

    expect(result.current.tasks.find((t) => t.id === '1')?.status).toBe('COMPLETED');
  });

  it('deletes a task optimistically', async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.deleteTask('1');
    });

    expect(result.current.tasks.find((t) => t.id === '1')).toBeUndefined();
    expect(result.current.tasks).toHaveLength(1);
  });
});