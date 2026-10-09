'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import type { ReportDefinition, ReportFilters, ReportRequest } from '@operational-panel/types';
import { parseReportParams, writeReportParams } from '@operational-panel/utils/report-params';

/**
 * One report's search, sort, filters and page live in the URL (shareable, back-button safe).
 * Changing search, sort or filters goes back to page 1.
 */
export function useReportUrlState(definition: ReportDefinition) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const request = useMemo(
    () => parseReportParams(definition, searchParams),
    [definition, searchParams],
  );

  const replace = useCallback(
    (next: ReportRequest) => {
      const qs = writeReportParams(definition, next, searchParams).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [definition, pathname, router, searchParams],
  );

  return {
    request,
    setQuery: useCallback((q: string) => replace({ ...request, q, page: 1 }), [replace, request]),
    setSort: useCallback((sort: string) => replace({ ...request, sort, page: 1 }), [replace, request]),
    setFilters: useCallback(
      (filters: ReportFilters) => replace({ ...request, filters, page: 1 }),
      [replace, request],
    ),
    setPage: useCallback((page: number) => replace({ ...request, page }), [replace, request]),
  };
}
