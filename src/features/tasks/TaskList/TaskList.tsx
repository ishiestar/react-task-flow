import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, FilterX, Loader2 } from 'lucide-react';
import { TaskCard } from '@/components/molecules/TaskCard';
import type { PriorityFilter, StatusFilter, TaskListProps } from './TaskList.types';
import { useTranslation } from 'react-i18next';

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading = false,
  onStatusChange,
  onDelete,
  onAddTaskClick,
}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract filter parameters directly from URL query string
  const searchQuery = searchParams.get('q') ?? '';
  const statusFilter = (searchParams.get('status') as StatusFilter) ?? 'ALL';
  const priorityFilter =
    (searchParams.get('priority') as PriorityFilter) ?? 'ALL';

  // Helper to update individual URL query params cleanly
  const updateFilter = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        if (value && value !== 'ALL') {
          prev.set(key, value);
        } else {
          prev.delete(key);
        }
        return prev;
      },
      { replace: true }
    );
  };

  const handleClearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  // Derive filtered tasks list without state duplication
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchQuery === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p className="text-sm">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Control Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('tasks.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => updateFilter('q', e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters & Action */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            aria-label={t('tasks.status.filterByStatus')}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">{t('tasks.status.all')}</option>
            <option value="TODO">{t('tasks.status.todo')}</option>
            <option value="IN_PROGRESS">{t('tasks.status.inProgress')}</option>
            <option value="COMPLETED">{t('tasks.status.completed')}</option>
          </select>

          <select
            value={priorityFilter}
            aria-label="Filter by Priority"
            onChange={(e) => updateFilter('priority', e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {(searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL') && (
            <button
              onClick={handleClearFilters}
              title="Clear filters"
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <FilterX className="w-4 h-4" />
            </button>
          )}

          {onAddTaskClick && (
            <button
              onClick={onAddTaskClick}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Task List / Grid Display */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <p className="text-slate-600 dark:text-slate-400 font-medium">No tasks found</p>
          <p className="text-slate-400 text-sm mt-1">
            Try adjusting your search or active filters.
          </p>
        </div>
      )}
    </div>
  );
};