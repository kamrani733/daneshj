/**
 * Operational panel reports — data entry point. Mock phase: validates the request and delegates to
 * `@operational-panel/mock`. When an endpoint exists for a report, only this module changes.
 */
import { mockGetReport } from '@operational-panel/mock/reports-mock';
import type { OperationalReportId, ReportPage, ReportRequest } from '@operational-panel/types';
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
