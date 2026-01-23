export function formatDate(
  date: Date | string,
  locale = 'fr-FR',
  options?: Intl.DateTimeFormatOptions,
): string {
  const value = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(value.getTime())) {
    throw new Error('Invalid date');
  }

  options = {
    weekday: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat(locale, options || { hourCycle: 'h23', timeStyle: 'long' }).format(
    value,
  );
}

export const dailyRange = (date: Date): [Date, Date] => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return [start, end];
};
