'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { ChartPeriod } from '@/components/charts';

import {
  getComparison,
  getComparisonOptions,
  getOperationalChart,
  operationalPanelKeys,
} from '@operational-panel/api';
import type { ComparisonRequest } from '@operational-panel/types/charts';
import type { DateRange } from '@operational-panel/utils/date-range-params';

/** One chart for a period; the previous period stays visible while the next loads. */
export function useChartQuery(chartId: string, period: ChartPeriod, range: DateRange, enabled: boolean) {
  return useQuery({
    queryKey: operationalPanelKeys.chart(chartId, period, range),
    queryFn: () => getOperationalChart(chartId, period, range),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60_000,
    enabled,
  });
}

/** Comparison series — only once a statistic and at least one group are set. */
export function useComparisonQuery(request: ComparisonRequest, enabled: boolean) {
  return useQuery({
    queryKey: operationalPanelKeys.comparison(request),
    queryFn: () => getComparison(request),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60_000,
    enabled,
  });
}

/** Near-static option lists. */
export function useComparisonOptions() {
  return useQuery({
    queryKey: operationalPanelKeys.comparisonOptions(),
    queryFn: () => getComparisonOptions(),
    staleTime: 60 * 60_000,
  });
}
