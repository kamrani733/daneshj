'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { EmptyState } from '@/components/panel';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { NoResultState } from '@/components/ui/no-result-state';
import { ReportSection } from '@/components/ui/report-section';
import { ReportToolbar } from '@/components/ui/report-toolbar';
import { Spinner } from '@/components/ui/spinner';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useMobilePagedItems } from '@/hooks/use-mobile-paged-items';
import { toFaDigits } from '@/lib/jalali';

import { ReportFilterPanel } from '@operational-panel/components/report-filter-panel';
import { ReportRows } from '@operational-panel/components/report-rows';
import { useReportQuery } from '@operational-panel/hooks/use-report-query';
import { useReportUrlState } from '@operational-panel/hooks/use-report-url-state';
import type { OperationalReportId, ReportRow } from '@operational-panel/types';
import { getReportDefinition } from '@operational-panel/utils/report-definitions';
import {
  REPORT_SEARCH_MAX_LENGTH,
  hasActiveFilters,
  normalizeReportQuery,
} from '@operational-panel/utils/report-params';

const NO_ROWS: ReportRow[] = [];

/** Phone / tablet: cards revealed per «مشاهده بیشتر» (tablet export shows 4). */
const CARD_STEP = 4;

/** One collapsible operational-panel report: toolbar, five states, table or cards. Data is fetched only while open. */
export function OperationalReportPanel({ reportId }: { reportId: OperationalReportId }) {
  const t = useTranslations('operationalPanel');
  const definition = getReportDefinition(reportId);
  const title = t(`reports.${reportId}.title`);
  const { request, setQuery, setSort, setFilters, setPage } = useReportUrlState(definition);
  const [open, setOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Local draft (Persian digits while typing), debounced into the URL; the URL keeps Latin digits.
  const [draft, setDraft] = useState(() => toFaDigits(request.q));
  const debouncedDraft = useDebouncedValue(draft);
  const lastSent = useRef(request.q);

  useEffect(() => {
    if (request.q !== lastSent.current) {
      lastSent.current = request.q;
      setDraft(toFaDigits(request.q));
    }
  }, [request.q]);

  useEffect(() => {
    const normalized = normalizeReportQuery(debouncedDraft);
    if (normalized === lastSent.current) return;
    lastSent.current = normalized;
    setQuery(normalized);
  }, [debouncedDraft, setQuery]);

  const reportQuery = useReportQuery(reportId, request, open);
  const pageItems = useMemo(() => reportQuery.data?.items ?? [], [reportQuery.data?.items]);
  const totalPages = reportQuery.data?.totalPages ?? 1;
  const resetKey = useMemo(
    () => JSON.stringify({ q: request.q, sort: request.sort, filters: request.filters }),
    [request.q, request.sort, request.filters]
  );
  // The table keeps the previous page on screen while the next loads; the card list must not store it
  // under the new page number (it would show those rows twice).
  const settledItems = reportQuery.isPlaceholderData ? NO_ROWS : pageItems;
  const { mobileItems } = useMobilePagedItems({ page: request.page, pageItems: settledItems, resetKey });
  const [visibleCards, setVisibleCards] = useState(CARD_STEP);
  useEffect(() => setVisibleCards(CARD_STEP), [resetKey]);
  const hasMoreCards = visibleCards < mobileItems.length || request.page < totalPages;
  const showMoreCards = () => {
    // Reveal loaded rows first; fetch the next page only when they run out.
    if (visibleCards + CARD_STEP > mobileItems.length && request.page < totalPages) setPage(request.page + 1);
    setVisibleCards((current) => current + CARD_STEP);
  };
  const filtered = request.q !== '' || hasActiveFilters(request);

  const sortLabel = (value: string): string => {
    const descending = value.startsWith('-');
    const column = descending ? value.slice(1) : value;
    if (column === definition.dateColumn) return t(descending ? 'sort.newest' : 'sort.oldest');
    return t(`reports.${reportId}.columns.${column}`);
  };

  let body: ReactNode;
  if (reportQuery.isPending) {
    body = (
      <div role="status" aria-live="polite" className="flex min-h-60 flex-col items-center justify-center gap-3 py-10">
        <Spinner className="size-9 text-primary" aria-label={t('states.loading')} />
        <span className="text-label-large text-on-surface-variant">{t('states.loading')}</span>
      </div>
    );
  } else if (reportQuery.isError) {
    body = (
      <ErrorState
        message={t('states.error')}
        retryLabel={t('states.retry')}
        onRetry={() => void reportQuery.refetch()}
      />
    );
  } else if (reportQuery.data.count === 0) {
    body = filtered ? (
      <NoResultState message={t('states.noResult')} className="py-6" />
    ) : (
      <EmptyState message={t('states.empty')} />
    );
  } else {
    body = (
      <ReportRows
        definition={definition}
        title={title}
        pageItems={pageItems}
        mobileItems={mobileItems.slice(0, visibleCards)}
        page={request.page}
        totalPages={totalPages}
        onPageChange={setPage}
        loadMore={
          hasMoreCards ? (
            <Button
              type="button"
              variant="link"
              loading={reportQuery.isFetching}
              onClick={showMoreCards}
              className="h-auto self-end px-0"
            >
              <span className="text-label-large">{t('states.loadMore')}</span>
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <ReportSection title={title} open={open} onOpenChange={setOpen}>
      <ReportToolbar
        search={{ value: draft, onChange: setDraft, label: t('toolbar.search'), maxLength: REPORT_SEARCH_MAX_LENGTH }}
        sort={{
          label: t('toolbar.sort'),
          value: request.sort,
          options: definition.sortOptions.map((value) => ({ value, label: sortLabel(value) })),
          onChange: setSort,
        }}
        filter={{
          label: t('toolbar.filters'),
          open: filtersOpen,
          onOpenChange: setFiltersOpen,
          panel: (
            <ReportFilterPanel
              definition={definition}
              filters={request.filters}
              onApply={(filters) => {
                setFilters(filters);
                setFiltersOpen(false);
              }}
              onClear={() => setFilters({ from: '', to: '', values: {} })}
            />
          ),
        }}
      />
      {body}
    </ReportSection>
  );
}
