import { format, parseISO } from 'date-fns';

// Safe date formatting helper for HTML date inputs
export const formatDueDateForInput = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'yyyy-MM-dd');
  } catch {
    return '';
  }
};
