/**
 * Operational panel reports, stats and charts — data entry point. Mock phase: validates the request and delegates to
 * `@operational-panel/mock`. When an endpoint exists for a report, only this module changes.
 */
import type { ChartPeriod } from '@/components/charts';

import {
  mockGetChart,
  mockGetComparison,
  mockGetComparisonOptions,
} from '@operational-panel/mock/charts-mock';
import { mockGetReport } from '@operational-panel/mock/reports-mock';
import { mockGetStats } from '@operational-panel/mock/stats-mock';
import type { OperationalReportId, ReportPage, ReportRequest } from '@operational-panel/types';
import {
  COMPARISON_FIELDS,
  type ComparisonOptions,
  type ComparisonRequest,
  type ComparisonResult,
  type OperationalChartData,
} from '@operational-panel/types/charts';
import type { OperationalStats, StatsFilters } from '@operational-panel/types/stats';
import { COMPARABLE_CHART_IDS, findChartDefinition } from '@operational-panel/utils/chart-definitions';
import { parseDateRange, writeDateRange, type DateRange } from '@operational-panel/utils/date-range-params';
import { getReportDefinition } from '@operational-panel/utils/report-definitions';
import {
  parseReportParams,
  writeReportParams,
} from '@operational-panel/utils/report-params';

export { operationalPanelKeys } from '@operational-panel/api/query-keys';

/** Re-validates a request through the URL parser (normalized query, known sort, sane page, valid dates). */
function sanitizeRequest(reportId: OperationalReportId, request: ReportRequest): ReportRequest {
  const definition = getReportDefinition(reportId);
  return parseReportParams(definition, writeReportParams(definition, request, new URLSearchParams()));
}

export function getOperationalReport(
  reportId: OperationalReportId,
  request: ReportRequest,
): Promise<ReportPage> {
  return mockGetReport(getReportDefinition(reportId), sanitizeRequest(reportId, request));
}

/** «آمار» cards (every section except notifications, which uses the Notification MS). */
export function getOperationalStats(filters: StatsFilters): Promise<OperationalStats> {
  const params = writeDateRange('stats', filters, new URLSearchParams());
  return mockGetStats(parseDateRange('stats', params));
}

/** One «نمودار» chart for a period. Unknown chart ids are rejected, never forwarded. */
export function getOperationalChart(
  chartId: string,
  period: ChartPeriod,
  range: DateRange,
): Promise<OperationalChartData> {
  const chart = findChartDefinition(chartId);
  if (!chart) return Promise.reject(new Error(`Unknown chart ${chartId}`));
  return mockGetChart(chart, period, parseDateRange('charts', writeDateRange('charts', range, new URLSearchParams())));
}

/** «نمودارهای قابل تنظیم» — one series per configured group. Only known statistics and fields are sent. */
export function getComparison(request: ComparisonRequest): Promise<ComparisonResult> {
  if (!COMPARABLE_CHART_IDS.includes(request.statId)) {
    return Promise.reject(new Error(`Unknown statistic ${request.statId}`));
  }
  const known = new Set<string>(COMPARISON_FIELDS);
  const groups = Object.fromEntries(
    Object.entries(request.groups).map(([group, filters]) => [
      group,
      Object.fromEntries(Object.entries(filters ?? {}).filter(([field, value]) => known.has(field) && value)),
    ]),
  );
  return mockGetComparison({ ...request, groups });
}

/** University and major option lists for the comparison filters. */
export function getComparisonOptions(): Promise<ComparisonOptions> {
  return mockGetComparisonOptions();
}
