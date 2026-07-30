'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import {
  getNotificationApiErrorMessage,
  useStatisticsReportQuery,
} from '@notifications/api';
import { withStatIcons } from '@notifications/data/stats';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { NotificationsPageShell } from '../layout/page-shell';
import { StatCountCard } from './count-card';
import { StatRatioCard } from './ratio-card';

type NotificationsStatsViewProps = {
  accessToken?: string | null;
};

/** Notifications stats page — Figma سکشن آمار + statistics_report API. */
export function NotificationsStatsView({
  accessToken,
}: NotificationsStatsViewProps) {
  const t = useTranslations('notifications.stats');
  const canQuery = !!accessToken;

  const statsQuery = useStatisticsReportQuery({ accessToken }, canQuery);
  const data = statsQuery.data;
  const isLoading = statsQuery.isFetching && !data;
  const errorMessage = statsQuery.isError
    ? getNotificationApiErrorMessage(statsQuery.error, t('loadError'))
    : null;

  const { countStats, ratioStats } = useMemo(
    () =>
      withStatIcons(data?.countStats ?? [], data?.ratioStats ?? []),
    [data]
  );

  return (
    <NotificationsPageShell
      titleKey="stats.title"
      breadcrumbCurrentKey="stats.breadcrumbCurrent"
    >
      {!canQuery ? (
        <div className="flex min-h-[160px] items-center justify-center rounded-xl bg-home-stat-card px-4 text-center text-sm text-home-filter-muted">
          {t('authRequired')}
        </div>
      ) : isLoading ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-home-stat-card">
          <Spinner className="size-8 text-primary" />
        </div>
      ) : errorMessage ? (
        <div className="flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-xl bg-home-stat-card px-4 text-center">
          <p className="text-sm text-home-filter-muted">{errorMessage}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void statsQuery.refetch()}
          >
            {t('retry')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 min-[720px]:gap-5">
          {countStats.map((stat) => (
            <StatCountCard key={stat.id} stat={stat} />
          ))}
          {ratioStats.map((stat) => (
            <StatRatioCard key={stat.id} stat={stat} />
          ))}
        </div>
      )}
    </NotificationsPageShell>
  );
}
