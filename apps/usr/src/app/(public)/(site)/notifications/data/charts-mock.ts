export type ChartPeriod = 'day' | 'week' | 'month' | 'season' | 'year';

export type BarPoint = {
  label: string;
  value: number;
};

export type DonutSlice = {
  key: 'primary' | 'other';
  value: number;
};

export const CHART_PERIODS: ChartPeriod[] = [
  'day',
  'week',
  'month',
  'season',
  'year',
];

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

const SYSTEM_SERIES: Record<ChartPeriod, BarPoint[]> = {
  day: daySeries(4),
  week: [
    { label: 'ش', value: 40 },
    { label: 'ی', value: 55 },
    { label: 'د', value: 48 },
    { label: 'س', value: 62 },
    { label: 'چ', value: 70 },
    { label: 'پ', value: 52 },
    { label: 'ج', value: 35 },
  ],
  month: [
    { label: '1', value: 30 },
    { label: '5', value: 48 },
    { label: '10', value: 62 },
    { label: '15', value: 55 },
    { label: '20', value: 78 },
    { label: '25', value: 66 },
    { label: '30', value: 42 },
  ],
  season: [
    { label: 'Q1', value: 120 },
    { label: 'Q2', value: 158 },
    { label: 'Q3', value: 142 },
    { label: 'Q4', value: 175 },
  ],
  year: [
    { label: '1400', value: 220 },
    { label: '1401', value: 280 },
    { label: '1402', value: 310 },
    { label: '1403', value: 265 },
    { label: '1404', value: 340 },
  ],
};

const MANUAL_SERIES: Record<ChartPeriod, BarPoint[]> = {
  day: daySeries(1),
  week: [
    { label: 'ش', value: 22 },
    { label: 'ی', value: 38 },
    { label: 'د', value: 30 },
    { label: 'س', value: 45 },
    { label: 'چ', value: 50 },
    { label: 'پ', value: 36 },
    { label: 'ج', value: 20 },
  ],
  month: [
    { label: '1', value: 20 },
    { label: '5', value: 36 },
    { label: '10', value: 48 },
    { label: '15', value: 40 },
    { label: '20', value: 58 },
    { label: '25', value: 52 },
    { label: '30', value: 28 },
  ],
  season: [
    { label: 'Q1', value: 90 },
    { label: 'Q2', value: 110 },
    { label: 'Q3', value: 98 },
    { label: 'Q4', value: 125 },
  ],
  year: [
    { label: '1400', value: 160 },
    { label: '1401', value: 190 },
    { label: '1402', value: 210 },
    { label: '1403', value: 185 },
    { label: '1404', value: 240 },
  ],
};

export function getSystemReceivedSeries(period: ChartPeriod): BarPoint[] {
  return SYSTEM_SERIES[period];
}

export function getManualReceivedSeries(period: ChartPeriod): BarPoint[] {
  return MANUAL_SERIES[period];
}

/** Link-click confirmed ratio — Figma ~74%. */
export function getLinkClickDonut(): DonutSlice[] {
  return [
    { key: 'primary', value: 74 },
    { key: 'other', value: 26 },
  ];
}

/** Read ratio — Figma highlights rejected slice (~18%). */
export function getReadRatioDonut(): DonutSlice[] {
  return [
    { key: 'primary', value: 18 },
    { key: 'other', value: 82 },
  ];
}

export const CHARTS_TOTAL_REQUESTS = 2557;
