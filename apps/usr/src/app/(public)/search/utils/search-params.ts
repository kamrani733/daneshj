import { normalizeFaText } from '@/lib/normalize-fa';

import {
  PROVIDER_TYPE_IDS,
  SEARCH_SECTION_IDS,
  USER_TYPE_IDS,
  type SearchFilterState,
  type SearchUrlState,
} from '@search/types';

/** SRS input convention: search fields accept at most 50 characters. */
export const SEARCH_QUERY_MAX_LENGTH = 50;

/** Results shown per section before «مشاهده همه» (3 rows × 3 columns). */
export const SEARCH_PREVIEW_SIZE = 9;

/** Phones show only the first cards of the preview (Figma mobile frames). */
export const SEARCH_PREVIEW_SIZE_PHONE = 4;

export const SEARCH_ROUTE = '/search';

const PARAM = {
  query: 'q',
  service: 'service',
  categories: 'cat',
  serviceCategories: 'scat',
  providerTypes: 'ptype',
  userTypes: 'utype',
  expand: 'expand',
} as const;

const ID_PATTERN = /^[a-z0-9-]{1,64}$/;

type ParamsReader = { get(name: string): string | null };

export const EMPTY_SEARCH_FILTERS: SearchFilterState = {
  service: null,
  categories: [],
  serviceCategories: [],
  providerTypes: [],
  userTypes: [],
};

export const EMPTY_SEARCH_STATE: SearchUrlState = {
  q: '',
  ...EMPTY_SEARCH_FILTERS,
  expand: [],
};

/** Normalizes and clamps a raw query (Persian letters, Latin digits, ≤ 50 chars). */
export function normalizeSearchQuery(raw: string): string {
  return normalizeFaText(raw).slice(0, SEARCH_QUERY_MAX_LENGTH).trim();
}

function readIdList(value: string | null): string[] {
  if (!value) return [];
  const ids = value
    .split(',')
    .map((id) => id.trim())
    .filter((id) => ID_PATTERN.test(id));
  return Array.from(new Set(ids));
}

/** Keeps only ids from a known list (enum filters, section ids). */
function readKnownIds<T extends string>(
  value: string | null,
  known: readonly T[],
): T[] {
  return readIdList(value).filter((id): id is T =>
    (known as readonly string[]).includes(id),
  );
}

/** URL → state. Unknown or malformed values are dropped, never trusted. */
export function parseSearchParams(params: ParamsReader): SearchUrlState {
  const service = params.get(PARAM.service);
  const validService = service && ID_PATTERN.test(service) ? service : null;

  return {
    q: normalizeSearchQuery(params.get(PARAM.query) ?? ''),
    service: validService,
    // Categories only make sense for a selected service.
    categories: validService ? readIdList(params.get(PARAM.categories)) : [],
    serviceCategories: readIdList(params.get(PARAM.serviceCategories)),
    providerTypes: readKnownIds(
      params.get(PARAM.providerTypes),
      PROVIDER_TYPE_IDS,
    ),
    userTypes: readKnownIds(params.get(PARAM.userTypes), USER_TYPE_IDS),
    expand: readKnownIds(params.get(PARAM.expand), SEARCH_SECTION_IDS),
  };
}

function setList(params: URLSearchParams, name: string, ids: string[]) {
  if (ids.length > 0) params.set(name, ids.join(','));
}

/** State → query string (without «?»). Empty values are omitted. */
export function buildSearchQueryString(state: SearchUrlState): string {
  const params = new URLSearchParams();
  const q = normalizeSearchQuery(state.q);
  if (q) params.set(PARAM.query, q);
  if (state.service) {
    params.set(PARAM.service, state.service);
    setList(params, PARAM.categories, state.categories);
  }
  setList(params, PARAM.serviceCategories, state.serviceCategories);
  setList(params, PARAM.providerTypes, state.providerTypes);
  setList(params, PARAM.userTypes, state.userTypes);
  setList(params, PARAM.expand, state.expand);
  return params.toString();
}

/** True when any section filter is applied (the page then keeps its groups even with 0 results). */
export function hasActiveFilters(state: SearchFilterState): boolean {
  return (
    state.service !== null ||
    state.categories.length > 0 ||
    state.serviceCategories.length > 0 ||
    state.providerTypes.length > 0 ||
    state.userTypes.length > 0
  );
}

/** `/search?q=…` for the header search box. */
export function buildSearchHref(query: string): string {
  const qs = buildSearchQueryString({ ...EMPTY_SEARCH_STATE, q: query });
  return qs ? `${SEARCH_ROUTE}?${qs}` : SEARCH_ROUTE;
}
