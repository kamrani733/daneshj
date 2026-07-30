'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
  CheckIcon,
  FilterAltIcon,
  SortIcon,
} from '@/components/icons/material-icons';
import type { ReportOrdering } from '@notifications/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import {
  EMPTY_REPORTS_FILTERS,
  ReportsFilterPanel,
  type ReportsFilterValues,
} from './reports-filter-panel';

/** Figma sort menu — one preferred direction per field (API Usr-Ntf-6N5 ordering). */
const ORDERING_OPTIONS: Array<{
  value: ReportOrdering;
  labelKey: string;
}> = [
  { value: '-sent_at', labelKey: 'sentNewest' },
  { value: 'main_category', labelKey: 'mainCategory' },
  { value: 'sub_category', labelKey: 'subCategory' },
  { value: '-priority', labelKey: 'priorityHighest' },
  { value: 'status', labelKey: 'status' },
];

type ReportsToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  ordering: ReportOrdering;
  onOrderingChange: (value: ReportOrdering) => void;
  filters: ReportsFilterValues;
  onApplyFilters: (filters: ReportsFilterValues) => void;
  onClearFilters: () => void;
};

/**
 * Figma گزارشات — فیلترها و مرتب‌سازی (desktop labels · mobile icons).
 * Expands downward for filter fields; sort opens a checked menu.
 */
export function ReportsToolbar({
  query,
  onQueryChange,
  ordering,
  onOrderingChange,
  filters,
  onApplyFilters,
  onClearFilters,
}: ReportsToolbarProps) {
  const t = useTranslations('notifications.reports');
  const [panelOpen, setPanelOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div
      className={cn(
        'flex w-full flex-col rounded-xl border border-border bg-home-search-fill',
        panelOpen && 'z-[60]'
      )}
    >
      <div className="flex w-full flex-col gap-3 px-4 py-3 min-[834px]:flex-row min-[834px]:items-center min-[834px]:justify-between min-[834px]:gap-4">
        <label className="relative block h-11 w-full min-[834px]:h-12 min-[834px]:max-w-[360px]">
          <span className="sr-only">{t('search')}</span>
          <Search
            className="pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2 text-neutral-600 dark:text-home-filter-muted"
            strokeWidth={1.5}
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t('search')}
            className="h-full rounded-full border-0 bg-white pe-10 ps-4 text-sm text-content shadow-none placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-content-subtle dark:bg-home-search-category dark:placeholder:text-home-filter-muted min-[834px]:text-base"
          />
        </label>

        <div className="flex shrink-0 items-center justify-end gap-1 min-[834px]:gap-2">
          <Button
            type="button"
            variant="ghost"
            aria-expanded={panelOpen}
            aria-pressed={panelOpen}
            onClick={() => {
              setPanelOpen((open) => !open);
              setSortOpen(false);
            }}
            className={cn(
              'h-11 gap-2 rounded-full px-3 text-content hover:bg-black/5 dark:hover:bg-white/5',
              panelOpen && 'bg-black/5 dark:bg-white/10'
            )}
          >
            <FilterAltIcon size={22} />
            <span className="hidden text-sm font-medium min-[834px]:inline">
              {t('filters')}
            </span>
          </Button>

          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                aria-expanded={sortOpen}
                className={cn(
                  'h-11 gap-2 rounded-full px-3 text-content hover:bg-black/5 dark:hover:bg-white/5',
                  sortOpen && 'bg-black/5 dark:bg-white/10'
                )}
              >
                <SortIcon size={22} />
                <span className="hidden text-sm font-medium min-[834px]:inline">
                  {t('sort')}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={6}
              className="w-[280px] gap-0 rounded border-0 bg-home-search-category p-0 py-2 shadow-home-elevation-2 ring-0"
            >
              <ul role="menu" dir="rtl" aria-label={t('sort')} className="flex flex-col">
                {ORDERING_OPTIONS.map((option) => {
                  const selected = ordering === option.value;
                  return (
                    <li key={option.value} role="none">
                      <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={selected}
                        onClick={() => {
                          onOrderingChange(option.value);
                          setSortOpen(false);
                        }}
                        className={cn(
                          'flex h-12 w-full items-center gap-2 px-3 text-start text-sm font-medium leading-5',
                          selected
                            ? 'bg-primary-50 text-content dark:bg-primary-subtle'
                            : 'text-content hover:bg-black/[0.04] dark:hover:bg-white/5'
                        )}
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center">
                          {selected ? (
                            <CheckIcon className="text-primary" size={20} />
                          ) : null}
                        </span>
                        <span className="min-w-0 flex-1 text-right">
                          {t(`orderingMenu.${option.labelKey}`)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {panelOpen ? (
        <ReportsFilterPanel
          filters={filters}
          onApply={(next) => {
            onApplyFilters(next);
            setPanelOpen(false);
          }}
          onClear={() => {
            onClearFilters();
          }}
        />
      ) : null}
    </div>
  );
}

export type { ReportsFilterValues };
export { EMPTY_REPORTS_FILTERS };
