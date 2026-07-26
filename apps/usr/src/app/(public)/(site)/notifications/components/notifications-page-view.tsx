'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import {
  useMarkNotificationAsReadMutation,
  useNotificationsListInfiniteQuery,
  type NotificationItem,
  type NotificationType,
} from '@notifications/api';
import type { NotificationRecord } from '@home/data/notifications-mock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { NotificationsCardList } from './notifications-card-list';
import { NotificationsPageHeading } from './notifications-page-heading';
import { NotificationsSidebar } from './notifications-sidebar';
import { NotificationsToolbar } from './notifications-toolbar';

type NotificationTab = NotificationType;
const TABS: NotificationTab[] = ['manual', 'system'];

type NotificationsPageViewProps = {
  accessToken?: string | null;
};

function toRecord(item: NotificationItem): NotificationRecord {
  return {
    id: item.id,
    subject: item.subject,
    body: item.body,
    date: item.date,
    time: item.time,
    status: item.status,
    kind: item.kind,
    mainCategory: item.mainCategory,
    subCategory: item.subCategory,
    link: item.link,
    readDate: item.status === 'read' ? item.date || null : null,
    readTime: item.status === 'read' ? item.time || null : null,
  };
}

/** Figma Notifications #2419:2680 — card list, tabs, load more. */
export function NotificationsPageView({
  accessToken,
}: NotificationsPageViewProps) {
  const t = useTranslations('notifications');
  const [tab, setTab] = useState<NotificationTab>('manual');
  const [query, setQuery] = useState('');

  const listQuery = useNotificationsListInfiniteQuery({
    accessToken,
    type: tab,
    search: query.trim() || undefined,
    ordering: '-created_at',
  });
  const markOne = useMarkNotificationAsReadMutation();

  const pageItems = (listQuery.data?.pages ?? []).flatMap((page) =>
    page.items.map(toRecord)
  );
  const hasUnreadManual =
    (listQuery.data?.pages[0]?.unreadCounts.manual ?? 0) > 0;
  const canLoadMore = !!listQuery.hasNextPage;

  async function handleRowSelect(item: NotificationRecord) {
    if (item.status !== 'unread') return;
    await markOne.mutateAsync({
      accessToken: accessToken ?? '',
      sentNotificationId: item.id,
    });
  }

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
              setQuery('');
            }}
            className="items-stretch gap-4"
          >
            <TabsList className="h-auto w-full justify-start gap-0 self-stretch rounded-none border-b border-border bg-transparent p-0">
              <NotificationsTabTrigger
                value="manual"
                showUnreadDot={hasUnreadManual}
              >
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
                className="mt-0 flex w-full flex-col gap-3"
              >
                <NotificationsToolbar
                  query={query}
                  onQueryChange={setQuery}
                />
                <NotificationsCardList
                  items={pageItems}
                  onItemSelect={handleRowSelect}
                />
                {canLoadMore ? (
                  <button
                    type="button"
                    onClick={() => listQuery.fetchNextPage()}
                    disabled={listQuery.isFetchingNextPage}
                    className="self-start text-sm font-medium leading-5 text-primary transition-opacity hover:opacity-80 disabled:opacity-50"
                  >
                    {t('loadMore')}
                  </button>
                ) : null}
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </div>
    </div>
  );
}

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
        'h-auto gap-2 rounded-none border-0 border-b-2 border-transparent px-4 py-3 text-sm font-medium leading-5 tracking-[0.0071em] text-neutral-600 shadow-none',
        'hover:text-content focus-visible:ring-0',
        'data-[state=active]:border-b-primary data-[state=active]:font-bold data-[state=active]:text-content'
      )}
    >
      {showUnreadDot ? (
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-error-600" />
      ) : null}
      {children}
    </TabsTrigger>
  );
}
