'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FilterAltIcon, SortIcon } from '@home/components/material-icons';
import type {
  ReportChannel,
  ReportOrdering,
  ReportPriority,
  ReportReadStatus,
} from '@notifications/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const ORDERING_OPTIONS: ReportOrdering[] = [
  '-sent_at',
  'sent_at',
  '-priority',
  'priority',
  '-status',
  'status',
  '-main_category',
  'main_category',
  '-sub_category',
  'sub_category',
];

const PRIORITY_OPTIONS: Array<ReportPriority | 'all'> = [
  'all',
  'high',
  'medium',
  'low',
];
const STATUS_OPTIONS: Array<ReportReadStatus | 'all'> = [
  'all',
  'unread',
  'read',
];
const CHANNEL_OPTIONS: Array<ReportChannel | 'all'> = [
  'all',
  'site',
  'email',
  'sms',
  'telegram',
  'whatsapp',
];

export type ReportsFilters = {
  priority?: ReportPriority;
  status?: ReportReadStatus;
  channel?: ReportChannel;
};

type ReportsToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  ordering: ReportOrdering;
  onOrderingChange: (value: ReportOrdering) => void;
  filters: ReportsFilters;
  onFiltersChange: (value: ReportsFilters) => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
};

export function ReportsToolbar({
  query,
  onQueryChange,
  ordering,
  onOrderingChange,
  filters,
  onFiltersChange,
  filterOpen,
  onFilterOpenChange,
}: ReportsToolbarProps) {
  const t = useTranslations('notifications.reports');

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full items-center gap-2 min-[720px]:gap-3">
        <label className="relative block h-11 min-w-0 flex-1 min-[720px]:h-12">
          <span className="sr-only">{t('search')}</span>
          <Search
            className="pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2 text-neutral-600"
            strokeWidth={1.5}
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t('search')}
            className="h-full rounded-full border-0 bg-home-search-fill pe-10 ps-4 text-sm text-content shadow-none placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-content-subtle min-[720px]:text-base"
          />
        </label>

        <div className="flex shrink-0 items-center gap-1.5 min-[720px]:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onFilterOpenChange(true)}
            className="size-11 rounded-xl border-border bg-white px-0 text-content hover:bg-home-search-fill min-[720px]:h-11 min-[720px]:w-auto min-[720px]:gap-2 min-[720px]:px-4"
          >
            <FilterAltIcon size={22} />
            <span className="hidden text-sm font-medium min-[720px]:inline">
              {t('filters')}
            </span>
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="size-11 rounded-xl border-border bg-white px-0 text-content hover:bg-home-search-fill min-[720px]:h-11 min-[720px]:w-auto min-[720px]:gap-2 min-[720px]:px-4"
              >
                <SortIcon size={22} />
                <span className="hidden text-sm font-medium min-[720px]:inline">
                  {t('sort')}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-2">
              <ul className="flex flex-col">
                {ORDERING_OPTIONS.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => onOrderingChange(option)}
                      className={cn(
                        'flex w-full items-center rounded-md px-3 py-2 text-start text-sm',
                        ordering === option
                          ? 'bg-primary-subtle font-bold text-primary'
                          : 'text-content hover:bg-black/5'
                      )}
                    >
                      {t(`ordering.${option}`)}
                    </button>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Dialog open={filterOpen} onOpenChange={onFilterOpenChange}>
        <DialogContent className="max-w-md gap-4">
          <DialogHeader>
            <DialogTitle>{t('filters')}</DialogTitle>
          </DialogHeader>

          <FilterFieldset
            label={t('columns.priority')}
            value={filters.priority ?? 'all'}
            options={PRIORITY_OPTIONS}
            getLabel={(value) => t(`priority.${value}`)}
            onChange={(value) =>
              onFiltersChange({
                ...filters,
                priority: value === 'all' ? undefined : value,
              })
            }
          />
          <FilterFieldset
            label={t('columns.status')}
            value={filters.status ?? 'all'}
            options={STATUS_OPTIONS}
            getLabel={(value) => t(`status.${value}`)}
            onChange={(value) =>
              onFiltersChange({
                ...filters,
                status: value === 'all' ? undefined : value,
              })
            }
          />
          <FilterFieldset
            label={t('columns.channel')}
            value={filters.channel ?? 'all'}
            options={CHANNEL_OPTIONS}
            getLabel={(value) => t(`channel.${value}`)}
            onChange={(value) =>
              onFiltersChange({
                ...filters,
                channel: value === 'all' ? undefined : value,
              })
            }
          />

          <DialogFooter className="border-0 bg-transparent sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onFiltersChange({})}
            >
              {t('clearFilters')}
            </Button>
            <Button type="button" onClick={() => onFilterOpenChange(false)}>
              {t('applyFilters')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterFieldset<T extends string>({
  label,
  value,
  options,
  getLabel,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  getLabel: (value: T) => string;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-content">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={value === option ? 'default' : 'outline'}
            onClick={() => onChange(option)}
            className="rounded-full"
          >
            {getLabel(option)}
          </Button>
        ))}
      </div>
    </fieldset>
  );
}
