import type { OperationalReportId, ReportRequest } from '@operational-panel/types';

export const operationalPanelKeys = {
  all: ['operational-panel'] as const,
  reports: () => [...operationalPanelKeys.all, 'reports'] as const,
  report: (reportId: OperationalReportId, request: ReportRequest) =>
    [...operationalPanelKeys.reports(), reportId, request] as const,
};
