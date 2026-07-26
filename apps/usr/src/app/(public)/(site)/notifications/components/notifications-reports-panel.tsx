'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  useDetailedStatusReportQuery,
  type DetailedStatusReportItem,
  type ReportOrdering,
} from '@notifications/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

import { AccentMark } from './accent-mark';
import { NotificationsPagination } from './notifications-pagination';
import { ReportsCardList } from './reports-card-list';
import {
  ReportsToolbar,
  type ReportsFilters,
} from './reports-toolbar';
import { ReportsTable } from './reports-table';

type NotificationsReportsPanelProps = {
  accessToken?: string | null;
};

export function NotificationsReportsPanel({
  accessToken,
}: NotificationsReportsPanelProps) {
  const t = useTranslations('notifications.reports');
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [ordering, setOrdering] = useState<ReportOrdering>('-sent_at');
  const [filters, setFilters] = useState<ReportsFilters>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [mobilePages, setMobilePages] = useState<
    Record<number, DetailedStatusReportItem[]>
  >({});

  const reportQuery = useDetailedStatusReportQuery({
    accessToken,
    page,
    search: query.trim() || undefined,
    ordering,
    priority: filters.priority,
    status: filters.status,
    channel: filters.channel,
  });

  const pageItems = reportQuery.data?.items ?? [];
  const totalPages = Math.max(reportQuery.data?.totalPages ?? 1, 1);
  const isLoading =
    reportQuery.isPending ||
    (reportQuery.isFetching && pageItems.length === 0);
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
  }, [query, ordering, filters.priority, filters.status, filters.channel]);

  useEffect(() => {
    if (!reportQuery.data) return;
    setMobilePages((prev) => ({
      ...prev,
      [page]: reportQuery.data.items,
    }));
  }, [reportQuery.data, page]);

  return (
    <section className="overflow-hidden rounded-xl bg-home-search-fill ring-1 ring-border/40">
      <header className="flex items-center justify-between gap-3 px-4 py-3.5 min-[720px]:px-5">
        <div className="flex items-center gap-2">
          <AccentMark />
          <h2 className="text-sm font-bold leading-6 text-primary-700 min-[720px]:text-base">
            {t('panelTitle')}
          </h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-expanded={open}
          aria-label={open ? t('collapse') : t('expand')}
          onClick={() => setOpen((value) => !value)}
          className="size-8 shrink-0 text-primary-700 hover:bg-transparent hover:text-primary-700"
        >
          <ChevronDown
            className={cn(
              'size-5 transition-transform',
              !open && '-rotate-90'
            )}
            strokeWidth={1.75}
            aria-hidden
          />
        </Button>
      </header>

      {open ? (
        <div className="flex flex-col gap-4 px-3 pb-4 min-[720px]:gap-5 min-[720px]:px-5 min-[720px]:pb-5">
          <div className="rounded-xl bg-white p-3 ring-1 ring-border/30 min-[720px]:p-4">
            <ReportsToolbar
              query={query}
              onQueryChange={setQuery}
              ordering={ordering}
              onOrderingChange={setOrdering}
              filters={filters}
              onFiltersChange={setFilters}
              filterOpen={filterOpen}
              onFilterOpenChange={setFilterOpen}
            />
            <div
              aria-hidden
              className="mt-4 hidden h-1 rounded-full bg-primary lg:block"
            />
          </div>

          {isLoading ? (
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
          ) : pageItems.length === 0 && mobileItems.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-600">
              {t('empty')}
            </p>
          ) : (
            <>
              <div className="hidden flex-col gap-3 lg:flex">
                <div className="overflow-x-auto">
                  <ReportsTable items={pageItems} />
                </div>
                <NotificationsPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>

              <div className="flex flex-col gap-3 lg:hidden">
                <ReportsCardList items={mobileItems} />
                {canLoadMore ? (
                  <Button
                    type="button"
                    variant="link"
                    loading={reportQuery.isFetching}
                    onClick={() => setPage((current) => current + 1)}
                    className="h-auto self-start px-0 text-sm font-medium leading-5"
                  >
                    {t('loadMore')}
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
