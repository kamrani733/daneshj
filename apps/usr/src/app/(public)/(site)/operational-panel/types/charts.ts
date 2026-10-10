/** Operational panel «نمودار» — provisional shapes (mocked; no backend contract yet). */
import type { BarDatum, ChartPeriod } from '@/components/charts';

export type BarChartData = {
  kind: 'bar';
  points: BarDatum[];
};

export type DonutChartData = {
  kind: 'donut';
  /** Highlighted share, 0–100. */
  percent: number;
  /** Absolute size the percent is taken of (footer «مجموع»). */
  total: number;
};

export type OperationalChartData = BarChartData | DonutChartData;

export type ChartRequest = {
  chartId: string;
  period: ChartPeriod;
};

/** Comparison filter fields (Figma «تنظیم فیلترها — گروه A»), column by column. */
export const COMPARISON_FIELDS = [
  'gender',
  'userType',
  'liveCountry',
  'liveProvince',
  'liveCity',
  'eduCountry',
  'eduProvince',
  'eduCity',
  'university',
  'studyStatus',
  'degree',
  'academicGroup',
  'major',
] as const;

export type ComparisonField = (typeof COMPARISON_FIELDS)[number];

/** Field → selected option value. */
export type ComparisonFilters = Partial<Record<ComparisonField, string>>;

export type ComparisonGroupId = 'a' | 'b';

export type ComparisonRequest = {
  statId: string;
  period: ChartPeriod;
  groups: Partial<Record<ComparisonGroupId, ComparisonFilters>>;
};

export type ComparisonResult = {
  labels: string[];
  series: Partial<Record<ComparisonGroupId, number[]>>;
};

export type FilterOption = { value: string; label: string };

/** Server-provided option lists (the rest come from the shared profile option lists). */
export type ComparisonOptions = {
  universities: FilterOption[];
  majors: FilterOption[];
};
