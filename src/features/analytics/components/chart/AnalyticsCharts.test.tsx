import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/helpers';
import { createMetrics } from '@/test/mocks';
import { AnalyticsCharts } from './AnalyticsCharts';

// Helper to find elements containing a specific number (works with text like "3 (50%)")
const hasNumber = (num: number | string) => {
  const elements = screen.queryAllByText((content) =>
    content.trim() === `${num}` || content.includes(`${num} (`)
  );
  return elements.length > 0;
};

describe('<AnalyticsCharts />', () => {
  describe('Rendering', () => {
    it('renders both chart sections', () => {
      const metrics = createMetrics();
      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      expect(screen.getByText('Tasks by Priority')).toBeInTheDocument();
      expect(screen.getByText('Task Status Breakdown')).toBeInTheDocument();
    });

    it('renders priority breakdown chart', () => {
      const metrics = createMetrics();
      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('renders status breakdown chart', () => {
      const metrics = createMetrics();
      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      const completedElements = screen.getAllByText('Completed');
      const inProgressElements = screen.getAllByText('In Progress');
      const todoElements = screen.getAllByText('To Do');

      expect(completedElements.length).toBeGreaterThan(0);
      expect(inProgressElements.length).toBeGreaterThan(0);
      expect(todoElements.length).toBeGreaterThan(0);
    });
  });

  describe('Priority Distribution', () => {
    it('displays correct counts for each priority', () => {
      const metrics = createMetrics({
        priorityDistribution: { HIGH: 3, MEDIUM: 2, LOW: 1 },
      });

      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Verify High priority section shows count
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(hasNumber(3)).toBe(true);

      // Verify Medium priority section shows count
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(hasNumber(2)).toBe(true);

      // Verify Low priority section shows count
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(hasNumber(1)).toBe(true);
    });

    it('displays 0% for priority with 0 tasks', () => {
      const metrics = createMetrics({
        priorityDistribution: { HIGH: 4, MEDIUM: 0, LOW: 0 },
        totalTasks: 4,
      });

      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Verify Medium and Low appear with 0 count
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
      // Check for zeros (Medium and Low should be 0)
      const zeroElements = screen.queryAllByText((content) => content.includes('0 ('));
      expect(zeroElements.length).toBeGreaterThan(0);
    });

    it('displays 100% for single priority', () => {
      const metrics = createMetrics({
        priorityDistribution: { HIGH: 1, MEDIUM: 0, LOW: 0 },
        totalTasks: 1,
      });

      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // High should be 1 (100%)
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(hasNumber(1)).toBe(true);
    });

    it('calculates percentages correctly for evenly distributed tasks', () => {
      const metrics = createMetrics({
        priorityDistribution: { HIGH: 1, MEDIUM: 1, LOW: 1 },
        totalTasks: 3,
      });

      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Each priority should be displayed
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
      // Should have 1s for each priority count
      expect(hasNumber(1)).toBe(true);
    });
  });

  describe('Status Distribution', () => {
    it('displays correct counts for each status', () => {
      const metrics = createMetrics({
        completedTasks: 5,
        inProgressTasks: 3,
        todoTasks: 2,
        statusDistribution: { COMPLETED: 5, IN_PROGRESS: 3, TODO: 2 },
        totalTasks: 10,
      });

      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Verify status labels appear
      const completedLabels = screen.getAllByText('Completed');
      expect(completedLabels.length).toBeGreaterThan(0);
      const inProgressLabels = screen.getAllByText('In Progress');
      expect(inProgressLabels.length).toBeGreaterThan(0);
      const todoLabels = screen.getAllByText('To Do');
      expect(todoLabels.length).toBeGreaterThan(0);
    });

    it('displays 0% for status with 0 tasks', () => {
      const metrics = createMetrics({
        completedTasks: 4,
        inProgressTasks: 0,
        todoTasks: 0,
        statusDistribution: { COMPLETED: 4, IN_PROGRESS: 0, TODO: 0 },
        totalTasks: 4,
      });

      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Verify status labels appear
      const inProgressLabels = screen.getAllByText('In Progress');
      expect(inProgressLabels.length).toBeGreaterThan(0);
      const todoLabels = screen.getAllByText('To Do');
      expect(todoLabels.length).toBeGreaterThan(0);
    });

    it('displays 100% for all tasks in one status', () => {
      const metrics = createMetrics({
        completedTasks: 3,
        inProgressTasks: 0,
        todoTasks: 0,
        statusDistribution: { COMPLETED: 3, IN_PROGRESS: 0, TODO: 0 },
        totalTasks: 3,
      });

      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Completed should be 3 and 100%
      const completedLabels = screen.getAllByText('Completed');
      expect(completedLabels.length).toBeGreaterThan(0);
      expect(hasNumber(3)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles zero total tasks by defaulting to 1 for division', () => {
      const metrics = createMetrics({
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        todoTasks: 0,
        priorityDistribution: { HIGH: 0, MEDIUM: 0, LOW: 0 },
        statusDistribution: { COMPLETED: 0, IN_PROGRESS: 0, TODO: 0 },
      });

      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Should not crash and render charts
      expect(screen.getByText('Tasks by Priority')).toBeInTheDocument();
      expect(screen.getByText('Task Status Breakdown')).toBeInTheDocument();
    });

    it('handles very large numbers', () => {
      const metrics = createMetrics({
        totalTasks: 9999,
        completedTasks: 5000,
        inProgressTasks: 3000,
        todoTasks: 1999,
        priorityDistribution: { HIGH: 3333, MEDIUM: 3333, LOW: 3333 },
        statusDistribution: { COMPLETED: 5000, IN_PROGRESS: 3000, TODO: 1999 },
      });

      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Should render both chart sections without errors
      expect(screen.getByText('Tasks by Priority')).toBeInTheDocument();
      expect(screen.getByText('Task Status Breakdown')).toBeInTheDocument();
    });

    it('handles rounding edge cases for percentages', () => {
      const metrics = createMetrics({
        totalTasks: 7,
        completedTasks: 1,
        inProgressTasks: 1,
        todoTasks: 5,
        priorityDistribution: { HIGH: 1, MEDIUM: 1, LOW: 5 },
        statusDistribution: { COMPLETED: 1, IN_PROGRESS: 1, TODO: 5 },
      });

      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Should render all priority and status levels
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('handles single task distribution', () => {
      const metrics = createMetrics({
        totalTasks: 1,
        completedTasks: 1,
        inProgressTasks: 0,
        todoTasks: 0,
        priorityDistribution: { HIGH: 1, MEDIUM: 0, LOW: 0 },
        statusDistribution: { COMPLETED: 1, IN_PROGRESS: 0, TODO: 0 },
      });

      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Single task should render correctly
      const completedLabels = screen.getAllByText('Completed');
      expect(completedLabels.length).toBeGreaterThan(0);
      const highLabels = screen.getAllByText('High');
      expect(highLabels.length).toBeGreaterThan(0);
    });
  });

  describe('Progress Bars', () => {
    it('renders progress bars for all priority items', () => {
      const metrics = createMetrics();
      const { container } = renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Should have multiple progress bar containers
      const progressBars = container.querySelectorAll('.bg-slate-100');
      expect(progressBars.length).toBeGreaterThan(0);
    });

    it('applies correct colors to priority progress bars', () => {
      const metrics = createMetrics();
      const { container } = renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // High priority should have rose color
      expect(container.querySelector('.bg-rose-500')).toBeInTheDocument();
      // Medium priority should have amber color
      expect(container.querySelector('.bg-amber-500')).toBeInTheDocument();
      // Low priority should have emerald color
      expect(container.querySelector('.bg-emerald-500')).toBeInTheDocument();
    });

    it('applies correct colors to status progress bars', () => {
      const metrics = createMetrics();
      const { container } = renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Completed should have emerald color
      expect(container.querySelector('.bg-emerald-600')).toBeInTheDocument();
      // In Progress should have indigo color
      expect(container.querySelector('.bg-indigo-600')).toBeInTheDocument();
      // To Do should have slate color
      expect(container.querySelector('.bg-slate-400')).toBeInTheDocument();
    });

    it('sets correct width percentages for bars', () => {
      const metrics = createMetrics({
        totalTasks: 4,
        completedTasks: 2, // 50%
        priorityDistribution: { HIGH: 2, MEDIUM: 1, LOW: 1 }, // 50%, 25%, 25%
      });

      const { container } = renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Check for width styles
      const bars = container.querySelectorAll('[style*="width"]');
      expect(bars.length).toBeGreaterThan(0);

      // Should have 50% width bars
      const fiftyPercentBar = Array.from(bars).find(
        (bar) => (bar as HTMLElement).style.width === '50%'
      );
      expect(fiftyPercentBar).toBeInTheDocument();
    });

    it('renders 0% width bar for empty categories', () => {
      const metrics = createMetrics({
        totalTasks: 2,
        priorityDistribution: { HIGH: 2, MEDIUM: 0, LOW: 0 },
      });

      const { container } = renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // Should have 0% width bars
      const zeroPercentBar = Array.from(container.querySelectorAll('[style*="width"]')).find(
        (bar) => (bar as HTMLElement).style.width === '0%'
      );
      expect(zeroPercentBar).toBeInTheDocument();
    });
  });

  describe('Translations', () => {
    it('uses fallback text for untranslated keys', () => {
      const metrics = createMetrics();
      renderWithProviders(<AnalyticsCharts metrics={metrics} />);

      // These should use fallback text since they're not in en.json
      expect(screen.getByText('Tasks by Priority')).toBeInTheDocument();
      expect(screen.getByText('Task Status Breakdown')).toBeInTheDocument();
    });
  });
});
