export type SearchSortId =
  | 'newest'
  | 'mostDiscount'
  | 'popular'
  | 'priceHigh'
  | 'priceLow';

export type SearchFilterValues = {
  query: string;
  discountMin: string;
  discountMax: string;
  priceMin: string;
  priceMax: string;
  dateFrom: string;
  dateTo: string;
  ratingMin: string;
};

export const EMPTY_SEARCH_FILTERS: SearchFilterValues = {
  query: '',
  discountMin: '',
  discountMax: '',
  priceMin: '',
  priceMax: '',
  dateFrom: '',
  dateTo: '',
  ratingMin: '',
};

/** Figma sort menu #1:13398 — 5 items. */
export const SEARCH_SORT_OPTIONS: { id: SearchSortId; labelKey: SearchSortId }[] = [
  { id: 'newest', labelKey: 'newest' },
  { id: 'mostDiscount', labelKey: 'mostDiscount' },
  { id: 'popular', labelKey: 'popular' },
  { id: 'priceHigh', labelKey: 'priceHigh' },
  { id: 'priceLow', labelKey: 'priceLow' },
];
