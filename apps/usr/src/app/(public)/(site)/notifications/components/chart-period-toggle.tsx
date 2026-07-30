'use client';

import { useTranslations } from 'next-intl';

import {
  CHART_PERIODS,
  type ChartPeriod,
} from '@notifications/data/charts-mock';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

type ChartPeriodToggleProps = {
  value: ChartPeriod;
  onValueChange: (value: ChartPeriod) => void;
  className?: string;
};

/** Figma period pills: روز / هفته / ماه / فصل / سال — separate rounded chips. */
export function ChartPeriodToggle({
  value,
  onValueChange,
  className,
}: ChartPeriodToggleProps) {
  const t = useTranslations('notifications.charts');

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (!next) return;
        onValueChange(next as ChartPeriod);
      }}
      spacing={2}
      aria-label={t('periodLabel')}
      className={cn('justify-center', className)}
    >
      {CHART_PERIODS.map((period) => (
        <ToggleGroupItem
          key={period}
          value={period}
          className={cn(
            'h-8 min-w-[52px] rounded-md border-0 px-3 text-xs font-medium shadow-none',
            'bg-neutral-100 text-neutral-600 hover:bg-neutral-100 hover:text-content',
            'dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-content',
            'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
            'data-[state=on]:hover:bg-primary data-[state=on]:hover:text-primary-foreground',
            'dark:data-[state=on]:bg-primary-100 dark:data-[state=on]:text-primary-900',
            'dark:data-[state=on]:hover:bg-primary-100 dark:data-[state=on]:hover:text-primary-900'
          )}
        >
          {t(`periods.${period}`)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
