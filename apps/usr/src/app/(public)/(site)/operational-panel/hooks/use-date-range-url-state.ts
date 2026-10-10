'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { parseDateRange, writeDateRange, type DateRange } from '@operational-panel/utils/date-range-params';

/** One block's date-range filter in the URL (shareable, back-button safe). */
export function useDateRangeUrlState(prefix: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const range = useMemo(() => parseDateRange(prefix, searchParams), [prefix, searchParams]);

  const setRange = useCallback(
    (next: DateRange) => {
      const qs = writeDateRange(prefix, next, searchParams).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, prefix, router, searchParams],
  );

  return { range, setRange };
}
