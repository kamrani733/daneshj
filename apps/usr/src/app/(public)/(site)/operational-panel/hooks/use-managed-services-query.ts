'use client';

import { useQuery } from '@tanstack/react-query';

import { getManagedServices, operationalPanelKeys } from '@operational-panel/api';

/** «مدیریت سرویس‌ها» cards — product counts change slowly. */
export function useManagedServicesQuery() {
  return useQuery({
    queryKey: operationalPanelKeys.managedServices(),
    queryFn: getManagedServices,
    staleTime: 60_000,
  });
}
