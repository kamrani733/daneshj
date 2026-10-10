'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { StatCountCard, StatRatioCard, type StatTrendInfo } from '@/components/ui/stat-card';
import { formatFaNumber } from '@/lib/format-fa';

import type { StatisticsReportResult } from '@notifications/api';
import { withStatIcons } from '@notifications/data/stats';

/** Notifications KPI grid (2 columns) — notifications stats page and operational panel «اعلانات». */
export function NotificationsStatCards({ data }: { data: StatisticsReportResult | undefined }) {
  const tCharts = useTranslations('notifications.charts');
  const tStats = useTranslations('common.stats');

  const { countStats, ratioStats } = useMemo(
    () => withStatIcons(data?.countStats ?? [], data?.ratioStats ?? []),
    [data]
  );

  const trend = (percent: number | undefined): StatTrendInfo | undefined =>
    percent == null ? undefined : { direction: 'up', label: tStats('trend', { percent: formatFaNumber(percent) }) };

  return (
    <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 min-[720px]:gap-6">
      {countStats.map((stat) => (
        <StatCountCard
          key={stat.id}
          icon={stat.icon}
          label={tCharts(stat.titleKey)}
          value={formatFaNumber(stat.value)}
          trend={trend(stat.trendPercent)}
        />
      ))}
      {ratioStats.map((stat) => (
        <StatRatioCard
          key={stat.id}
          icon={stat.icon}
          label={tCharts(stat.titleKey)}
          fraction={
            stat.value != null && stat.total != null
              ? tStats('ofTotal', { value: formatFaNumber(stat.value), total: formatFaNumber(stat.total) })
              : undefined
          }
          percent={stat.percent}
          percentLabel={`${formatFaNumber(stat.percent)}٪`}
          trend={trend(stat.trendPercent)}
        />
      ))}
    </div>
  );
}
