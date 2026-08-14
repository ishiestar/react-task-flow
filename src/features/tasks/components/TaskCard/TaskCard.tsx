import React from 'react';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Trash2, Calendar, } from 'lucide-react';
import type { TaskCardProps } from './TaskCard.types';
import type { TaskStatus } from '@/features/tasks';
import { useAuth } from '@/features/auth';
import { canDeleteTask } from '@/features/auth/utils/permissions';
import { priorityConfig, statusIcons } from './utils';

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onDelete }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isDeletable = onDelete && canDeleteTask(user, task);

  const { id, title, description, status, priority, dueDate } = task;

  const handleStatusSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(id, e.target.value as TaskStatus);
  };

  return (
    <div
      data-testid={`task-card-${id}`}
      className={clsx(
        'p-4 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md',
        status === 'COMPLETED' && 'opacity-75 bg-slate-50 dark:bg-slate-900/50'
      )}
    >
      {/* Header: Priority Badge & Delete Action */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={clsx(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            priorityConfig[priority].color
          )}
        >
          {t(priorityConfig[priority].labelKey)}
        </span>

        {isDeletable && (
          <button
            type="button"
            onClick={() => onDelete(id)}
            aria-label={t('tasks.actions.delete', { title })}
            className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <h3
        className={clsx(
          'text-base font-semibold text-slate-900 dark:text-slate-100 mb-1',
          status === 'COMPLETED' && 'line-through text-slate-500 dark:text-slate-500'
        )}
      >
        {title}
      </h3>

      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {description}
        </p>
      )}

      {/* Footer: Due Date & Status Control */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        {dueDate ? (
          <div className="flex items-center gap-1 text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(parseISO(dueDate), 'MMM d, yyyy')}</span>
          </div>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1.5">
          {statusIcons[status]}
          <select
            aria-label={t('tasks.actions.changeStatus', { title })}
            value={status}
            onChange={handleStatusSelect}
            className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1 py-0.5"
          >
            <option value="TODO">{t('tasks.status.todo')}</option>
            <option value="IN_PROGRESS">{t('tasks.status.inProgress')}</option>
            <option value="COMPLETED">{t('tasks.status.completed')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};