'use client';

import { useTranslations } from 'next-intl';

import {
  getNotificationApiErrorMessage,
  useStatisticsReportQuery,
} from '@notifications/api';
import { ErrorState } from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';

import { NotificationsPageShell } from '@notifications/components/layout/page-shell';
import { NotificationsStatCards } from '@notifications/components/stats/cards';

type NotificationsStatsViewProps = {
  accessToken?: string | null;
  sessionUserId?: string | null;
};

/** Notifications stats — actor or admin statistics report (see `getStatisticsReport`). */
export function NotificationsStatsView({
  accessToken,
  sessionUserId,
}: NotificationsStatsViewProps) {
  const t = useTranslations('notifications.stats');
  const canQuery = !!accessToken;

  const statsQuery = useStatisticsReportQuery(
    { accessToken, sessionUserId },
    canQuery
  );
  const data = statsQuery.data;
  const isLoading = statsQuery.isFetching && !data;
  const errorMessage = statsQuery.isError
    ? getNotificationApiErrorMessage(statsQuery.error, t('loadError'))
    : null;

  return (
    <NotificationsPageShell
      titleKey="stats.title"
      breadcrumbCurrentKey="stats.breadcrumbCurrent"
    >
      {!canQuery ? (
        <p className="flex min-h-40 items-center justify-center rounded-medium bg-surface-container-lowest px-4 text-center text-body-medium text-on-surface-variant">
          {t('authRequired')}
        </p>
      ) : isLoading ? (
        <div className="flex min-h-56 items-center justify-center rounded-medium bg-surface-container-lowest">
          <Spinner className="size-8 text-primary" />
        </div>
      ) : errorMessage ? (
        <ErrorState message={errorMessage} retryLabel={t('retry')} onRetry={() => void statsQuery.refetch()} />
      ) : (
        <NotificationsStatCards data={data} />
      )}
    </NotificationsPageShell>
  );
}
