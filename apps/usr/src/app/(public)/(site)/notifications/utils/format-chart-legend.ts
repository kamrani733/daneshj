import type { LegendDisplay } from '@notifications/types/charts';
import { formatFaNumber } from '@/lib/format-fa';

export function formatChartLegendValue(display: LegendDisplay): string {
  const formatted = formatFaNumber(display.value);
  return display.kind === 'percent' ? `${formatted}٪` : formatted;
}
