import type { ChartPeriod } from '@notifications/types/charts';

export type * from '@notifications/types/charts';

export const CHART_PERIODS: ChartPeriod[] = [
  'day',
  'week',
  'month',
  'season',
  'year',
];
