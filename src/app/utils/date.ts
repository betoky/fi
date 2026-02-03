export function formatDate(
  date: Date | string,
  locale = 'fr-FR',
  options?: Intl.DateTimeFormatOptions,
): string {
  const value = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(value.getTime())) {
    throw new Error('Invalid date');
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(value);
}

export const dailyRange = (date: Date): [Date, Date] => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return [start, end];
};

export const isDate = (entry: unknown): entry is Date =>
  entry instanceof Date && !Number.isNaN(entry.getTime());

export const isTheSameWithoutTime = (a: Date, b: Date) => {
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);

  return a.getTime() === b.getTime();
};

export const getMinDate = (a: Date, b: Date) => (a.getTime() <= b.getTime() ? a : b);

export const getMaxDate = (a: Date, b: Date) => (a.getTime() >= b.getTime() ? a : b);

export const getWeekRange = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();

  const diffToMonday = day === 0 ? -6 : 1 - day;

  const startOfWeek = new Date(d);
  startOfWeek.setDate(d.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return [startOfWeek, endOfWeek];
};
