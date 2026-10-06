'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  getSearchCategoryOptions,
  getSearchServiceTree,
  getTrendingSearches,
  searchAll,
} from '@search/api';
import { searchKeys } from '@search/api/query-keys';
import type { SearchRequest } from '@search/types';

/** Results change often; keep the previous page visible while a new query loads. */
export function useSearchResults(request: SearchRequest) {
  return useQuery({
    queryKey: searchKeys.results(request),
    queryFn: () => searchAll(request),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

/** Services tree (main → sub) — near-static reference data, shared by both service filters. */
export function useSearchServiceTree() {
  return useQuery({
    queryKey: searchKeys.serviceTree(),
    queryFn: () => getSearchServiceTree(),
    staleTime: 60 * 60_000,
  });
}

/** Category tree of one service — near-static reference data. */
export function useSearchCategoryOptions(serviceId: string | null) {
  return useQuery({
    queryKey: searchKeys.categoryOptions(serviceId ?? ''),
    queryFn: () => getSearchCategoryOptions(serviceId as string),
    enabled: serviceId !== null,
    staleTime: 60 * 60_000,
  });
}

/** Weekly trending searches — changes slowly. */
export function useTrendingSearches() {
  return useQuery({
    queryKey: searchKeys.trending(),
    queryFn: () => getTrendingSearches(),
    staleTime: 10 * 60_000,
  });
}
