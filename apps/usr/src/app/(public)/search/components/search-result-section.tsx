'use client';

import { useTranslations } from 'next-intl';
import { useId, type ReactNode } from 'react';

import { FilterAltIcon } from '@/components/icons/material-icons';
import { Button } from '@/components/ui/button';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import {
  SEARCH_PREVIEW_SIZE,
  SEARCH_PREVIEW_SIZE_PHONE,
} from '@search/utils/search-params';

type SearchResultSectionProps = {
  /** DOM id — the page scrolls here after a filter is applied. */
  id: string;
  title: string;
  total: number;
  expanded: boolean;
  onToggleExpanded: () => void;
  /** Rendered under the header while «فیلتر ها» is open. */
  filterPanel: ReactNode;
  filterOpen: boolean;
  onFilterToggle: () => void;
  children: ReactNode;
};

/**
 * One result group: bordered header (title + count, «فیلتر ها»), filter panel inside the same box,
 * card grid (1 / 2 / 3 columns). Preview: 4 cards on phones, 9 from 640 px; «مشاهده همه / کمتر»
 * when there are more.
 */
export function SearchResultSection({
  id,
  title,
  total,
  expanded,
  onToggleExpanded,
  filterPanel,
  filterOpen,
  onFilterToggle,
  children,
}: SearchResultSectionProps) {
  const t = useTranslations('search');
  const headingId = useId();
  const panelId = useId();
  const isEmpty = total === 0;
  const count = t('sectionCount', { title, count: formatFaNumber(total) });

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      // Sticky header: 48 px on phones/tablets, 88 px from lg.
      className="flex scroll-mt-16 flex-col gap-4 lg:scroll-mt-28"
    >
      <div className="rounded-medium border border-outline-variant bg-surface-container-low">
        <div className="flex min-h-15 items-center gap-6 px-4 py-2 min-[640px]:min-h-18">
          <h2
            id={headingId}
            className="text-title-small font-bold text-primary"
          >
            {isEmpty ? (
              <>
                {/* Figma: «(۰)» on phones, «(نتیجه ای یافت نشد)» from tablet up. */}
                <span className="min-[640px]:hidden">{count}</span>
                <span className="hidden min-[640px]:inline">
                  {t('sectionEmpty', { title })}
                </span>
              </>
            ) : (
              count
            )}
          </h2>
          <Button
            type="button"
            variant="toolbar"
            size="sm"
            aria-expanded={filterOpen}
            aria-controls={filterOpen ? panelId : undefined}
            onClick={onFilterToggle}
            // Figma: closed = regular on-surface-variant, open = medium on-surface.
            className={cn(
              'gap-1 rounded-full px-2',
              filterOpen
                ? 'font-medium text-on-surface'
                : 'font-normal text-on-surface-variant',
            )}
          >
            <FilterAltIcon size={20} />
            <span className="text-label-large">{t('filters')}</span>
          </Button>
        </div>
        {filterOpen ? <div id={panelId}>{filterPanel}</div> : null}
      </div>

      {isEmpty ? null : (
        <div
          className={cn(
            'grid grid-cols-1 gap-3 min-[640px]:grid-cols-2 min-[640px]:gap-4 min-[1024px]:grid-cols-3 min-[1024px]:gap-6',
            // Phones preview the first 4 cards (SEARCH_PREVIEW_SIZE_PHONE) of the 9 the API returns.
            !expanded && 'max-[639px]:[&>*:nth-child(n+5)]:hidden',
          )}
        >
          {children}
        </div>
      )}

      {total > SEARCH_PREVIEW_SIZE_PHONE ? (
        <Button
          type="button"
          variant="link"
          size="none"
          aria-expanded={expanded}
          onClick={onToggleExpanded}
          className={cn(
            'self-end font-bold text-secondary',
            // 5–9 results fit the 9-card preview from 640 px: no toggle there.
            total <= SEARCH_PREVIEW_SIZE && 'min-[640px]:hidden',
          )}
        >
          <span className="text-label-large">
            {expanded ? t('showLess') : t('showAll')}
          </span>
        </Button>
      ) : null}
    </section>
  );
}
