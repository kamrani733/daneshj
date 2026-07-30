'use client';

import { useTranslations } from 'next-intl';

import type { CountStatConfig } from '@notifications/data/stats-mock';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { StatIconTile } from './icon-tile';
import { StatTrend } from './trend';

type StatCountCardProps = {
  stat: CountStatConfig;
  className?: string;
};

/** Figma stats count KPI — icon · value · label · trend. */
export function StatCountCard({ stat, className }: StatCountCardProps) {
  const t = useTranslations('notifications.charts');

  return (
    <article
      className={cn(
        'flex h-full flex-col gap-3 rounded-xl bg-home-stat-card p-4 shadow-sm ring-1 ring-border/30 dark:ring-primary-800/60 min-[720px]:gap-4 min-[720px]:p-5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <StatIconTile icon={stat.icon} />
        <p className="text-end text-3xl font-bold leading-9 text-content tabular-nums dark:text-primary-100 min-[720px]:text-4xl min-[720px]:leading-10">
          {formatFaNumber(stat.value)}
        </p>
      </div>
      <p className="text-sm font-medium leading-6 text-content dark:text-primary-100/80">
        {t(stat.titleKey)}
      </p>
      <StatTrend percent={stat.trendPercent} className="mt-auto" />
    </article>
  );
}
