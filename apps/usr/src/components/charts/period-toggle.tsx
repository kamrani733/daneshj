'use client';

import { useTranslations } from 'next-intl';

import { CHART_PERIODS, type ChartPeriod } from '@/components/charts/types';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

type ChartPeriodToggleProps = {
  value: ChartPeriod;
  onValueChange: (value: ChartPeriod) => void;
  className?: string;
};

/** Figma period chips «روز / هفته / ماه / فصل / سال» — separate rounded chips, active one filled. */
export function ChartPeriodToggle({ value, onValueChange, className }: ChartPeriodToggleProps) {
  const t = useTranslations('common.chartPeriods');

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next as ChartPeriod);
      }}
      spacing={1}
      aria-label={t('label')}
      className={cn('flex-wrap justify-center', className)}
    >
      {CHART_PERIODS.map((period) => (
        <ToggleGroupItem
          key={period}
          value={period}
          className={cn(
            'h-7 min-w-11 rounded-small border-0 px-2.5 shadow-none',
            'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface',
            'data-[state=on]:bg-primary data-[state=on]:text-on-primary data-[state=on]:hover:bg-primary data-[state=on]:hover:text-on-primary'
          )}
        >
          {/* Type token outside `cn()`: tailwind-merge reads custom sizes as colours. */}
          <span className="text-label-small font-medium">{t(period)}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
