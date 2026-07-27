import { http, HttpResponse, delay } from 'msw';
import { mockTasks } from './mockData';

export const handlers = [
  // GET /api/tasks
  http.get('/api/tasks', async () => {
    await delay(200);
    return HttpResponse.json(mockTasks);
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