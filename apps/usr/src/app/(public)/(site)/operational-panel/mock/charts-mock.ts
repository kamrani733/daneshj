// MOCK ONLY — fake «نمودار» series. Imported by `@operational-panel/api`.
import type { BarDatum, ChartPeriod } from '@/components/charts';

import type {
  ComparisonOptions,
  ComparisonRequest,
  ComparisonResult,
  OperationalChartData,
} from '@operational-panel/types/charts';
import type { ChartDefinition } from '@operational-panel/utils/chart-definitions';
import type { DateRange } from '@operational-panel/utils/date-range-params';

const LATENCY_MS = 350;

const WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

/** X-axis buckets per period: hours · weekdays · days · weeks · months (latest bucket last). */
export function periodLabels(period: ChartPeriod): string[] {
  switch (period) {
    case 'day':
      return Array.from({ length: 24 }, (_, hour) => String(hour));
    case 'week':
      return WEEKDAYS;
    case 'month':
      return Array.from({ length: 30 }, (_, day) => String(day + 1));
    case 'season':
      return Array.from({ length: 13 }, (_, week) => `هفته ${week + 1}`);
    case 'year':
      return MONTHS;
  }
}

/** Deterministic 0–1 generator (mulberry32) seeded from a string. */
function seeded(seed: string): () => number {
  let state = 0;
  for (let index = 0; index < seed.length; index += 1) state = (Math.imul(31, state) + seed.charCodeAt(index)) | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function series(seed: string, length: number, max: number): number[] {
  const random = seeded(seed);
  return Array.from({ length }, () => Math.round(max * (0.25 + random() * 0.75)));
}

const PERIOD_SCALE: Record<ChartPeriod, number> = { day: 12, week: 80, month: 60, season: 300, year: 1200 };

export function queryMockChart(chart: ChartDefinition, period: ChartPeriod, range: DateRange): OperationalChartData {
  const seed = `${chart.id}:${period}:${range.from}:${range.to}`;
  if (chart.type === 'donut') {
    const random = seeded(seed);
    const total = Math.round(800 + random() * 2400);
    return { kind: 'donut', percent: Math.round(10 + random() * 80), total };
  }

  const labels = periodLabels(period);
  const max = chart.type === 'bar' && chart.valueUnit === 'hours' ? 8 : PERIOD_SCALE[period];
  if (chart.type === 'groupedBar') {
    const values = chart.series.map((item) => series(`${seed}:${item.key}`, labels.length, max));
    const points: BarDatum[] = labels.map((label, index) => ({
      label,
      ...Object.fromEntries(chart.series.map((item, seriesIndex) => [item.key, values[seriesIndex][index]])),
    }));
    return { kind: 'bar', points };
  }

  const values = series(seed, labels.length, max);
  return { kind: 'bar', points: labels.map((label, index) => ({ label, value: values[index] })) };
}

export function mockGetChart(
  chart: ChartDefinition,
  period: ChartPeriod,
  range: DateRange,
): Promise<OperationalChartData> {
  return new Promise((resolve) => setTimeout(() => resolve(queryMockChart(chart, period, range)), LATENCY_MS));
}

/** Each group's series depends on the statistic, period and that group's filters. */
export function queryMockComparison(request: ComparisonRequest): ComparisonResult {
  const labels = periodLabels(request.period);
  const result: ComparisonResult = { labels, series: {} };
  for (const group of ['a', 'b'] as const) {
    const filters = request.groups[group];
    if (!filters || Object.keys(filters).length === 0) continue;
    const seed = `${request.statId}:${request.period}:${JSON.stringify(Object.entries(filters).sort())}`;
    result.series[group] = series(seed, labels.length, PERIOD_SCALE[request.period]);
  }
  return result;
}

export function mockGetComparison(request: ComparisonRequest): Promise<ComparisonResult> {
  return new Promise((resolve) => setTimeout(() => resolve(queryMockComparison(request)), LATENCY_MS));
}

const UNIVERSITIES = ['دانشگاه تهران', 'دانشگاه شیراز', 'دانشگاه صنعتی شریف', 'دانشگاه اصفهان', 'دانشگاه علوم پزشکی شیراز'];
const MAJORS = ['مامایی', 'علوم پزشکی', 'مهندسی کامپیوتر', 'داروسازی', 'حقوق', 'روانشناسی'];

export function mockGetComparisonOptions(): Promise<ComparisonOptions> {
  const toOptions = (labels: string[]) => labels.map((label, index) => ({ value: String(index + 1), label }));
  return new Promise((resolve) =>
    setTimeout(() => resolve({ universities: toOptions(UNIVERSITIES), majors: toOptions(MAJORS) }), LATENCY_MS),
  );
}
