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
import { HomeSearchFilterBar } from './home-search-filter-bar';
import { SearchResultCard } from './search-result-card';
import { SectionTitle } from './section-title';

type HomeSearchResultsProps = {
  search: SearchQuery;
  /** Injected results for future API; defaults to mock filter. */
  results?: SearchResultItem[];
  className?: string;
};

/**
 * Figma Temp #66:5403 / #66:5524 — search results + filter bar (#75:1065).
 * Mock data for now; pass `results` from an API later.
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

  useEffect(() => {
    setFilters(EMPTY_SEARCH_FILTERS);
    setAppliedFilters(EMPTY_SEARCH_FILTERS);
    setSort('newest');
  }, [search.query, search.category]);

  const baseItems = useMemo(
    () => results ?? filterMockSearchResults(search),
    [results, search]
  );

  const items = useMemo(
    () => applySearchFilters(baseItems, appliedFilters, sort),
    [baseItems, appliedFilters, sort]
  );

  const activeLabel = search.query.trim() || search.category?.trim() || '';
  const heading = activeLabel
    ? t('titleWithQuery', { query: activeLabel })
    : t('title');

  return (
    <section
      className={cn('relative flex w-full flex-col gap-6 min-[834px]:gap-8', className)}
      aria-label={t('title')}
    >
      <div className="flex flex-col items-end gap-2">
        <SectionTitle
          title={heading}
          variant="wide"
          className="!min-h-[89px] !w-[384px] max-w-full self-start [&_h2]:text-2xl [&_h2]:leading-9"
        />
        <p
          dir="rtl"
          className="w-full px-4 text-right text-base font-medium leading-6 tracking-[0.0094em] text-home-filter-ink"
        >
          {t('count', { count: items.length })}
        </p>
      </div>

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
          className="relative z-0 flex min-h-[200px] w-full flex-col items-center justify-center gap-2 rounded-2xl bg-home-card px-6 py-12 text-center shadow-home-elevation-1"
        >
          <p className="text-base font-medium text-content">{t('emptyTitle')}</p>
          <p className="text-sm text-content-muted">{t('emptyBody')}</p>
        </div>
      ) : (
        <div
          className={cn(
            'relative z-0 grid grid-cols-1 justify-items-center gap-4',
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
