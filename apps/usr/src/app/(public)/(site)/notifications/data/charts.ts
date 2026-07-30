export type ChartPeriod = 'day' | 'week' | 'month' | 'season' | 'year';

export type BarPoint = {
  label: string;
  value: number;
};

export type DonutSlice = {
  key: 'primary' | 'other';
  value: number;
};

export type LegendDisplay =
  | { kind: 'percent'; value: number }
  | { kind: 'count'; value: number };

export const CHART_PERIODS: ChartPeriod[] = [
  'day',
  'week',
  'month',
  'season',
  'year',
];
