'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import {
  countUnreadNotifications,
  MOCK_NOTIFICATION_RECORDS,
  type NotificationRecord,
} from '@/app/(public)/home/data/notifications-mock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { NotificationsPageHeading } from './notifications-page-heading';
import { NotificationsPagination } from './notifications-pagination';
import { NotificationsSidebar } from './notifications-sidebar';
import { NotificationsTable } from './notifications-table';
import { NotificationsToolbar } from './notifications-toolbar';

const PAGE_SIZE = 12;
/** Mock — backend paging not wired yet; design shows 25 pages. */
const TOTAL_PAGES = 25;

type NotificationTab = NotificationRecord['kind'];
const TABS: NotificationTab[] = ['manual', 'system'];

type NotificationsPageViewProps = {
  initialItems?: NotificationRecord[];
};

/** Figma Notifications #2392:4782 — title · sidebar (right) · panel (tabs / toolbar / table / pager). */
export function NotificationsPageView({
  initialItems = MOCK_NOTIFICATION_RECORDS,
}: NotificationsPageViewProps) {
  const t = useTranslations('notifications');
  const [tab, setTab] = useState<NotificationTab>('manual');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim();
    return initialItems.filter(
      (item) =>
        item.kind === tab &&
        (!q ||
          [item.subject, item.body, item.mainCategory, item.subCategory].some(
            (value) => value.includes(q)
          ))
    );
  }, [initialItems, query, tab]);

  const pageItems = filtered.slice(0, PAGE_SIZE);
  const hasUnreadManual =
    countUnreadNotifications(
      initialItems.filter((item) => item.kind === 'manual')
    ) > 0;

  return (
    <div className="mx-auto flex w-full max-w-[1364px] flex-col gap-6 px-4 py-4 min-[1200px]:px-0">
      <NotificationsPageHeading />

      <div className="flex w-full flex-col gap-6 min-[720px]:flex-row min-[720px]:items-start min-[720px]:gap-6 min-[1200px]:gap-[70px]">
        <NotificationsSidebar />

        <section className="flex min-w-0 flex-1 flex-col gap-6 rounded-2xl bg-home-search-fill p-4">
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value as NotificationTab);
              setPage(1);
            }}
            className="items-stretch gap-6"
          >
            <TabsList className="h-12 w-auto justify-start gap-0 self-start rounded-none bg-transparent p-0">
              <NotificationsTabTrigger value="manual" showUnreadDot={hasUnreadManual}>
                {t('tabs.manual')}
              </NotificationsTabTrigger>
              <NotificationsTabTrigger value="system">
                {t('tabs.system')}
              </NotificationsTabTrigger>
            </TabsList>

            {TABS.map((value) => (
              <TabsContent
                key={value}
                value={value}
                className="mt-0 flex w-full flex-col gap-2"
              >
                <NotificationsToolbar
                  query={query}
                  onQueryChange={(next) => {
                    setQuery(next);
                    setPage(1);
                  }}
                />
                <NotificationsTable items={pageItems} />
                <NotificationsPagination
                  page={page}
                  totalPages={TOTAL_PAGES}
                  onPageChange={setPage}
                />
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </div>
    </div>
  );
}

/** Figma Tab — 12×16 padding, green 2px indicator, red unread badge. */
function NotificationsTabTrigger({
  value,
  children,
  showUnreadDot,
}: {
  value: NotificationTab;
  children: ReactNode;
  showUnreadDot?: boolean;
}) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        'h-full gap-2 rounded-none border-0 border-b border-green-400 px-4 py-3 text-sm font-medium leading-5 tracking-[0.0071em] text-green-700 shadow-none',
        'hover:text-green-700 focus-visible:ring-0',
        'data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:font-bold data-[state=active]:text-foreground'
      )}
    >
      {children}
      {showUnreadDot ? (
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-error-600" />
      ) : null}
    </TabsTrigger>
  );
}
