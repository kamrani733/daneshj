'use client';

import { useTranslations } from 'next-intl';

import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type StatTrendProps = {
  percent: number;
  className?: string;
};

/** Orange period-over-period trend line from Figma stats cards. */
export function StatTrend({ percent, className }: StatTrendProps) {
  const t = useTranslations('notifications.stats');

  return (
    <p
      className={cn(
        'text-xs font-medium leading-5 text-warning-400 dark:text-warning-100',
        className
      )}
    >
      {t('trendUp', { percent: formatFaNumber(percent) })}
    </p>
  );
}
