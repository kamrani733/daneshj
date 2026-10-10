'use client';

import type { ReactNode } from 'react';

import { ChartCard, DonutChart } from '@/components/charts';
import { formatFaNumber } from '@/lib/format-fa';

import type { ChartsDonutView } from '@notifications/types/api';
import { formatChartLegendValue } from '@notifications/utils/format-chart-legend';

type NotificationsDonutCardProps = {
  title: string;
  view: ChartsDonutView;
  actions: ReactNode;
  footer?: string;
  className?: string;
};

/** Notifications report donut (API view model) on the shared chart card. */
export function NotificationsDonutCard({ title, view, actions, footer, className }: NotificationsDonutCardProps) {
  return (
    <ChartCard title={title} actions={actions} footer={footer} className={className}>
      <DonutChart
        percent={view.centerPercent}
        tone={view.tone}
        centerValue={`${formatFaNumber(view.centerPercent)}٪`}
        centerLabel={view.centerLabel}
        legend={view.legend.map((item) => ({
          label: item.label,
          value: formatChartLegendValue(item.display),
          tone: item.tone,
        }))}
      />
    </ChartCard>
  );
}
