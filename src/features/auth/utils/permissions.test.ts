import { describe, it, expect } from 'vitest';
import { canDeleteTask } from './permissions';
import type { User } from '../auth.types';
import type { Task } from '../../tasks';

const adminUser: User = { id: 'usr-admin', email: 'admin@a.com', name: 'Admin', role: 'ADMIN' };
const standardUser: User = { id: 'usr-1', email: 'user@a.com', name: 'User 1', role: 'USER' };
const otherUser: User = { id: 'usr-2', email: 'other@a.com', name: 'User 2', role: 'USER' };

const taskCreatedByStandardUser: Task = {
  id: 't-1',
  title: 'Task 1',
  status: 'TODO',
  priority: 'HIGH',
  createdBy: 'usr-1',
};

describe('permissions -> canDeleteTask', () => {
  it('returns false if user is null', () => {
    expect(canDeleteTask(null, taskCreatedByStandardUser)).toBe(false);
  });

  it('allows ADMIN to delete any task regardless of ownership', () => {
    expect(canDeleteTask(adminUser, taskCreatedByStandardUser)).toBe(true);
  });

  it('allows USER to delete tasks they created', () => {
    expect(canDeleteTask(standardUser, taskCreatedByStandardUser)).toBe(true);
  });

  it('denies USER from deleting tasks created by someone else', () => {
    expect(canDeleteTask(otherUser, taskCreatedByStandardUser)).toBe(false);
  });
});