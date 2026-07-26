'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  CHARTS_TOTAL_REQUESTS,
  FIXED_BAR_CHARTS,
  FIXED_CHART_PERIOD_IDS,
  FIXED_DONUT_CHARTS,
} from '@notifications/data/charts-mock';
import { useChartPeriods } from '@notifications/hooks/use-chart-periods';
import { formatChartLegendValue } from '@notifications/lib/format-chart-legend';
import { Button } from '@/components/ui/button';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { AccentMark } from './accent-mark';
import { ChartCard } from './chart-card';
import { NotificationsBarChart } from './notifications-bar-chart';
import { NotificationsDonutChart } from './notifications-donut-chart';

/** Figma fixed charts block — cream shell + stacked white chart cards. */
export function NotificationsChartsPanel() {
  const t = useTranslations('notifications.charts');
  const [open, setOpen] = useState(true);
  const { periods, setPeriod } = useChartPeriods(FIXED_CHART_PERIOD_IDS);
  const totalLabel = t('totalRequests', {
    count: formatFaNumber(CHARTS_TOTAL_REQUESTS),
  });

  return (
    <section className="overflow-hidden rounded-xl bg-home-search-fill ring-1 ring-border/40">
      <header className="flex items-center justify-between gap-3 px-4 py-3.5 min-[720px]:px-5">
        <div className="flex items-center gap-2">
          <AccentMark />
          <h2 className="text-base font-bold leading-6 text-primary-700">
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
          className="size-8 shrink-0 text-primary-700 hover:bg-transparent hover:text-primary-700"
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
          {FIXED_BAR_CHARTS.map((chart) => (
            <ChartCard
              key={chart.id}
              title={t(chart.titleKey)}
              period={periods[chart.id]}
              onPeriodChange={(period) => setPeriod(chart.id, period)}
              headerLayout="split"
            >
              <NotificationsBarChart
                data={chart.getSeries(periods[chart.id])}
                barColor={chart.barColor}
                showValueLabels={chart.showValueLabels}
              />
            </ChartCard>
          ))}

          <div className="grid grid-cols-1 gap-4 min-[960px]:grid-cols-2 min-[960px]:gap-5">
            {FIXED_DONUT_CHARTS.map((chart) => (
              <ChartCard
                key={chart.id}
                title={t(chart.titleKey)}
                period={periods[chart.id]}
                onPeriodChange={(period) => setPeriod(chart.id, period)}
                footer={chart.showTotal ? totalLabel : undefined}
                className="min-w-0"
              >
                <NotificationsDonutChart
                  data={chart.getSlices()}
                  primaryColor={chart.primaryColor}
                  otherColor={chart.otherColor}
                  centerPercent={chart.centerPercent}
                  centerLabel={t(chart.centerLabelKey)}
                  legend={chart.legend.map((item) => ({
                    label: t(item.labelKey),
                    value: formatChartLegendValue(item.display),
                    color: item.color,
                  }))}
                />
              </ChartCard>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
