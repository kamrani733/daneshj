'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  getNotificationApiErrorMessage,
  useChartsReportQuery,
} from '@notifications/api';
import type { ChartPeriod } from '@notifications/data/charts';
import { chartPeriodToDateRange } from '@notifications/lib/chart-period-range';
import { formatChartLegendValue } from '@notifications/lib/format-chart-legend';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { AccentMark } from '@/components/site/accent-mark';
import { ChartCard } from './chart-card';
import { NotificationsBarChart } from './bar-chart';
import { NotificationsDonutChart } from './donut-chart';

type NotificationsChartsPanelProps = {
  accessToken?: string | null;
};

/** Figma charts block — wired to GET /notification/report/charts_report. */
export function NotificationsChartsPanel({
  accessToken,
}: NotificationsChartsPanelProps) {
  const t = useTranslations('notifications.charts');
  const [open, setOpen] = useState(true);
  const [period, setPeriod] = useState<ChartPeriod>('week');

  const dateRange = useMemo(() => chartPeriodToDateRange(period), [period]);
  const canQuery = !!accessToken;

  const chartsQuery = useChartsReportQuery(
    {
      accessToken,
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

  return (
    <section className="overflow-hidden rounded-xl bg-home-search-fill ring-1 ring-border/40">
      <header className="flex items-center justify-between gap-3 px-4 py-3.5 min-[720px]:px-5">
        <div className="flex items-center gap-2">
          <AccentMark />
          <h2 className="text-base font-bold leading-6 text-primary-700 dark:text-primary-100">
            {t('fixedTitle')}
          </h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-expanded={open}
          aria-label={open ? t('collapse') : t('expand')}
          onClick={() => setOpen((value) => !value)}
          className="size-8 shrink-0 text-primary-700 hover:bg-transparent hover:text-primary-700 dark:text-primary-100 dark:hover:text-primary-100"
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
          {!canQuery ? (
            <div className="flex min-h-[160px] items-center justify-center rounded-xl bg-white px-4 text-center text-sm text-home-filter-muted dark:bg-home-search-category">
              {t('authRequired')}
            </div>
          ) : isLoading ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-white dark:bg-home-search-category">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : errorMessage ? (
            <div className="flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-xl bg-white px-4 text-center dark:bg-home-search-category">
              <p className="text-sm text-home-filter-muted">{errorMessage}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void chartsQuery.refetch()}
              >
                {t('retry')}
              </Button>
            </div>
          ) : (
            <>
              <ChartCard
                title={t('reactionTime')}
                period={period}
                onPeriodChange={setPeriod}
                headerLayout="split"
              >
                <NotificationsBarChart
                  data={data?.reactionTimeSeries ?? []}
                  barColor="var(--color-chart-series-b)"
                />
              </ChartCard>

              <ChartCard
                title={t('conversionRate')}
                period={period}
                onPeriodChange={setPeriod}
                headerLayout="split"
              >
                <NotificationsBarChart
                  data={data?.conversionRateSeries ?? []}
                  barColor="var(--color-chart-series-a)"
                  showValueLabels
                />
              </ChartCard>

              <div className="grid grid-cols-1 gap-4 min-[960px]:grid-cols-2 min-[960px]:gap-5">
                {data?.readVsUnread ? (
                  <ChartCard
                    title={t('readVsUnread')}
                    period={period}
                    onPeriodChange={setPeriod}
                    footer={totalLabel}
                    className="min-w-0"
                  >
                    <NotificationsDonutChart
                      data={data.readVsUnread.slices}
                      primaryColor={data.readVsUnread.primaryColor}
                      otherColor={data.readVsUnread.otherColor}
                      centerPercent={data.readVsUnread.centerPercent}
                      centerLabel={data.readVsUnread.centerLabel}
                      legend={data.readVsUnread.legend.map((item) => ({
                        label: item.label,
                        value: formatChartLegendValue(item.display),
                        color: item.color,
                      }))}
                    />
                  </ChartCard>
                ) : null}

                {data?.categoryReadRate ? (
                  <ChartCard
                    title={t('categoryReadRate')}
                    period={period}
                    onPeriodChange={setPeriod}
                    className="min-w-0"
                  >
                    <NotificationsDonutChart
                      data={data.categoryReadRate.slices}
                      primaryColor={data.categoryReadRate.primaryColor}
                      otherColor={data.categoryReadRate.otherColor}
                      centerPercent={data.categoryReadRate.centerPercent}
                      centerLabel={data.categoryReadRate.centerLabel}
                      legend={data.categoryReadRate.legend.map((item) => ({
                        label: item.label,
                        value: formatChartLegendValue(item.display),
                        color: item.color,
                      }))}
                    />
                  </ChartCard>
                ) : null}

                {data?.receivedByCategory ? (
                  <ChartCard
                    title={t('receivedByCategory')}
                    period={period}
                    onPeriodChange={setPeriod}
                    footer={totalLabel}
                    className="min-w-0 min-[960px]:col-span-2 min-[960px]:max-w-[50%]"
                  >
                    <NotificationsDonutChart
                      data={data.receivedByCategory.slices}
                      primaryColor={data.receivedByCategory.primaryColor}
                      otherColor={data.receivedByCategory.otherColor}
                      centerPercent={data.receivedByCategory.centerPercent}
                      centerLabel={data.receivedByCategory.centerLabel}
                      legend={data.receivedByCategory.legend.map((item) => ({
                        label: item.label,
                        value: formatChartLegendValue(item.display),
                        color: item.color,
                      }))}
                    />
                  </ChartCard>
                ) : null}
              </div>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
