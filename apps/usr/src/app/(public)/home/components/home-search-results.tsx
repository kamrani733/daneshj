'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { DiscountCard, type DiscountCardData } from '@/components/cards';
import { Badge } from '@/components/ui/badge';
import { formatFaNumber, formatToman } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import {
  EMPTY_SEARCH_FILTERS,
  type SearchFilterValues,
  type SearchSortId,
} from '@home/data/search-filter-data';
import {
  applySearchFilters,
  filterMockSearchResults,
  type SearchQuery,
  type SearchResultItem,
} from '@home/data/search-mock';
import {
  getChipFilterCategory,
  getSearchCategoryChips,
  getSelectedChipId,
} from '@home/lib/search-category-chips';
import { HomeSearchFilterBar } from '@home/components/home-search-filter-bar';
import { SearchResultsHeader } from '@home/components/search-results-header';

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
          className="relative z-0 flex min-h-[200px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-app-filter bg-app-card px-6 py-12 text-center"
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
            <DiscountCard
              key={item.id}
              {...toDiscountCard(item)}
              ratingVisibility="always"
              extraChips={
                <>
                  {item.badge ? (
                    <Badge className="h-8 rounded-full border-0 bg-warning-subtle px-3 text-label-large font-medium text-warning-700 dark:text-warning-50">
                      {item.badge}
                    </Badge>
                  ) : null}
                  {typeof item.sellCount === 'number' ? (
                    <Badge variant="sell">{formatFaNumber(item.sellCount)} خرید</Badge>
                  ) : null}
                  {item.address ? <Badge variant="meta">{item.address}</Badge> : null}
                </>
              }
              className="w-full max-w-[320px] min-[640px]:max-w-none"
            />
          ))}
        </div>
      )}
    </section>
  );
}

/** Search mock item → shared discount card (prices / percent formatted in Persian). */
function toDiscountCard(item: SearchResultItem): DiscountCardData {
  const hasDiscount =
    typeof item.discountPercent === 'number' && item.discountPercent > 0;
  const beforePrice =
    item.originalPrice ??
    (hasDiscount
      ? Math.round(item.price / (1 - (item.discountPercent as number) / 100))
      : undefined);
  return {
    title: item.title,
    businessName: item.subtitle,
    imageSrc: item.imageSrc,
    postedAgo: item.timeLabel,
    discountBadge: hasDiscount
      ? `${formatFaNumber(item.discountPercent as number)}٪ تخفیف`
      : undefined,
    originalPrice: beforePrice != null ? formatToman(beforePrice) : undefined,
    finalPrice: formatToman(item.price),
    rating: item.rating,
    reviewCount: item.reviewCount ?? item.popularity,
  };
}
