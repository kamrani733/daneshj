'use client';

import { useState, type ReactNode } from 'react';

import { ReportSection } from '@/components/ui/report-section';

import { ChartItem } from '@operational-panel/components/chart-item';
import type { ChartDefinition } from '@operational-panel/utils/chart-definitions';
import type { DateRange } from '@operational-panel/utils/date-range-params';

type ChartSectionProps = {
  title: string;
  charts: ChartDefinition[];
  range: DateRange;
};

/** Collapsible «نمودارهای بخش …» card: full-width bar charts, then donuts two per row when there is room. */
export function ChartSection({ title, charts, range }: ChartSectionProps) {
  const [open, setOpen] = useState(true);
  const bars = charts.filter((chart) => chart.type !== 'donut');
  const donuts = charts.filter((chart) => chart.type === 'donut');

  return (
    <ReportSection title={title} open={open} onOpenChange={setOpen}>
      <ChartLayout
        bars={bars.map((chart) => (
          <ChartItem key={chart.id} chart={chart} range={range} />
        ))}
        donuts={donuts.map((chart) => (
          <ChartItem key={chart.id} chart={chart} range={range} className="min-w-0" />
        ))}
      />
    </ReportSection>
  );
}

/** Shared layout for mocked and notifications chart sections. */
export function ChartLayout({ bars, donuts }: { bars: ReactNode[]; donuts: ReactNode[] }) {
  return (
    <div className="@container flex flex-col gap-4 min-[720px]:gap-6">
      {bars}
      {donuts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 @min-[44rem]:grid-cols-2 min-[720px]:gap-6">{donuts}</div>
      ) : null}
    </div>
  );
}
