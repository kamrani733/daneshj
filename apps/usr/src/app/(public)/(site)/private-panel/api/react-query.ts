'use client';

import { useQuery } from '@tanstack/react-query';

import { MOCK_PRIVATE_PANEL } from '@private-panel/data/private-panel-mock';
import type { PrivatePanelProfile } from '@private-panel/data/private-panel-ui';

import { privatePanelQueryKeys } from './query-keys';

async function fetchPrivatePanelProfile(): Promise<PrivatePanelProfile> {
  // Replace with Actor MS retrieve-for-owner when available.
  return MOCK_PRIVATE_PANEL;
}

/** Owner private-panel profile (mock until Actor MS). */
export function usePrivatePanelProfileQuery(initialData?: PrivatePanelProfile) {
  return useQuery({
    queryKey: privatePanelQueryKeys.profile(),
    queryFn: fetchPrivatePanelProfile,
    initialData,
    staleTime: 60_000,
  });
}
