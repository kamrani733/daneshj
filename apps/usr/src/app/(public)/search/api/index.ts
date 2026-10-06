/**
 * Global search data entry point. Mock phase: validates input and delegates to `@search/mock`.
 * When the search endpoint exists, only this module changes.
 */
import {
  mockGetCategoryOptions,
  mockGetServiceTree,
  mockGetTrendingSearches,
  mockSearchAll,
} from '@search/mock/search-mock';
import type {
  SearchCategoryOption,
  SearchRequest,
  SearchResults,
  SearchTrendingItem,
} from '@search/types';
import {
  buildSearchQueryString,
  parseSearchParams,
} from '@search/utils/search-params';

/** Re-validates a request through the URL parser (normalized query, safe ids, known sections). */
function sanitizeRequest(request: SearchRequest): SearchRequest {
  return parseSearchParams(
    new URLSearchParams(buildSearchQueryString(request)),
  );
}

export function searchAll(request: SearchRequest): Promise<SearchResults> {
  return mockSearchAll(sanitizeRequest(request));
}

/** Services tree (main → sub); leaves are selectable services. */
export function getSearchServiceTree(): Promise<SearchCategoryOption[]> {
  return mockGetServiceTree();
}

export function getSearchCategoryOptions(
  serviceId: string,
): Promise<SearchCategoryOption[]> {
  return mockGetCategoryOptions(serviceId);
}

/** «پرجستجوترین‌های هفته» — most searched queries this week. */
export function getTrendingSearches(): Promise<SearchTrendingItem[]> {
  return mockGetTrendingSearches();
}
