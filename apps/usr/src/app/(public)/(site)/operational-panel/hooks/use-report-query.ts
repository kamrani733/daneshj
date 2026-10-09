'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getOperationalReport, operationalPanelKeys } from '@operational-panel/api';
import type { OperationalReportId, ReportRequest } from '@operational-panel/types';

/** Panel report pages: medium freshness; keep the previous page visible while the next one loads. */
export function useReportQuery(reportId: OperationalReportId, request: ReportRequest, enabled: boolean) {
  return useQuery({
    queryKey: operationalPanelKeys.report(reportId, request),
    queryFn: () => getOperationalReport(reportId, request),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    enabled,
  });
}
