'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { NOTIFICATIONS_NAV_ITEMS } from './notifications-nav-items';

type NotificationsNavListProps = {
  onNavigate?: () => void;
  className?: string;
  /** denser list for bottom sheet */
  variant?: 'sidebar' | 'sheet';
};

export function NotificationsNavList({
  onNavigate,
  className,
  variant = 'sidebar',
}: NotificationsNavListProps) {
  const t = useTranslations('notifications.sidebar');
  const pathname = usePathname();

  return (
    <nav aria-label={t('navLabel')} className={cn('flex w-full flex-col', className)}>
      {NOTIFICATIONS_NAV_ITEMS.map((item, index) => {
        const Icon = item.icon;
        const active = item.match(pathname);
        return (
          <div key={item.key} className="flex w-full flex-col">
            {index > 0 ? (
              <div
                aria-hidden
                className={cn(
                  'h-px bg-green-400/50',
                  variant === 'sheet' ? 'mx-5' : 'mx-4'
                )}
              />
            ) : null}
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              onClick={onNavigate}
              className={cn(
                'flex h-14 w-full items-center gap-3 text-sm leading-5 tracking-[0.0071em]',
                variant === 'sheet' ? 'px-5' : 'px-4',
                active
                  ? 'rounded-e-[50px] rounded-s-lg border-s-[2px] border-primary bg-primary-subtle font-bold text-primary'
                  : 'font-medium text-green-700 hover:bg-black/5'
              )}
            >
              <Icon className="size-6 shrink-0" strokeWidth={1.5} aria-hidden />
              <span>{t(item.key)}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
