'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import type {
  SearchFilterState,
  SearchSectionId,
  SearchUrlState,
} from '@search/types';
import {
  buildSearchQueryString,
  parseSearchParams,
} from '@search/utils/search-params';

/** Query, product filter and expanded sections live in the URL (shareable, back-button safe). */
export function useSearchUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo(() => parseSearchParams(searchParams), [searchParams]);

  const replace = useCallback(
    (next: SearchUrlState) => {
      const qs = buildSearchQueryString(next);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const setQuery = useCallback(
    (q: string) => replace({ ...state, q, expand: [] }),
    [replace, state],
  );

  /** Applies one section's filter (a partial patch of the filter state). */
  const applyFilters = useCallback(
    (patch: Partial<SearchFilterState>) => replace({ ...state, ...patch }),
    [replace, state],
  );

  const toggleExpanded = useCallback(
    (id: SearchSectionId) => {
      const expand = state.expand.includes(id)
        ? state.expand.filter((section) => section !== id)
        : [...state.expand, id];
      replace({ ...state, expand });
    },
    [replace, state],
  );

  return { state, setQuery, applyFilters, toggleExpanded };
}
