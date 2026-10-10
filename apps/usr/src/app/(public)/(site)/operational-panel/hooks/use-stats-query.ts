'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getOperationalStats, operationalPanelKeys } from '@operational-panel/api';
import type { StatsFilters } from '@operational-panel/types/stats';

/** «آمار» cards — aggregates change slowly. */
export function useStatsQuery(filters: StatsFilters) {
  return useQuery({
    queryKey: operationalPanelKeys.stats(filters),
    queryFn: () => getOperationalStats(filters),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60_000,
  });
}
