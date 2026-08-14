import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/helpers';
import { MetricCard } from './MetricCard';
import { AlertOctagon, CheckCircle2, Clock, ListTodo } from 'lucide-react';

describe('<MetricCard />', () => {
  describe('Rendering', () => {
    it('renders title and value', () => {
      renderWithProviders(
        <MetricCard
          title="Total Tasks"
          value={42}
          icon={ListTodo}
        />
      );

      expect(screen.getByText('Total Tasks')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders with string value', () => {
      renderWithProviders(
        <MetricCard
          title="Completion Rate"
          value="75%"
          icon={CheckCircle2}
        />
      );

      expect(screen.getByText('Completion Rate')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('renders with numeric value', () => {
      renderWithProviders(
        <MetricCard
          title="In Progress"
          value={8}
          icon={Clock}
        />
      );

      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });
  });

  describe('Subtitle', () => {
    it('renders subtitle when provided', () => {
      renderWithProviders(
        <MetricCard
          title="Completion Rate"
          value="75%"
          subtitle="24 of 32 completed"
          icon={CheckCircle2}
        />
      );

      expect(screen.getByText('24 of 32 completed')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      renderWithProviders(
        <MetricCard
          title="Total Tasks"
          value={42}
          icon={ListTodo}
        />
      );

      expect(screen.queryByText(/of/)).not.toBeInTheDocument();
    });

    it('renders multiple subtitle lines without issue', () => {
      renderWithProviders(
        <MetricCard
          title="Test"
          value={100}
          subtitle="Line 1 of multiple"
          icon={AlertOctagon}
        />
      );

      expect(screen.getByText('Line 1 of multiple')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies default variant styling', () => {
      const { container } = renderWithProviders(
        <MetricCard
          title="Total Tasks"
          value={42}
          icon={ListTodo}
          variant="default"
        />
      );

      const iconContainer = container.querySelector('[class*="text-indigo-600"]');
      expect(iconContainer).toBeInTheDocument();
    });

    it('applies success variant styling', () => {
      const { container } = renderWithProviders(
        <MetricCard
          title="Completed"
          value={24}
          icon={CheckCircle2}
          variant="success"
        />
      );

      const iconContainer = container.querySelector('[class*="text-emerald-600"]');
      expect(iconContainer).toBeInTheDocument();
    });

    it('applies warning variant styling', () => {
      const { container } = renderWithProviders(
        <MetricCard
          title="In Progress"
          value={8}
          icon={Clock}
          variant="warning"
        />
      );

      const iconContainer = container.querySelector('[class*="text-amber-600"]');
      expect(iconContainer).toBeInTheDocument();
    });

    it('applies danger variant styling', () => {
      const { container } = renderWithProviders(
        <MetricCard
          title="Overdue"
          value={2}
          icon={AlertOctagon}
          variant="danger"
        />
      );

      const iconContainer = container.querySelector('[class*="text-rose-600"]');
      expect(iconContainer).toBeInTheDocument();
    });

    it('defaults to default variant when not specified', () => {
      const { container } = renderWithProviders(
        <MetricCard
          title="Total Tasks"
          value={42}
          icon={ListTodo}
        />
      );

      const iconContainer = container.querySelector('[class*="text-indigo-600"]');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Icon', () => {
    it('renders ListTodo icon', () => {
      const { container } = renderWithProviders(
        <MetricCard
          title="Total Tasks"
          value={42}
          icon={ListTodo}
        />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders CheckCircle2 icon', () => {
      const { container } = renderWithProviders(
        <MetricCard
          title="Completed"
          value={24}
          icon={CheckCircle2}
        />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders Clock icon', () => {
      const { container } = renderWithProviders(
        <MetricCard
          title="In Progress"
          value={8}
          icon={Clock}
        />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders AlertOctagon icon', () => {
      const { container } = renderWithProviders(
        <MetricCard
          title="Overdue"
          value={2}
          icon={AlertOctagon}
        />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('displays title in uppercase', () => {
      renderWithProviders(
        <MetricCard
          title="Total Tasks"
          value={42}
          icon={ListTodo}
        />
      );

      const titleElement = screen.getByText('Total Tasks');
      expect(titleElement).toHaveClass('uppercase');
    });

    it('displays value in bold large font', () => {
      renderWithProviders(
        <MetricCard
          title="Total Tasks"
          value={42}
          icon={ListTodo}
        />
      );

      const valueElement = screen.getByText('42');
      expect(valueElement).toHaveClass('text-2xl', 'font-bold');
    });

    it('displays icon with correct sizing', () => {
      const { container } = renderWithProviders(
        <MetricCard
          title="Total Tasks"
          value={42}
          icon={ListTodo}
        />
      );

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('w-6', 'h-6');
    });
  });

  describe('Edge Cases', () => {
    it('handles very large numbers', () => {
      renderWithProviders(
        <MetricCard
          title="Total Tasks"
          value={9999999}
          icon={ListTodo}
        />
      );

      expect(screen.getByText('9999999')).toBeInTheDocument();
    });

    it('handles zero value', () => {
      renderWithProviders(
        <MetricCard
          title="Overdue"
          value={0}
          icon={AlertOctagon}
        />
      );

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles empty string value', () => {
      renderWithProviders(
        <MetricCard
          title="Status"
          value=""
          icon={ListTodo}
        />
      );

      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('handles long title text', () => {
      const longTitle = 'This is a very long metric card title that might wrap';
      renderWithProviders(
        <MetricCard
          title={longTitle}
          value={42}
          icon={ListTodo}
        />
      );

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles long subtitle text', () => {
      const longSubtitle = 'This is a very long subtitle that contains detailed information about the metric';
      renderWithProviders(
        <MetricCard
          title="Completion"
          value="75%"
          subtitle={longSubtitle}
          icon={CheckCircle2}
        />
      );

      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });
  });
});
