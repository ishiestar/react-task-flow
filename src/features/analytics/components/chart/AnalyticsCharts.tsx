import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AnalyticsMetrics } from '../../analytics.types';

interface AnalyticsChartsProps {
  metrics: AnalyticsMetrics;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ metrics }) => {
  const { t } = useTranslation();
  const total = metrics.totalTasks || 1;

  const priorities = [
    { label: t('tasks.priority.high', 'High'), count: metrics.priorityDistribution.HIGH, color: 'bg-rose-500' },
    { label: t('tasks.priority.medium', 'Medium'), count: metrics.priorityDistribution.MEDIUM, color: 'bg-amber-500' },
    { label: t('tasks.priority.low', 'Low'), count: metrics.priorityDistribution.LOW, color: 'bg-emerald-500' },
  ];

  const statuses = [
    { label: t('tasks.status.completed', 'Completed'), count: metrics.completedTasks, color: 'bg-emerald-600 dark:bg-emerald-500' },
    { label: t('tasks.status.inProgress', 'In Progress'), count: metrics.inProgressTasks, color: 'bg-indigo-600 dark:bg-indigo-500' },
    { label: t('tasks.status.todo', 'To Do'), count: metrics.todoTasks, color: 'bg-slate-400 dark:bg-slate-600' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Priority Distribution Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          {t('analytics.priorityBreakdown', 'Tasks by Priority')}
        </h3>
        <div className="space-y-3">
          {priorities.map((item) => {
            const percentage = Math.round((item.count / total) * 100);
            return (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>{item.label}</span>
                  <span>{item.count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Progress Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          {t('analytics.statusBreakdown', 'Task Status Breakdown')}
        </h3>
        <div className="space-y-3">
          {statuses.map((item) => {
            const percentage = Math.round((item.count / total) * 100);
            return (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>{item.label}</span>
                  <span>{item.count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};