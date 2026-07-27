'use client';

import Link from 'next/link';
import { Mail, Search, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FilterAltIcon } from '@home/components/material-icons';
import { SETTINGS_PATH } from '@notifications/data/settings-mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type NotificationsToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

/**
 * Figma #2419:2680 — RTL toolbar: search (start) · mail / settings / filter (end).
 */
export function NotificationsToolbar({
  query,
  onQueryChange,
}: NotificationsToolbarProps) {
  const t = useTranslations('notifications.toolbar');

  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-white px-4 py-2 dark:bg-home-search-category">
      <label className="relative block h-12 w-full max-w-[420px]">
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
          className="h-12 rounded-full border-0 bg-home-search-fill pe-10 ps-4 text-base text-content shadow-none placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-content-subtle"
        />
      </label>

      <div className="flex shrink-0 items-center gap-3">
        <ToolbarAction label={t('mail')}>
          <Mail className="size-6" strokeWidth={1.5} />
        </ToolbarAction>
        <ToolbarAction label={t('settings')} href={SETTINGS_PATH}>
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
  href,
  children,
}: {
  label: string;
  href?: string;
  children: React.ReactNode;
}) {
  const className =
    'size-11 rounded-full text-content hover:bg-black/5 dark:hover:bg-white/5';

  if (href) {
    return (
      <Button asChild variant="ghost" size="icon" className={className}>
        <Link href={href} aria-label={label}>
          {children}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      className={className}
    >
      {children}
    </Button>
  );
}
