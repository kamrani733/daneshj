'use client';

import Link from 'next/link';
import { Mail, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { FilterAltIcon } from '@/components/icons/material-icons';
import type { NotificationsFilterValues } from '@notifications/types/filters';
import { SETTINGS_PATH } from '@notifications/data/settings-mock';
import { Button } from '@/components/ui/button';
import { SearchField } from '@/components/ui/search-field';
import { cn } from '@/lib/utils';

import { NotificationsFilterPanel } from './filter-panel';

type NotificationsToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  filters: NotificationsFilterValues;
  onApplyFilters: (filters: NotificationsFilterValues) => void;
  onClearFilters: () => void;
};

/**
 * Figma #113:1669 / Notification filter — RTL toolbar expands downward for filters.
 * Desktop: search · mail / settings / filter. Mobile: search stacked above icons.
 */
export function NotificationsToolbar({
  query,
  onQueryChange,
  filters,
  onApplyFilters,
  onClearFilters,
}: NotificationsToolbarProps) {
  const t = useTranslations('notifications.toolbar');
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div
      className={cn(
        'flex w-full flex-col rounded-xl border border-border bg-home-search-fill',
        panelOpen && 'z-[60]'
      )}
    >
      <div className="flex w-full flex-col gap-3 px-4 py-2 min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between min-[720px]:gap-4">
        <SearchField
          label={t('search')}
          size="lg"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t('search')}
          containerClassName="min-[720px]:max-w-[420px]"
        />

        <div className="flex shrink-0 items-center justify-end gap-3">
          <ToolbarAction label={t('mail')}>
            <Mail className="size-6" strokeWidth={1.5} />
          </ToolbarAction>
          <ToolbarAction label={t('settings')} href={SETTINGS_PATH}>
            <Settings className="size-6" strokeWidth={1.5} />
          </ToolbarAction>
          <ToolbarAction
            label={t('filter')}
            active={panelOpen}
            aria-expanded={panelOpen}
            onClick={() => setPanelOpen((open) => !open)}
          >
            <FilterAltIcon size={24} />
          </ToolbarAction>
        </div>
      </div>

      {panelOpen ? (
        <NotificationsFilterPanel
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

function ToolbarAction({
  label,
  href,
  children,
  active,
  onClick,
  'aria-expanded': ariaExpanded,
}: {
  label: string;
  href?: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  'aria-expanded'?: boolean;
}) {
  const className = cn(
    'size-11 rounded-full text-content hover:bg-black/5 dark:hover:bg-white/5',
    active && 'bg-black/5 dark:bg-white/10'
  );

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
      aria-expanded={ariaExpanded}
      aria-pressed={active}
      onClick={onClick}
      className={className}
    >
      {children}
    </Button>
  );
}
