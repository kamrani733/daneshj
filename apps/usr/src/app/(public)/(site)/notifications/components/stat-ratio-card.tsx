'use client';

import { useTranslations } from 'next-intl';

import type { RatioStatConfig } from '@notifications/data/stats-mock';
import { Progress } from '@/components/ui/progress';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { StatIconTile } from './stat-icon-tile';
import { StatTrend } from './stat-trend';

type StatRatioCardProps = {
  stat: RatioStatConfig;
  className?: string;
};

/** Figma stats ratio KPI — title · fraction/% · progress · trend. */
export function StatRatioCard({ stat, className }: StatRatioCardProps) {
  const tCharts = useTranslations('notifications.charts');
  const tStats = useTranslations('notifications.stats');

  return (
    <article
      className={cn(
        'flex h-full flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-border/30 min-[720px]:gap-4 min-[720px]:p-5',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <StatIconTile icon={stat.icon} />
        <h3 className="min-w-0 flex-1 text-sm font-medium leading-6 text-primary-700">
          {tCharts(stat.titleKey)}
        </h3>
      </div>

      <div aria-hidden className="h-px w-full bg-border/60" />

      <div className="flex items-end justify-between gap-3">
        <p className="text-xs font-medium leading-5 text-primary">
          {tStats('ofTotal', {
            value: formatFaNumber(stat.value),
            total: formatFaNumber(stat.total),
          })}
        </p>
        <p className="text-3xl font-bold leading-9 text-primary tabular-nums min-[720px]:text-4xl min-[720px]:leading-10">
          {formatFaNumber(stat.percent)}٪
        </p>
      </div>

      <Progress
        value={stat.percent}
        dir="ltr"
        className="h-2 bg-neutral-100 *:data-[slot=progress-indicator]:bg-primary"
      />

      <StatTrend percent={stat.trendPercent} className="mt-auto" />
    </article>
  );
}
