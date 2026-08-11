import type { User } from "@/features/auth";

export interface Task {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const initialTasks: Task[] = [
  { id: '1', title: 'Setup Vite + React Architecture', status: 'COMPLETED', priority: 'HIGH' },
  { id: '2', title: 'Configure MSW Network Handlers', status: 'IN_PROGRESS', priority: 'MEDIUM' },
  { id: '3', title: 'Build Task Card Component', status: 'TODO', priority: 'HIGH' },
];

// In-memory state for runtime POC mutations
export const mockTasks = [...initialTasks];

export const MOCK_USERS: Record<string, User> = {
  'admin@taskflow.dev': {
    id: 'user-admin',
    email: 'admin@taskflow.dev',
    name: 'Admin User',
    role: 'ADMIN',
  },
  'user@taskflow.dev': {
    id: 'user-standard',
    email: 'user@taskflow.dev',
    name: 'Standard User',
    role: 'USER',
  },
};