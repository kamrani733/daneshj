'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useState, type ComponentType } from 'react';

import { AppDialog } from '@/components/ui/app-dialog';
import { cn } from '@/lib/utils';

export type PanelNavItem = {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Omitted → shown disabled (the destination is not built yet). */
  href?: string;
  /** Defaults to `href` itself or any path below it. */
  match?: (pathname: string) => boolean;
};

export type PanelNavProps = {
  items: PanelNavItem[];
  /** Accessible name of the `<nav>`. */
  label: string;
  /** Phone trigger text that opens the menu sheet, e.g. «منوی پنل عملیاتی». */
  menuLabel: string;
  /** Tablet sidebar (720–999 px) drops icons and dividers (operational panel export). */
  compactOnTablet?: boolean;
  /** Phone trigger: centred label without the chevron (operational panel export). */
  centeredMenuTrigger?: boolean;
};

function isActive(item: PanelNavItem, pathname: string) {
  if (!item.href) return false;
  if (item.match) return item.match(pathname);
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Panel navigation: phone menu sheet + sidebar from 720 px (notifications, operational panel). */
export function PanelNav({
  items,
  label,
  menuLabel,
  compactOnTablet = false,
  centeredMenuTrigger = false,
}: PanelNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-full min-[720px]:hidden">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={cn(
            'flex w-full items-center gap-3 rounded-medium border border-outline-variant px-4 font-medium text-on-surface-variant transition-colors',
            centeredMenuTrigger
              ? 'h-14 justify-center bg-surface-container-low hover:bg-surface-container'
              : 'h-12 justify-between bg-surface-container-lowest shadow-app-elevation-1 hover:bg-surface-container-low'
          )}
        >
          {/* Type token outside `cn()`: tailwind-merge reads custom sizes as colours. */}
          <span className={centeredMenuTrigger ? 'text-body-large' : 'text-label-large'}>{menuLabel}</span>
          {centeredMenuTrigger ? null : (
            <ChevronDown className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
          )}
        </button>

        <AppDialog
          open={open}
          onOpenChange={setOpen}
          variant="sheet"
          title={menuLabel}
          className="gap-0 rounded-t-2xl bg-popover p-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <PanelNavList
            items={items}
            label={label}
            variant="sheet"
            onNavigate={() => setOpen(false)}
            className="px-1 pb-2"
          />
        </AppDialog>
      </div>

      {/* Sticky under the sticky site header (48 px, 88 px from lg) while the content scrolls. */}
      <aside
        className={cn(
          'hidden shrink-0 rounded-small bg-background p-3 shadow-app-elevation-1 min-[720px]:sticky min-[720px]:top-16 min-[720px]:block lg:top-28',
          compactOnTablet ? 'min-[720px]:w-56' : 'min-[720px]:w-65',
          'min-[1000px]:w-75 min-[1200px]:w-90'
        )}
      >
        <PanelNavList items={items} label={label} compact={compactOnTablet} />
      </aside>
    </>
  );
}

type PanelNavListProps = {
  items: PanelNavItem[];
  label: string;
  onNavigate?: () => void;
  className?: string;
  variant?: 'sidebar' | 'sheet';
  compact?: boolean;
};

function PanelNavList({
  items,
  label,
  onNavigate,
  className,
  variant = 'sidebar',
  compact = false,
}: PanelNavListProps) {
  const pathname = usePathname();
  const hideOnTablet = compact && variant === 'sidebar';

  return (
    <nav aria-label={label} className={cn('flex w-full flex-col', className)}>
      <ul className="flex w-full flex-col text-label-large">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item, pathname);
          const rowClassName = cn(
            'flex min-h-14 w-full items-center gap-3 py-2 text-start',
            variant === 'sheet' ? 'px-5' : 'px-4',
            active
              ? 'rounded-s-small border-s-2 border-primary bg-primary-container font-bold text-primary'
              : 'font-medium text-on-surface-variant'
          );
          const content = (
            <>
              <Icon
                className={cn(
                  'size-6 shrink-0 stroke-[1.5]',
                  hideOnTablet && 'hidden min-[1000px]:block'
                )}
              />
              <span>{item.label}</span>
            </>
          );

          return (
            <li key={item.key} className="flex w-full flex-col">
              {index > 0 ? (
                <div
                  aria-hidden
                  className={cn(
                    'h-px bg-outline-variant',
                    variant === 'sheet' ? 'mx-5' : 'mx-4',
                    hideOnTablet && 'hidden min-[1000px]:block'
                  )}
                />
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={onNavigate}
                  className={cn(
                    rowClassName,
                    !active && 'hover:bg-on-surface/5',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
                  )}
                >
                  {content}
                </Link>
              ) : (
                <span aria-disabled="true" className={cn(rowClassName, 'opacity-50')}>
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
