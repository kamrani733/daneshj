import type { OperationalReportId, ReportRequest } from '@operational-panel/types';
import type { ChartPeriod } from '@/components/charts';

import type { ComparisonRequest } from '@operational-panel/types/charts';
import type { StatsFilters } from '@operational-panel/types/stats';
import type { DateRange } from '@operational-panel/utils/date-range-params';

export const operationalPanelKeys = {
  all: ['operational-panel'] as const,
  reports: () => [...operationalPanelKeys.all, 'reports'] as const,
  report: (reportId: OperationalReportId, request: ReportRequest) =>
    [...operationalPanelKeys.reports(), reportId, request] as const,
  stats: (filters: StatsFilters) => [...operationalPanelKeys.all, 'stats', filters] as const,
  chart: (chartId: string, period: ChartPeriod, range: DateRange) =>
    [...operationalPanelKeys.all, 'chart', chartId, period, range] as const,
  comparison: (request: ComparisonRequest) => [...operationalPanelKeys.all, 'comparison', request] as const,
  comparisonOptions: () => [...operationalPanelKeys.all, 'comparison-options'] as const,
};
