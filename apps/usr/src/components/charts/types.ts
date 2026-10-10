export type ChartPeriod = 'day' | 'week' | 'month' | 'season' | 'year';

/** Toggle order (start → end): «روز / هفته / ماه / فصل / سال». */
export const CHART_PERIODS: ChartPeriod[] = ['day', 'week', 'month', 'season', 'year'];

/**
 * Colour roles a series may use (palette tokens, never raw colours). `primary` / `secondary` = operational
 * panel (green / orange); `seriesA` / `seriesB` = notifications charts.
 */
export type ChartTone = 'primary' | 'secondary' | 'seriesA' | 'seriesB';

/** For Recharts SVG fills. */
export const CHART_TONE_COLOR: Record<ChartTone, string> = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  seriesA: 'var(--color-chart-series-a)',
  seriesB: 'var(--color-chart-series-b)',
};

/** Legend dots. */
export const CHART_TONE_BG: Record<ChartTone, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  seriesA: 'bg-chart-series-a',
  seriesB: 'bg-chart-series-b',
};

/** Centre values and labels. */
export const CHART_TONE_TEXT: Record<ChartTone, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  seriesA: 'text-chart-series-a',
  seriesB: 'text-chart-series-b',
};

export type BarPoint = {
  label: string;
  value: number;
};

export type DonutSlice = {
  key: 'primary' | 'other';
  value: number;
};
