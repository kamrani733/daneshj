'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  getNotificationApiErrorMessage,
  useChartsReportQuery,
} from '@notifications/api';
import { chartPeriodToDateRange } from '@notifications/utils/chart-period-range';
import { BarChart, ChartCard, ChartPeriodToggle, type ChartPeriod } from '@/components/charts';
import { ErrorState } from '@/components/ui/error-state';
import { ReportSection } from '@/components/ui/report-section';
import { Spinner } from '@/components/ui/spinner';
import { formatFaNumber } from '@/lib/format-fa';

import { NotificationsDonutCard } from '@notifications/components/charts/donut-card';

type NotificationsChartsPanelProps = {
  accessToken?: string | null;
  sessionUserId?: string | null;
};

/** Figma charts block — actor or admin charts report (see `getChartsReport`). */
export function NotificationsChartsPanel({
  accessToken,
  sessionUserId,
}: NotificationsChartsPanelProps) {
  const t = useTranslations('notifications.charts');
  const [open, setOpen] = useState(true);
  const [period, setPeriod] = useState<ChartPeriod>('week');

  const dateRange = useMemo(() => chartPeriodToDateRange(period), [period]);
  const canQuery = !!accessToken;

  const chartsQuery = useChartsReportQuery(
    {
      accessToken,
      sessionUserId,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
    canQuery
  );

  const data = chartsQuery.data;
  /** Disabled queries stay `isPending` in RQ v5 — only treat real fetches as loading. */
  const isLoading = chartsQuery.isFetching && !data;
  const errorMessage = chartsQuery.isError
    ? getNotificationApiErrorMessage(chartsQuery.error, t('loadError'))
    : null;

  const totalLabel = t('totalRequests', {
    count: formatFaNumber(data?.receivedByCategory.totalCount ?? 0),
  });

  const periodToggle = <ChartPeriodToggle value={period} onValueChange={setPeriod} />;

  return (
    <ReportSection title={t('fixedTitle')} open={open} onOpenChange={setOpen}>
      {!canQuery ? (
        <p className="flex min-h-40 items-center justify-center rounded-medium bg-surface-container-lowest px-4 text-center text-body-medium text-on-surface-variant">
          {t('authRequired')}
        </p>
      ) : isLoading ? (
        <div className="flex min-h-56 items-center justify-center rounded-medium bg-surface-container-lowest">
          <Spinner className="size-8 text-primary" />
        </div>
      ) : errorMessage ? (
        <ErrorState message={errorMessage} retryLabel={t('retry')} onRetry={() => void chartsQuery.refetch()} />
      ) : (
        <div className="flex flex-col gap-4 min-[720px]:gap-5">
          <ChartCard title={t('reactionTime')} actions={periodToggle}>
            <BarChart
              data={data?.reactionTimeSeries ?? []}
              series={[{ key: 'value', label: t('reactionTime'), tone: 'seriesB' }]}
              showValueLabels={false}
            />
          </ChartCard>

          <ChartCard title={t('conversionRate')} actions={periodToggle}>
            <BarChart
              data={data?.conversionRateSeries ?? []}
              series={[{ key: 'value', label: t('conversionRate'), tone: 'seriesA' }]}
            />
          </ChartCard>

          <div className="grid grid-cols-1 gap-4 min-[960px]:grid-cols-2 min-[960px]:gap-5">
            {data?.readVsUnread ? (
              <NotificationsDonutCard
                title={t('readVsUnread')}
                view={data.readVsUnread}
                actions={periodToggle}
                footer={totalLabel}
                className="min-w-0"
              />
            ) : null}
            {data?.categoryReadRate ? (
              <NotificationsDonutCard
                title={t('categoryReadRate')}
                view={data.categoryReadRate}
                actions={periodToggle}
                className="min-w-0"
              />
            ) : null}
            {data?.receivedByCategory ? (
              <NotificationsDonutCard
                title={t('receivedByCategory')}
                view={data.receivedByCategory}
                actions={periodToggle}
                footer={totalLabel}
                className="min-w-0"
              />
            ) : null}
          </div>
        </div>
      )}
    </ReportSection>
  );
}
