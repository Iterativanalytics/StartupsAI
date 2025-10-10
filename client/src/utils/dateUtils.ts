/**
 * Centralized date formatting utilities
 * Eliminates duplication of date formatting logic across components
 */

export interface DateFormatOptions {
  includeTime?: boolean;
  format?: 'short' | 'medium' | 'long' | 'relative';
  fallback?: string;
}

/**
 * Formats a date string with consistent options across the application
 */
export function formatDate(
  dateString: string | null | undefined,
  options: DateFormatOptions = {}
): string {
  const {
    includeTime = false,
    format = 'medium',
    fallback = 'N/A'
  } = options;

  if (!dateString) return fallback;

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return fallback;
    }

    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: '2-digit',
          ...(includeTime && {
            hour: 'numeric',
            minute: '2-digit'
          })
        });

      case 'medium':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          ...(includeTime && {
            hour: 'numeric',
            minute: '2-digit'
          })
        });

      case 'long':
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          ...(includeTime && {
            hour: 'numeric',
            minute: '2-digit'
          })
        });

      case 'relative':
        return formatRelativeDate(date);

      default:
        return date.toLocaleDateString('en-US');
    }
  } catch (error) {
    console.warn('Failed to format date:', dateString, error);
    return fallback;
  }
}

/**
 * Formats a date as a relative time string (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (Math.abs(diffInSeconds) < 60) {
    return 'just now';
  } else if (Math.abs(diffInMinutes) < 60) {
    return diffInMinutes > 0 ? `${diffInMinutes}m ago` : `in ${Math.abs(diffInMinutes)}m`;
  } else if (Math.abs(diffInHours) < 24) {
    return diffInHours > 0 ? `${diffInHours}h ago` : `in ${Math.abs(diffInHours)}h`;
  } else if (Math.abs(diffInDays) < 7) {
    return diffInDays > 0 ? `${diffInDays}d ago` : `in ${Math.abs(diffInDays)}d`;
  } else if (Math.abs(diffInWeeks) < 4) {
    return diffInWeeks > 0 ? `${diffInWeeks}w ago` : `in ${Math.abs(diffInWeeks)}w`;
  } else if (Math.abs(diffInMonths) < 12) {
    return diffInMonths > 0 ? `${diffInMonths}mo ago` : `in ${Math.abs(diffInMonths)}mo`;
  } else {
    return diffInYears > 0 ? `${diffInYears}y ago` : `in ${Math.abs(diffInYears)}y`;
  }
}

/**
 * Formats a date range as a string
 */
export function formatDateRange(
  startDate: string | null,
  endDate: string | null,
  options: DateFormatOptions = {}
): string {
  const { fallback = 'No dates set' } = options;

  if (!startDate && !endDate) return fallback;
  if (!startDate) return `Until ${formatDate(endDate, options)}`;
  if (!endDate) return `From ${formatDate(startDate, options)}`;

  const formattedStart = formatDate(startDate, options);
  const formattedEnd = formatDate(endDate, options);

  return `${formattedStart} - ${formattedEnd}`;
}

/**
 * Checks if a date is overdue (past current date)
 */
export function isOverdue(dateString: string | null): boolean {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  } catch {
    return false;
  }
}

/**
 * Calculates progress percentage between two dates
 */
export function calculateDateProgress(
  startDate: string | null,
  endDate: string | null,
  currentDate: Date = new Date()
): number {
  if (!startDate || !endDate) return 0;

  try {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const current = currentDate.getTime();

    if (current <= start) return 0;
    if (current >= end) return 100;

    const totalDuration = end - start;
    const elapsed = current - start;
    
    return Math.round((elapsed / totalDuration) * 100);
  } catch {
    return 0;
  }
}
