'use client';

import { useTranslations } from 'next-intl';

import { SectionHeading } from '@/components/ui/section-heading';

import { SearchQueryField } from '@search/components/search-query-field';
import { SearchResultsView } from '@search/components/search-results-view';
import { useSearchUrlState } from '@search/hooks/use-search-url-state';

/**
 * «نتایج جستجو» — opened from the header search box. Query, the filters of all four sections and
 * expanded sections live in the URL (`?q=&service=&cat=&scat=&ptype=&utype=&expand=`).
 * Spec: `docs/design-specs/search/search-results.md`.
 */
export function SearchPage() {
  const t = useTranslations('search');
  const { state, setQuery, applyFilters, toggleExpanded } = useSearchUrlState();

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1512px] px-4 pb-16 min-[834px]:px-12 min-[1512px]:px-[100px]">
      <div className="flex flex-col gap-6 pt-6 min-[834px]:pt-8">
        <SectionHeading
          as="h1"
          title={t('title')}
          tone="secondary"
          align="start"
          size="responsive"
          className="self-start px-0"
        />
        <SearchQueryField value={state.q} onDebouncedChange={setQuery} />
        <SearchResultsView
          state={state}
          onApplyFilters={applyFilters}
          onToggleExpanded={toggleExpanded}
          onSearch={setQuery}
        />
      </div>
    </div>
  );
}
