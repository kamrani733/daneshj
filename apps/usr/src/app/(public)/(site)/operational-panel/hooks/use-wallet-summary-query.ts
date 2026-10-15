'use client';

import { useQuery } from '@tanstack/react-query';

import { getWalletSummary, operationalPanelKeys } from '@operational-panel/api';

/** Balance changes with every transaction — short freshness. */
export function useWalletSummaryQuery() {
  return useQuery({
    queryKey: operationalPanelKeys.walletSummary(),
    queryFn: getWalletSummary,
    staleTime: 30_000,
  });
}
