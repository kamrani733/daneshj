'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import {
  useMarkNotificationAsReadMutation,
  useNotificationsListQuery,
  type NotificationItem,
  type NotificationType,
} from '@notifications/api';
import type { NotificationRecord } from '@/app/(public)/home/data/notifications-mock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { NotificationsPageHeading } from './notifications-page-heading';
import { NotificationsPagination } from './notifications-pagination';
import { NotificationsSidebar } from './notifications-sidebar';
import { NotificationsTable } from './notifications-table';
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

/** Figma Notifications #2392:4782 — list API with search / type / pagination. */
export function NotificationsPageView({
  accessToken,
}: NotificationsPageViewProps) {
  const t = useTranslations('notifications');
  const [tab, setTab] = useState<NotificationTab>('manual');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const listQuery = useNotificationsListQuery({
    accessToken,
    page,
    type: tab,
    search: query.trim() || undefined,
    ordering: '-created_at',
  });
  const markOne = useMarkNotificationAsReadMutation();

  const pageItems = (listQuery.data?.items ?? []).map(toRecord);
  const totalPages = listQuery.data?.totalPages ?? 1;
  const hasUnreadManual = (listQuery.data?.unreadCounts.manual ?? 0) > 0;

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
                <NotificationsTable
                  items={pageItems}
                  onItemSelect={handleRowSelect}
                />
                <NotificationsPagination
                  page={page}
                  totalPages={Math.max(totalPages, 1)}
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
