interface DateFormatOptions {
  format?: 'short' | 'medium' | 'long';
  includeTime?: boolean;
  timeZone?: string;
}

export function formatDate(date: Date | string, options: DateFormatOptions = {}): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const { format = 'medium', includeTime = false, timeZone } = options;

  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone,
  };

  switch (format) {
    case 'short':
      formatOptions.year = 'numeric';
      formatOptions.month = 'numeric';
      formatOptions.day = 'numeric';
      break;
    case 'long':
      formatOptions.year = 'numeric';
      formatOptions.month = 'long';
      formatOptions.day = 'numeric';
      break;
    default:
      formatOptions.year = 'numeric';
      formatOptions.month = 'short';
      formatOptions.day = 'numeric';
  }

  if (includeTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
    formatOptions.second = '2-digit';
  }

  return new Intl.DateTimeFormat('en-US', formatOptions).format(dateObj);
}

export function isValidDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

export function getDateDifference(
  date1: Date | string,
  date2: Date | string
): { days: number; hours: number; minutes: number } {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
}
