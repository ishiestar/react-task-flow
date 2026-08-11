import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { TaskForm, type TaskFormValues } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';

export const TaskPage: React.FC = () => {
  const { t } = useTranslation();
  const { tasks, isLoading, error, fetchTasks, addTask, updateTaskStatus, deleteTask } = useTasks();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCreateTask = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    const result = await addTask(values);
    setIsSubmitting(false);

    if (result) {
      setIsFormOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t('tasks.page.title')}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {t('tasks.page.subtitle')}
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('tasks.newTask')}</span>
          </button>
        </header>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={fetchTasks}
              className="inline-flex items-center gap-1.5 text-xs font-semibold underline hover:no-underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('tasks.page.retry')}</span>
            </button>
          </div>
        )}

        {/* Task List */}
        <main>
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onStatusChange={updateTaskStatus}
            onDelete={deleteTask}
          />
        </main>

        {/* Create Task Modal */}
        <TaskForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateTask}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};