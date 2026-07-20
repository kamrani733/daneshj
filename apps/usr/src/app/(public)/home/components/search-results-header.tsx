'use client';

import { useTranslations } from 'next-intl';

import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import type { SearchCategoryChip } from '../lib/search-category-chips';
import { SearchFilterChip } from './search-filter-chip';

type SearchResultsHeaderProps = {
  count: number;
  chips: SearchCategoryChip[] | null;
  chipId: string;
  onChipSelect: (id: string) => void;
  className?: string;
};

/**
 * Figma Head content #1:10021 / #1:13286
 * Count («N تخفیف فعال») → Sub Category filter chips (gap 24).
 */
export function SearchResultsHeader({
  count,
  chips,
  chipId,
  onChipSelect,
  className,
}: SearchResultsHeaderProps) {
  const t = useTranslations('home.searchResults');

  return (
    <header
      className={cn('flex w-full flex-col items-end gap-6', className)}
    >
      {/* Count — h 32 · pad 4 0 · M3/title/medium #404943 */}
      <div className="flex h-8 w-full items-stretch justify-center py-1">
        <p
          dir="rtl"
          className="w-full self-stretch text-right text-base font-medium leading-6 tracking-[0.0094em] text-home-filter-muted"
        >
          {t('count', { count: formatFaNumber(count) })}
        </p>
      </div>

      {/* Sub Category — LTR row · gap 24 · justify-end → همه on the right */}
      {chips ? (
        <div
          dir="ltr"
          className="flex flex-wrap items-center justify-end gap-6"
          role="group"
          aria-label={t('title')}
        >
          {chips.map((chip) => (
            <SearchFilterChip
              key={chip.id}
              label={chip.id === 'all' ? t('allChip') : chip.label}
              selected={chipId === chip.id}
              onSelect={() => onChipSelect(chip.id)}
            />
          ))}
        </div>
      ) : null}
    </header>
  );
}
