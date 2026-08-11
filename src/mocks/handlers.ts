import { http, HttpResponse, delay } from 'msw';
import { mockTasks } from './mockData';
import type { Task, TaskStatus } from '@/features/tasks';

export const handlers = [
  // GET /api/tasks
  http.get('/api/tasks', async () => {
    await delay(200);
    return HttpResponse.json(mockTasks);
  }),

  // POST /api/tasks
  http.post('/api/tasks', async ({ request }) => {
    const body = (await request.json()) as Omit<Task, 'id'>;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...body,
    };
    mockTasks.unshift(newTask);
    return HttpResponse.json(newTask, { status: 201 });
  }),

  // PATCH /api/tasks/:id
  http.patch('/api/tasks/:id', async ({ params, request }) => {
    const { id } = params;
    const { status } = (await request.json()) as { status: TaskStatus };
    const taskIndex = mockTasks.findIndex((t) => t.id === id);

    if (taskIndex !== -1) {
      mockTasks[taskIndex].status = status;
      return HttpResponse.json(mockTasks[taskIndex]);
    }

    return new HttpResponse(null, { status: 404 });
  }),

  // DELETE /api/tasks/:id
  http.delete('/api/tasks/:id', ({ params }) => {
    const { id } = params;
    const taskIndex = mockTasks.findIndex((t) => t.id === id);

    if (taskIndex !== -1) {
      mockTasks.splice(taskIndex, 1);
      return HttpResponse.json({ success: true });
    }

    return new HttpResponse(null, { status: 404 });
  }),
  // GET /api/analytics
  http.get('/api/analytics', async () => {
    await delay(150);
    const totalTasks = mockTasks.length;
    const completedTasks = mockTasks.filter((t) => t.status === 'COMPLETED').length;

    return HttpResponse.json({
      totalTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      statusBreakdown: [
        { name: 'To Do', count: mockTasks.filter((t) => t.status === 'TODO').length },
        { name: 'In Progress', count: mockTasks.filter((t) => t.status === 'IN_PROGRESS').length },
        { name: 'Completed', count: completedTasks },
      ],
    });
  }),
];