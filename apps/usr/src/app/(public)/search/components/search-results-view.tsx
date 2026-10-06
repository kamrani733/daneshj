'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { CompactMediaCard } from '@/components/cards';
import { ErrorState } from '@/components/ui/error-state';
import { NoResultState } from '@/components/ui/no-result-state';
import { Spinner } from '@/components/ui/spinner';
import { formatFaNumber } from '@/lib/format-fa';

import { ProductFilterPanel } from '@search/components/product-filter-panel';
import { SearchResultSection } from '@search/components/search-result-section';
import {
  ProviderFilterPanel,
  ServiceFilterPanel,
  UserFilterPanel,
} from '@search/components/section-filter-panels';
import { SearchTrending } from '@search/components/search-trending';
import { useSearchResults } from '@search/hooks/use-search-queries';
import type {
  SearchFilterState,
  SearchSectionId,
  SearchUrlState,
} from '@search/types';
import { hasActiveFilters } from '@search/utils/search-params';

type SearchResultsViewProps = {
  state: SearchUrlState;
  onApplyFilters: (patch: Partial<SearchFilterState>) => void;
  onToggleExpanded: (id: SearchSectionId) => void;
  /** Runs a new search (trending suggestions). */
  onSearch: (query: string) => void;
};

const sectionDomId = (id: SearchSectionId) => `search-section-${id}`;

/** Count line + the four result groups (محصولات · سرویس‌ها · سرویس دهنده‌ها · کاربران). */
export function SearchResultsView({
  state,
  onApplyFilters,
  onToggleExpanded,
  onSearch,
}: SearchResultsViewProps) {
  const t = useTranslations('search');
  const [openFilters, setOpenFilters] = useState<SearchSectionId[]>([]);
  const { data, isPending, isError, isFetching, refetch } =
    useSearchResults(state);

  if (isPending) {
    return (
      <div
        className="flex min-h-56 items-center justify-center"
        aria-live="polite"
      >
        <Spinner className="size-8 text-primary" aria-label={t('loading')} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={t('error')}
        retryLabel={t('retry')}
        onRetry={() => void refetch()}
      />
    );
  }

  // Nothing at all for this query (and no filter to undo): Figma no-result frame.
  if (data.total === 0 && !hasActiveFilters(state)) {
    return (
      <div className="flex flex-col">
        <SearchTrending onSelect={onSearch} />
        <NoResultState message={t('noResult')} />
      </div>
    );
  }

  const isExpanded = (id: SearchSectionId) => state.expand.includes(id);
  const closeFilter = (id: SearchSectionId) =>
    setOpenFilters((open) => open.filter((section) => section !== id));

  /**
   * «اعمال فیلتر»: update the URL (→ new results), close the panel and bring the group's header
   * into view, so the filtered cards are visible right away (the panel can be taller than a phone).
   */
  const applySectionFilter = (
    id: SearchSectionId,
    patch: Partial<SearchFilterState>,
  ) => {
    onApplyFilters(patch);
    closeFilter(id);
    const section = document.getElementById(sectionDomId(id));
    if (section && section.getBoundingClientRect().top < 0) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /** Shared props of every section: DOM id, expand + filter toggles. */
  const sectionState = (id: SearchSectionId) => ({
    id: sectionDomId(id),
    expanded: isExpanded(id),
    onToggleExpanded: () => onToggleExpanded(id),
    filterOpen: openFilters.includes(id),
    onFilterToggle: () =>
      setOpenFilters((open) =>
        open.includes(id)
          ? open.filter((section) => section !== id)
          : [...open, id],
      ),
  });

  return (
    <div
      className="flex flex-col gap-6 min-[640px]:gap-8"
      aria-busy={isFetching || undefined}
    >
      {/* Figma mobile frames have no total line. */}
      <p
        className="hidden text-body-large text-on-surface min-[640px]:block"
        aria-live="polite"
      >
        {t('resultCount', { count: formatFaNumber(data.total) })}
      </p>

      <SearchResultSection
        title={t('sections.products')}
        total={data.products.total}
        {...sectionState('products')}
        filterPanel={
          <ProductFilterPanel
            service={state.service}
            categories={state.categories}
            onApply={(filter) => applySectionFilter('products', filter)}
          />
        }
      >
        {data.products.items.map((item) => (
          <CompactMediaCard
            key={item.id}
            title={item.title}
            subtitle={item.serviceTitle}
            imageSrc={item.imageSrc}
          />
        ))}
      </SearchResultSection>

      <SearchResultSection
        title={t('sections.services')}
        total={data.services.total}
        {...sectionState('services')}
        filterPanel={
          <ServiceFilterPanel
            value={state.serviceCategories}
            onApply={(serviceCategories) =>
              applySectionFilter('services', { serviceCategories })
            }
          />
        }
      >
        {data.services.items.map((item) => (
          <CompactMediaCard
            key={item.id}
            title={item.title}
            imageSrc={item.imageSrc}
          />
        ))}
      </SearchResultSection>

      <SearchResultSection
        title={t('sections.providers')}
        total={data.providers.total}
        {...sectionState('providers')}
        filterPanel={
          <ProviderFilterPanel
            value={state.providerTypes}
            onApply={(providerTypes) =>
              applySectionFilter('providers', { providerTypes })
            }
          />
        }
      >
        {data.providers.items.map((item) => (
          <CompactMediaCard
            key={item.id}
            title={item.name}
            imageSrc={item.imageSrc}
          />
        ))}
      </SearchResultSection>

      <SearchResultSection
        title={t('sections.users')}
        total={data.users.total}
        {...sectionState('users')}
        filterPanel={
          <UserFilterPanel
            value={state.userTypes}
            onApply={(userTypes) => applySectionFilter('users', { userTypes })}
          />
        }
      >
        {data.users.items.map((item) => (
          <CompactMediaCard
            key={item.id}
            tone="accent"
            title={item.fullName}
            subtitle={item.username}
            imageSrc={item.avatarSrc}
          />
        ))}
      </SearchResultSection>
    </div>
  );
}
