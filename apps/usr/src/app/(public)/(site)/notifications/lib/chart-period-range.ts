import type { ChartPeriod } from '@notifications/data/charts';

/** Map UI chart period to ISO start/end for charts_report query. */
export function chartPeriodToDateRange(period: ChartPeriod): {
  startDate: string;
  endDate: string;
} {
  const end = new Date();
  const start = new Date(end);

  switch (period) {
    case 'day':
      start.setDate(end.getDate() - 1);
      break;
    case 'week':
      start.setDate(end.getDate() - 7);
      break;
    case 'month':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'season':
      start.setMonth(end.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setDate(end.getDate() - 7);
  }

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}

/** Short axis label from ISO / date string. */
export function formatChartDateLabel(value: string): string {
  const match = value.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  const day = Number(match[3]);
  return String(day);
}
