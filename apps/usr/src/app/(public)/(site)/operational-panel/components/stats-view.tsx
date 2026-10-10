'use client';

import { useTranslations } from 'next-intl';

import { ErrorState } from '@/components/ui/error-state';
import { SectionHeading } from '@/components/ui/section-heading';
import { Spinner } from '@/components/ui/spinner';
import { StatCountCard, StatRatioCard, type StatTrendInfo } from '@/components/ui/stat-card';
import { formatFaNumber } from '@/lib/format-fa';

import { getNotificationApiErrorMessage, useStatisticsReportQuery } from '@notifications/api';
import { NotificationsStatCards } from '@notifications/components/stats/cards';
import { DateRangeFilterBar } from '@operational-panel/components/date-range-filter-bar';
import { OperationalShell } from '@operational-panel/components/operational-shell';
import { useDateRangeUrlState } from '@operational-panel/hooks/use-date-range-url-state';
import { useStatsQuery } from '@operational-panel/hooks/use-stats-query';
import type { OperationalStats, StatTrend } from '@operational-panel/types/stats';
import { STAT_SECTIONS, type StatSectionDefinition } from '@operational-panel/utils/stat-definitions';

type OperationalStatsViewProps = {
  displayName?: string;
  accessToken?: string | null;
  sessionUserId?: string | null;
};

/** `/operational-panel/stats` — Figma «پنل عملیاتی» › «آمار». */
export function OperationalStatsView({ displayName, accessToken, sessionUserId }: OperationalStatsViewProps) {
  const t = useTranslations('operationalPanel.stats');
  const { range } = useDateRangeUrlState('stats');
  const statsQuery = useStatsQuery(range);

  return (
    <OperationalShell section="stats" displayName={displayName}>
      <DateRangeFilterBar prefix="stats" />

      {STAT_SECTIONS.map((section) =>
        section.source === 'notifications' ? (
          <NotificationsStatsSection key={section.id} accessToken={accessToken} sessionUserId={sessionUserId} />
        ) : (
          <section key={section.id} aria-label={t(`sections.${section.id}`)} className="flex flex-col gap-4 min-[720px]:gap-6">
            <SectionHeading
              title={t(`sections.${section.id}`)}
              tone="secondary"
              size="title"
              align="start"
              className="px-0"
            />
            {statsQuery.isPending ? (
              <div role="status" className="flex min-h-40 items-center justify-center rounded-medium bg-surface-container-lowest">
                <Spinner className="size-8 text-primary" aria-label={t('loading')} />
              </div>
            ) : statsQuery.isError ? (
              <ErrorState message={t('error')} retryLabel={t('retry')} onRetry={() => void statsQuery.refetch()} />
            ) : (
              <StatGrid section={section} stats={statsQuery.data} />
            )}
          </section>
        )
      )}
    </OperationalShell>
  );
}

function StatGrid({ section, stats }: { section: StatSectionDefinition; stats: OperationalStats }) {
  const t = useTranslations('operationalPanel.stats');
  const tCommon = useTranslations('common.stats');

  const trend = (value: StatTrend): StatTrendInfo => ({
    direction: value.direction,
    label: tCommon('trend', { percent: formatFaNumber(value.percent) }),
  });

  return (
    <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 min-[720px]:gap-6">
      {section.cards.map((card) => {
        const stat = stats[card.id];
        if (!stat) return null;
        const label = t(`cards.${card.id}`);
        if (stat.kind === 'ratio') {
          return (
            <StatRatioCard
              key={card.id}
              icon={card.icon}
              label={label}
              fraction={tCommon('ofTotal', { value: formatFaNumber(stat.value), total: formatFaNumber(stat.total) })}
              percent={stat.percent}
              percentLabel={`${formatFaNumber(stat.percent)}٪`}
              trend={trend(stat.trend)}
            />
          );
        }
        return (
          <StatCountCard
            key={card.id}
            icon={card.icon}
            label={label}
            value={formatFaNumber(stat.value, Number.isInteger(stat.value) ? 0 : 1)}
            unit={card.unit ? t(`units.${card.unit}`) : undefined}
            caption={stat.caption}
            trend={trend(stat.trend)}
          />
        );
      })}
    </div>
  );
}

/** «اعلانات» — Notification MS statistics report (real API) with its own date filter. SRS: Usr-Ntf-6N12 */
function NotificationsStatsSection({
  accessToken,
  sessionUserId,
}: {
  accessToken?: string | null;
  sessionUserId?: string | null;
}) {
  const t = useTranslations('operationalPanel.stats');
  const tNotifications = useTranslations('notifications.stats');
  const { range } = useDateRangeUrlState('notifications');
  const canQuery = !!accessToken;
  const statsQuery = useStatisticsReportQuery(
    { accessToken, sessionUserId, startDate: range.from || undefined, endDate: range.to || undefined },
    canQuery
  );

  return (
    <section aria-label={t('sections.notifications')} className="flex flex-col gap-4 min-[720px]:gap-6">
      <SectionHeading title={t('sections.notifications')} tone="secondary" size="title" align="start" className="px-0" />
      <DateRangeFilterBar prefix="notifications" />
      {!canQuery ? (
        <p className="flex min-h-32 items-center justify-center rounded-medium bg-surface-container-lowest px-4 text-center text-body-medium text-on-surface-variant">
          {tNotifications('authRequired')}
        </p>
      ) : statsQuery.isFetching && !statsQuery.data ? (
        <div role="status" className="flex min-h-40 items-center justify-center rounded-medium bg-surface-container-lowest">
          <Spinner className="size-8 text-primary" aria-label={t('loading')} />
        </div>
      ) : statsQuery.isError ? (
        <ErrorState
          message={getNotificationApiErrorMessage(statsQuery.error, tNotifications('loadError'))}
          retryLabel={t('retry')}
          onRetry={() => void statsQuery.refetch()}
        />
      ) : (
        <NotificationsStatCards data={statsQuery.data} />
      )}
    </section>
  );
}
