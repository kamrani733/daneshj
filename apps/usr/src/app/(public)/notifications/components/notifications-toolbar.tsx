'use client';

import { Mail, Search, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FilterAltIcon } from '@/app/(public)/home/components/material-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type NotificationsToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

/**
 * Figma Notifications Filter #2392:4487 —
 * LTR bar: search (left) · mail / settings / filter (right).
 */
export function NotificationsToolbar({
  query,
  onQueryChange,
}: NotificationsToolbarProps) {
  const t = useTranslations('notifications.toolbar');

  return (
    <div
      dir="ltr"
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-green-400 bg-home-header px-4 py-2"
    >
      <label className="relative block h-14 w-full max-w-[420px]" dir="rtl">
        <span className="sr-only">{t('search')}</span>
        <Search
          className="pointer-events-none absolute right-3 top-1/2 size-6 -translate-y-1/2 text-green-700"
          strokeWidth={1.5}
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t('search')}
          className="h-14 rounded-full border-0 bg-home-filter-search pe-4 ps-4 text-base text-green-700 shadow-none placeholder:text-green-700 focus-visible:ring-1 focus-visible:ring-content-subtle text-right"
          style={{ paddingRight: '3rem' }}
        />
      </label>

      <div className="flex shrink-0 items-center gap-4">
        <ToolbarAction label={t('mail')}>
          <Mail className="size-6" strokeWidth={1.5} />
        </ToolbarAction>
        <ToolbarAction label={t('settings')}>
          <Settings className="size-6" strokeWidth={1.5} />
        </ToolbarAction>
        <ToolbarAction label={t('filter')}>
          <FilterAltIcon size={24} />
        </ToolbarAction>
      </div>
    </div>
  );
}

function ToolbarAction({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      className="size-14 rounded-full text-green-700 hover:bg-black/5"
    >
      {children}
    </Button>
  );
}
