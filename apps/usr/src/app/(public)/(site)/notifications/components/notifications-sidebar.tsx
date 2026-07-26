'use client';

import { cn } from '@/lib/utils';

import { NotificationsNavList } from './notifications-nav-list';

/** Figma Navigation Drawer #2392:4854 — desktop/tablet sidebar. */
export function NotificationsSidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'hidden w-full shrink-0 rounded-lg border border-green-400/60 bg-white p-3 dark:border-border dark:bg-home-search-category',
        'shadow-[-3px_3px_8px_0_rgba(0,0,0,0.1),1px_0_8px_-2px_rgba(0,0,0,0.1)]',
        'min-[720px]:block min-[720px]:w-[260px] min-[1000px]:w-[300px] min-[1200px]:w-[360px]',
        className
      )}
    >
      <NotificationsNavList />
    </aside>
  );
}
