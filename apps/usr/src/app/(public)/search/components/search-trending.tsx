'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { formatFaNumber } from '@/lib/format-fa';

import { useTrendingSearches } from '@search/hooks/use-search-queries';

type SearchTrendingProps = {
  /** Runs a search for the picked query. */
  onSelect: (query: string) => void;
};

/**
 * Figma no-result frame — «پرجستجوترین‌های هفته:» box with the week's top queries.
 * Hidden while loading or when the list is empty (it is a suggestion, not core content).
 */
export function SearchTrending({ onSelect }: SearchTrendingProps) {
  const t = useTranslations('search.trending');
  const headingId = useId();
  const { data } = useTrendingSearches();

  if (!data || data.length === 0) return null;

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-5 rounded-large bg-featured-container px-4 pb-5 pt-4"
    >
      <h2
        id={headingId}
        className="text-title-small font-bold text-on-surface-variant"
      >
        {t('title')}
      </h2>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {data.map((item) => (
          <li key={item.query}>
            <button
              type="button"
              onClick={() => onSelect(item.query)}
              className="rounded-small px-2 py-1 text-body-medium text-on-surface-variant transition-colors hover:bg-on-surface/8 hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {t('item', {
                query: item.query,
                count: formatFaNumber(item.count),
              })}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
