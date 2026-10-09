'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  useDetailedStatusReportQuery,
  type ReportOrdering,
} from '@notifications/api';
import { resolveApiCategoryIds } from '@notifications/data/notifications-filter-data';
import { useMobilePagedItems } from '@notifications/hooks';
import {
  EMPTY_REPORTS_FILTERS,
  ReportsFilterPanel,
  type ReportsFilterValues,
} from '@notifications/components/reports/filter-panel';
import { NotificationsReportRows } from '@notifications/components/reports/rows';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { Button } from '@/components/ui/button';
import { ReportSection } from '@/components/ui/report-section';
import { ReportToolbar } from '@/components/ui/report-toolbar';
import { Spinner } from '@/components/ui/spinner';

/** Figma sort menu — one preferred direction per field (API Usr-Ntf-6N5 ordering). */
const ORDERING_OPTIONS: Array<{ value: ReportOrdering; labelKey: string }> = [
  { value: '-sent_at', labelKey: 'sentNewest' },
  { value: 'main_category', labelKey: 'mainCategory' },
  { value: 'sub_category', labelKey: 'subCategory' },
  { value: '-priority', labelKey: 'priorityHighest' },
  { value: 'status', labelKey: 'status' },
];

/** SRS input convention: search fields accept at most 50 characters. */
const SEARCH_MAX_LENGTH = 50;

type NotificationsReportsPanelProps = {
  accessToken?: string | null;
};

/** «گزارش اعلان‌های دریافتی و وضعیت آنها» — notifications reports page and operational panel. SRS: Usr-Ntf-6N5 */
export function NotificationsReportsPanel({ accessToken }: NotificationsReportsPanelProps) {
  const t = useTranslations('notifications.reports');
  const [open, setOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [ordering, setOrdering] = useState<ReportOrdering>('-sent_at');
  const [filters, setFilters] = useState<ReportsFilterValues>(EMPTY_REPORTS_FILTERS);
  const [page, setPage] = useState(1);

  const search = useDebouncedValue(query.trim());
  const categoryIds = resolveApiCategoryIds(filters.categoryIds);

  const reportQuery = useDetailedStatusReportQuery({
    accessToken,
    page,
    search: search || undefined,
    ordering,
    priority: filters.priority,
    status: filters.status,
    channel: filters.channel,
    startDate: filters.sentStart || undefined,
    endDate: filters.sentEnd || undefined,
    mainCategoryId: categoryIds.mainCategoryId,
    subCategoryId: categoryIds.subCategoryId,
  });

  const pageItems = useMemo(() => reportQuery.data?.items ?? [], [reportQuery.data?.items]);
  const totalPages = Math.max(reportQuery.data?.totalPages ?? 1, 1);
  const isLoading = reportQuery.isPending || (reportQuery.isFetching && pageItems.length === 0);

  const resetKey = useMemo(
    () => JSON.stringify({ search, ordering, filters }),
    [search, ordering, filters]
  );
  const { mobileItems } = useMobilePagedItems({ page, pageItems, resetKey });

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  return (
    <ReportSection title={t('panelTitle')} open={open} onOpenChange={setOpen}>
      <ReportToolbar
        search={{ value: query, onChange: setQuery, label: t('search'), maxLength: SEARCH_MAX_LENGTH }}
        sort={{
          label: t('sort'),
          value: ordering,
          options: ORDERING_OPTIONS.map((option) => ({
            value: option.value,
            label: t(`orderingMenu.${option.labelKey}`),
          })),
          onChange: setOrdering,
        }}
        filter={{
          label: t('filters'),
          open: filtersOpen,
          onOpenChange: setFiltersOpen,
          panel: (
            <ReportsFilterPanel
              filters={filters}
              onApply={(next) => {
                setFilters(next);
                setFiltersOpen(false);
              }}
              onClear={() => setFilters(EMPTY_REPORTS_FILTERS)}
            />
          ),
        }}
      />

      {isLoading ? (
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-60 flex-col items-center justify-center gap-3 py-10 text-on-surface-variant"
        >
          <Spinner className="size-9 text-primary" aria-label={t('loading')} />
          <span className="text-label-large">{t('loading')}</span>
        </div>
      ) : pageItems.length === 0 && mobileItems.length === 0 ? (
        <p className="py-10 text-center text-body-medium text-on-surface-variant">{t('empty')}</p>
      ) : (
        <NotificationsReportRows
          title={t('panelTitle')}
          pageItems={pageItems}
          mobileItems={mobileItems}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          loadMore={
            page < totalPages ? (
              <Button
                type="button"
                variant="link"
                loading={reportQuery.isFetching}
                onClick={() => setPage((current) => current + 1)}
                className="h-auto self-end px-0"
              >
                <span className="text-label-large">{t('loadMore')}</span>
              </Button>
            ) : null
          }
        />
      )}
    </ReportSection>
  );
}
