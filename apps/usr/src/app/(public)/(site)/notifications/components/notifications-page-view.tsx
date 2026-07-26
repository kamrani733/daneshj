'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import {
  useMarkNotificationAsReadMutation,
  useNotificationsListQuery,
  type NotificationItem,
  type NotificationType,
} from '@notifications/api';
import type { NotificationRecord } from '@home/data/notifications-mock';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { NotificationsCardList } from './notifications-card-list';
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

/**
 * Desktop Figma #2424:2076 — table + pagination.
 * Tablet/mobile Figma #2419:2680 — card list + load more.
 */
export function NotificationsPageView({
  accessToken,
}: NotificationsPageViewProps) {
  const t = useTranslations('notifications');
  const [tab, setTab] = useState<NotificationTab>('manual');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [mobilePages, setMobilePages] = useState<
    Record<number, NotificationRecord[]>
  >({});

  const listQuery = useNotificationsListQuery({
    accessToken,
    page,
    type: tab,
    search: query.trim() || undefined,
    ordering: '-created_at',
  });
  const markOne = useMarkNotificationAsReadMutation();

  const pageItems = (listQuery.data?.items ?? []).map(toRecord);
  const totalPages = Math.max(listQuery.data?.totalPages ?? 1, 1);
  const hasUnreadManual = (listQuery.data?.unreadCounts.manual ?? 0) > 0;
  const isListLoading = listQuery.isPending || (listQuery.isFetching && pageItems.length === 0);
  const canLoadMore = page < totalPages;
  const mobileItems = useMemo(
    () =>
      Array.from({ length: page }, (_, index) => index + 1).flatMap(
        (pageNumber) => mobilePages[pageNumber] ?? []
      ),
    [mobilePages, page]
  );

  useEffect(() => {
    setPage(1);
    setMobilePages({});
  }, [tab, query]);

  useEffect(() => {
    if (!listQuery.data) return;
    setMobilePages((prev) => ({
      ...prev,
      [page]: listQuery.data.items.map(toRecord),
    }));
  }, [listQuery.data, page]);

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
            <TabsList className="h-auto w-full justify-end gap-0 self-stretch rounded-none border-b border-border bg-transparent p-0">
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
                  onQueryChange={(next) => {
                    setQuery(next);
                    setPage(1);
                  }}
                />
                {isListLoading ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex min-h-[240px] flex-col items-center justify-center gap-3 py-10 text-neutral-600"
                  >
                    <Spinner
                      className="size-9 text-primary"
                      aria-label={t('loading')}
                    />
                    <span className="text-sm font-medium leading-5">
                      {t('loading')}
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Desktop #2424:2076 */}
                    <div className="hidden flex-col gap-3 lg:flex">
                      <NotificationsTable
                        items={pageItems}
                        onItemSelect={handleRowSelect}
                      />
                      <NotificationsPagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                      />
                    </div>

                    {/* Tablet / mobile #2419:2680 */}
                    <div className="flex flex-col gap-3 lg:hidden">
                      <NotificationsCardList
                        items={mobileItems}
                        onItemSelect={handleRowSelect}
                      />
                      {canLoadMore ? (
                        <Button
                          type="button"
                          variant="link"
                          loading={listQuery.isFetching}
                          onClick={() => setPage((current) => current + 1)}
                          className="h-auto self-start px-0 text-sm font-medium leading-5"
                        >
                          {t('loadMore')}
                        </Button>
                      ) : null}
                    </div>
                  </>
                )}
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
