export type { BarPoint, ChartPeriod, DonutSlice } from '@/components/charts/types';

export type LegendDisplay =
  | { kind: 'percent'; value: number }
  | { kind: 'count'; value: number };
