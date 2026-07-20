'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

import {
  EMPTY_SEARCH_FILTERS,
  type SearchFilterValues,
  type SearchSortId,
} from '../data/search-filter-data';
import {
  applySearchFilters,
  filterMockSearchResults,
  type SearchQuery,
  type SearchResultItem,
} from '../data/search-mock';
import {
  getChipFilterCategory,
  getSearchCategoryChips,
  getSelectedChipId,
} from '../lib/search-category-chips';
import { HomeSearchFilterBar } from './home-search-filter-bar';
import { SearchResultCard } from './search-result-card';
import { SearchResultsHeader } from './search-results-header';

type HomeSearchResultsProps = {
  search: SearchQuery;
  /** Injected results for future API; defaults to mock filter. */
  results?: SearchResultItem[];
  className?: string;
};

/**
 * Figma Temp #66:5403 / library Head content #1:10021
 * Count («N تخفیف فعال») + Sub Category chips (gap 24) → filter 72 → cards.
 */
export function HomeSearchResults({
  search,
  results,
  className,
}: HomeSearchResultsProps) {
  const t = useTranslations('home.searchResults');
  const [filters, setFilters] = useState<SearchFilterValues>(EMPTY_SEARCH_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<SearchFilterValues>(EMPTY_SEARCH_FILTERS);
  const [sort, setSort] = useState<SearchSortId>('newest');

  const chips = useMemo(
    () => getSearchCategoryChips(search.category),
    [search.category]
  );
  const [chipId, setChipId] = useState(() =>
    getSelectedChipId(search.category, chips)
  );

  useEffect(() => {
    setFilters(EMPTY_SEARCH_FILTERS);
    setAppliedFilters(EMPTY_SEARCH_FILTERS);
    setSort('newest');
    setChipId(getSelectedChipId(search.category, chips));
  }, [search.query, search.category, chips]);

  const chipCategory = useMemo(
    () => getChipFilterCategory(search.category, chipId, chips),
    [search.category, chipId, chips]
  );

  const baseItems = useMemo(() => {
    if (results) return results;
    return filterMockSearchResults({
      query: search.query,
      category: chipCategory,
    });
  }, [results, search.query, chipCategory]);

  const items = useMemo(
    () => applySearchFilters(baseItems, appliedFilters, sort),
    [baseItems, appliedFilters, sort]
  );

  return (
    <section
      className={cn('relative flex w-full flex-col gap-6', className)}
      aria-label={t('title')}
    >
      <SearchResultsHeader
        count={items.length}
        chips={chips}
        chipId={chipId}
        onChipSelect={setChipId}
      />

      <HomeSearchFilterBar
        filters={filters}
        sort={sort}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        onApply={(next) => {
          setFilters(next);
          setAppliedFilters(next);
        }}
        onClear={() => {
          setFilters(EMPTY_SEARCH_FILTERS);
          setAppliedFilters(EMPTY_SEARCH_FILTERS);
        }}
      />

      {items.length === 0 ? (
        <div
          dir="rtl"
          className="relative z-0 flex min-h-[200px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-home-filter bg-home-card px-6 py-12 text-center"
        >
          <p className="text-base font-medium text-content">{t('emptyTitle')}</p>
          <p className="text-sm text-content-muted">{t('emptyBody')}</p>
        </div>
      ) : (
        /* Cards — 4×320 · col-gap 12 · row-gap 16 */
        <div
          className={cn(
            'relative z-0 grid w-full grid-cols-1 justify-items-center gap-4',
            'min-[640px]:grid-cols-2 min-[640px]:justify-items-stretch min-[640px]:gap-x-3 min-[640px]:gap-y-4',
            'min-[1280px]:grid-cols-4'
          )}
        >
          {items.map((item) => (
            <SearchResultCard
              key={item.id}
              title={item.title}
              businessName={item.subtitle}
              imageSrc={item.imageSrc}
              imageAlt={item.title}
              rating={item.rating}
              reviewCount={item.reviewCount ?? item.popularity}
              price={item.price}
              originalPrice={item.originalPrice}
              discountPercent={item.discountPercent}
              className="w-full"
            />
          ))}
        </div>
      )}
    </section>
  );
}
