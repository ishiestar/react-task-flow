import { useTasks } from '@/hooks/useTasks';
import { AlertOctagon, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { computeTaskMetrics } from '../../analytics.utils';
import { AnalyticsCharts } from '../../components/chart/AnalyticsCharts';
import { MetricCard } from '../../components/card/MetricCard';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { tasks, isLoading } = useTasks();

  const metrics = useMemo(() => computeTaskMetrics(tasks), [tasks]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('analytics.title', 'Analytics Dashboard')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {t('analytics.subtitle', 'Real-time overview of workload distribution, completion rates, and bottlenecks.')}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t('analytics.metrics.totalTasks', 'Total Tasks')}
          value={metrics.totalTasks}
          icon={ListTodo}
          variant="default"
        />
        <MetricCard
          title={t('analytics.metrics.completionRate', 'Completion Rate')}
          value={`${metrics.completionRate}%`}
          subtitle={`${metrics.completedTasks} of ${metrics.totalTasks} completed`}
          icon={CheckCircle2}
          variant="success"
        />
        <MetricCard
          title={t('analytics.metrics.inProgress', 'In Progress')}
          value={metrics.inProgressTasks}
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          title={t('analytics.metrics.overdue', 'Overdue')}
          value={metrics.overdueTasks}
          icon={AlertOctagon}
          variant={metrics.overdueTasks > 0 ? 'danger' : 'default'}
        />
      </div>

      {/* Detailed Charts */}
      <AnalyticsCharts metrics={metrics} />
    </div>
  );
};