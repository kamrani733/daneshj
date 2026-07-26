import type { LegendDisplay } from '@notifications/data/charts-mock';
import { formatFaNumber } from '@/lib/format-fa';

export function formatChartLegendValue(display: LegendDisplay): string {
  const formatted = formatFaNumber(display.value);
  return display.kind === 'percent' ? `${formatted}٪` : formatted;
}
