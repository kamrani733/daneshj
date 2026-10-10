'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { BarChart, ChartCard, ChartPeriodToggle, type ChartPeriod } from '@/components/charts';
import { ErrorState } from '@/components/ui/error-state';
import { ReportSection } from '@/components/ui/report-section';
import { Spinner } from '@/components/ui/spinner';
import { formatFaNumber } from '@/lib/format-fa';

import { getNotificationApiErrorMessage, useChartsReportQuery } from '@notifications/api';
import { NotificationsDonutCard } from '@notifications/components/charts/donut-card';
import { chartPeriodToDateRange } from '@notifications/utils/chart-period-range';
import { ChartLayout } from '@operational-panel/components/chart-section';

type NotificationsChartsSectionProps = {
  title: string;
  accessToken?: string | null;
  sessionUserId?: string | null;
};

/**
 * «نمودارهای بخش اعلانات» — Notification MS charts report (real API): manual / system received over time,
 * unread share, referral-link click share. SRS: Usr-Ntf-6N11
 */
export function NotificationsChartsSection({ title, accessToken, sessionUserId }: NotificationsChartsSectionProps) {
  const t = useTranslations('notifications.charts');
  const [open, setOpen] = useState(true);
  const [period, setPeriod] = useState<ChartPeriod>('day');
  const dateRange = useMemo(() => chartPeriodToDateRange(period), [period]);
  const canQuery = !!accessToken;

  const chartsQuery = useChartsReportQuery(
    { accessToken, sessionUserId, startDate: dateRange.startDate, endDate: dateRange.endDate },
    canQuery && open
  );
  const data = chartsQuery.data;
  const toggle = <ChartPeriodToggle value={period} onValueChange={setPeriod} />;
  const total = (count: number) => t('totalRequests', { count: formatFaNumber(count) });

  let body;
  if (!canQuery) {
    body = (
      <p className="flex min-h-32 items-center justify-center rounded-medium bg-surface-container-lowest px-4 text-center text-body-medium text-on-surface-variant">
        {t('authRequired')}
      </p>
    );
  } else if (chartsQuery.isFetching && !data) {
    body = (
      <div role="status" className="flex min-h-56 items-center justify-center rounded-medium bg-surface-container-lowest">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  } else if (chartsQuery.isError) {
    body = (
      <ErrorState
        message={getNotificationApiErrorMessage(chartsQuery.error, t('loadError'))}
        retryLabel={t('retry')}
        onRetry={() => void chartsQuery.refetch()}
      />
    );
  } else {
    body = (
      <ChartLayout
        bars={[
          <ChartCard key="manual" title={t('manualReceived')} actions={toggle}>
            <BarChart
              data={data?.reactionTimeSeries ?? []}
              series={[{ key: 'value', label: t('manualReceived'), tone: 'primary' }]}
              fadeLast
            />
          </ChartCard>,
          <ChartCard key="system" title={t('systemReceived')} actions={toggle}>
            <BarChart
              data={data?.conversionRateSeries ?? []}
              series={[{ key: 'value', label: t('systemReceived'), tone: 'secondary' }]}
              fadeLast
            />
          </ChartCard>,
        ]}
        donuts={[
          data?.readVsUnread ? (
            <NotificationsDonutCard
              key="unread"
              title={t('readRatio')}
              view={data.readVsUnread}
              actions={toggle}
              footer={total(data.readVsUnread.totalCount)}
              className="min-w-0"
            />
          ) : null,
          data?.categoryReadRate ? (
            <NotificationsDonutCard
              key="linkClick"
              title={t('linkClickRatio')}
              view={data.categoryReadRate}
              actions={toggle}
              footer={total(data.categoryReadRate.totalCount)}
              className="min-w-0"
            />
          ) : null,
        ]}
      />
    );
  }

  return (
    <ReportSection title={title} open={open} onOpenChange={setOpen}>
      {body}
    </ReportSection>
  );
}
