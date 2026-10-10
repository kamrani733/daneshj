'use client';

import { useId, type ReactNode } from 'react';

import { FilterAltIcon } from '@/components/icons/material-icons';
import { SearchField } from '@/components/ui/search-field';
import { SortMenu, type SortMenuOption } from '@/components/ui/sort-menu';
import { cn } from '@/lib/utils';

type ReportToolbarProps<Sort extends string> = {
  /** Omitted on filter-only bars (operational panel «آمار»). */
  search?: {
    value: string;
    onChange: (value: string) => void;
    /** Accessible label and placeholder, e.g. «جستجو». */
    label: string;
    maxLength?: number;
  };
  sort?: {
    label: string;
    value: Sort;
    options: SortMenuOption<Sort>[];
    onChange: (value: Sort) => void;
  };
  filter?: {
    label: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Rendered under the toolbar row while open. */
    panel: ReactNode;
  };
};

/**
 * Report toolbar — Figma: sort + filters at the start, pill search at the end; labels show once the
 * toolbar is ≥ 720 px wide (icons only in the tablet frame). Filters expand inside the toolbar.
 */
export function ReportToolbar<Sort extends string>({ search, sort, filter }: ReportToolbarProps<Sort>) {
  const panelId = useId();

  return (
    <div className="@container flex w-full flex-col rounded-medium border border-outline-variant bg-surface">
      <div className="flex min-h-18 flex-col-reverse justify-center gap-2 px-3 py-2 @min-[480px]:flex-row @min-[480px]:items-center @min-[480px]:justify-between @min-[480px]:px-4">
        <div className="flex shrink-0 items-center gap-1 @min-[720px]:gap-2">
          {sort ? (
            <SortMenu
              trigger="toolbar"
              label={sort.label}
              value={sort.value}
              options={sort.options}
              onChange={sort.onChange}
            />
          ) : null}
          {filter ? (
            <button
              type="button"
              aria-label={filter.label}
              aria-expanded={filter.open}
              aria-controls={panelId}
              onClick={() => filter.onOpenChange(!filter.open)}
              className={cn(
                'inline-flex h-12 min-w-12 shrink-0 items-center justify-center gap-2 rounded-full px-3 font-medium text-on-surface-variant',
                'hover:bg-on-surface/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                filter.open && 'bg-on-surface/10'
              )}
            >
              <FilterAltIcon size={24} />
              <span className="hidden text-title-medium @min-[720px]:inline">{filter.label}</span>
            </button>
          ) : null}
        </div>

        {search ? (
          <SearchField
            label={search.label}
            placeholder={search.label}
            variant="surface"
            size="xl"
            value={search.value}
            maxLength={search.maxLength}
            onChange={(event) => search.onChange(event.target.value)}
            containerClassName="@min-[480px]:max-w-105"
          />
        ) : null}
      </div>

      {filter?.open ? (
        <div id={panelId} className="border-t border-outline-variant">
          {filter.panel}
        </div>
      ) : null}
    </div>
  );
}
