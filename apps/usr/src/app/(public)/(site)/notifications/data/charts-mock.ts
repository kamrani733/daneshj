export type ChartPeriod = 'day' | 'week' | 'month' | 'season' | 'year';

export type BarPoint = {
  label: string;
  value: number;
};

export type DonutSlice = {
  key: 'primary' | 'other';
  value: number;
};

export type ChartLabelKey =
  | 'systemReceived'
  | 'manualReceived'
  | 'readRatio'
  | 'linkClickRatio'
  | 'rejected'
  | 'confirmed'
  | 'other';

export type LegendDisplay =
  | { kind: 'percent'; value: number }
  | { kind: 'count'; value: number };

export type FixedBarChartConfig = {
  id: 'system' | 'manual';
  titleKey: Extract<ChartLabelKey, 'systemReceived' | 'manualReceived'>;
  barColor: string;
  showValueLabels?: boolean;
  getSeries: (period: ChartPeriod) => BarPoint[];
};

export type FixedDonutChartConfig = {
  id: 'read' | 'link';
  titleKey: Extract<ChartLabelKey, 'readRatio' | 'linkClickRatio'>;
  primaryColor: string;
  otherColor?: string;
  centerPercent: number;
  centerLabelKey: Extract<ChartLabelKey, 'rejected' | 'confirmed'>;
  getSlices: () => DonutSlice[];
  legend: Array<{
    labelKey: Extract<ChartLabelKey, 'rejected' | 'confirmed' | 'other'>;
    color: string;
    display: LegendDisplay;
  }>;
  showTotal: boolean;
};

export const CHART_PERIODS: ChartPeriod[] = [
  'day',
  'week',
  'month',
  'season',
  'year',
];

export const CHARTS_TOTAL_REQUESTS = 2557;

function daySeries(seed: number): BarPoint[] {
  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const wave = ((day + seed) % 7) / 6;
    const peak = [8, 14, 20, 25].includes(day) ? 12 + seed : 0;
    const value = Math.round(18 + seed * 2 + wave * 40 + peak + (day % 5) * 2);
    return {
      label: day === 1 || day % 5 === 0 ? String(day) : '',
      value,
    };
  });
}

function weekSeries(values: number[]): BarPoint[] {
  const labels = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  return labels.map((label, index) => ({ label, value: values[index] ?? 0 }));
}

function monthSeries(values: Array<[string, number]>): BarPoint[] {
  return values.map(([label, value]) => ({ label, value }));
}

const SYSTEM_SERIES: Record<ChartPeriod, BarPoint[]> = {
  day: daySeries(4),
  week: weekSeries([40, 55, 48, 62, 70, 52, 35]),
  month: monthSeries([
    ['1', 30],
    ['5', 48],
    ['10', 62],
    ['15', 55],
    ['20', 78],
    ['25', 66],
    ['30', 42],
  ]),
  season: monthSeries([
    ['Q1', 120],
    ['Q2', 158],
    ['Q3', 142],
    ['Q4', 175],
  ]),
  year: monthSeries([
    ['1400', 220],
    ['1401', 280],
    ['1402', 310],
    ['1403', 265],
    ['1404', 340],
  ]),
};

const MANUAL_SERIES: Record<ChartPeriod, BarPoint[]> = {
  day: daySeries(1),
  week: weekSeries([22, 38, 30, 45, 50, 36, 20]),
  month: monthSeries([
    ['1', 20],
    ['5', 36],
    ['10', 48],
    ['15', 40],
    ['20', 58],
    ['25', 52],
    ['30', 28],
  ]),
  season: monthSeries([
    ['Q1', 90],
    ['Q2', 110],
    ['Q3', 98],
    ['Q4', 125],
  ]),
  year: monthSeries([
    ['1400', 160],
    ['1401', 190],
    ['1402', 210],
    ['1403', 185],
    ['1404', 240],
  ]),
};

function donutSlices(primary: number): DonutSlice[] {
  return [
    { key: 'primary', value: primary },
    { key: 'other', value: 100 - primary },
  ];
}

export const FIXED_BAR_CHARTS: FixedBarChartConfig[] = [
  {
    id: 'system',
    titleKey: 'systemReceived',
    barColor: 'var(--color-chart-series-b)',
    getSeries: (period) => SYSTEM_SERIES[period],
  },
  {
    id: 'manual',
    titleKey: 'manualReceived',
    barColor: 'var(--color-chart-series-a)',
    showValueLabels: true,
    getSeries: (period) => MANUAL_SERIES[period],
  },
];

export const FIXED_DONUT_CHARTS: FixedDonutChartConfig[] = [
  {
    id: 'read',
    titleKey: 'readRatio',
    primaryColor: 'var(--color-chart-series-b)',
    centerPercent: 18,
    centerLabelKey: 'rejected',
    getSlices: () => donutSlices(18),
    legend: [
      {
        labelKey: 'rejected',
        color: 'var(--color-chart-series-b)',
        display: { kind: 'percent', value: 18 },
      },
      {
        labelKey: 'other',
        color: 'var(--color-chart-other)',
        display: { kind: 'percent', value: 82 },
      },
    ],
    showTotal: true,
  },
  {
    id: 'link',
    titleKey: 'linkClickRatio',
    primaryColor: 'var(--color-chart-series-a)',
    centerPercent: 74,
    centerLabelKey: 'confirmed',
    getSlices: () => donutSlices(74),
    legend: [
      {
        labelKey: 'confirmed',
        color: 'var(--color-chart-series-a)',
        display: { kind: 'count', value: 743 },
      },
      {
        labelKey: 'other',
        color: 'var(--color-chart-other)',
        display: { kind: 'count', value: 262 },
      },
    ],
    showTotal: true,
  },
];

export const FIXED_CHART_PERIOD_IDS = [
  ...FIXED_BAR_CHARTS.map((chart) => chart.id),
  ...FIXED_DONUT_CHARTS.map((chart) => chart.id),
] as const;

export type FixedChartId = (typeof FIXED_CHART_PERIOD_IDS)[number];
