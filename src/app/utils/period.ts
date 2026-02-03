import { Period } from '@/domains/period';

export const PeriodMap = new Map<Period, { label: string; value: Period }>([
  ['day', { label: 'Jour', value: 'day' }],
  ['week', { label: 'Semaine', value: 'week' }],
  ['month', { label: 'Mois', value: 'month' }],
  ['year', { label: 'Année', value: 'year' }],
]);

export const getPeriodObject = (value: Period) => PeriodMap.get(value);
