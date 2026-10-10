'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { BarChart, ChartCard, ChartPeriodToggle, DonutChart, type ChartPeriod } from '@/components/charts';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { formatFaNumber } from '@/lib/format-fa';

import { useChartQuery } from '@operational-panel/hooks/use-chart-queries';
import type { ChartDefinition } from '@operational-panel/utils/chart-definitions';
import type { DateRange } from '@operational-panel/utils/date-range-params';

type ChartItemProps = {
  chart: ChartDefinition;
  range: DateRange;
  className?: string;
};

/** One «نمودار» card with its own period chips (default «روز», as in the export). */
export function ChartItem({ chart, range, className }: ChartItemProps) {
  const t = useTranslations('operationalPanel.charts');
  const [period, setPeriod] = useState<ChartPeriod>('day');
  const query = useChartQuery(chart.id, period, range, true);
  const title = t(`titles.${chart.id}`);
  const data = query.data;

  let body;
  if (query.isError) {
    body = (
      <div role="alert" className="flex h-56 flex-col items-center justify-center gap-3 text-center">
        <p className="text-body-medium text-on-surface-variant">{t('error')}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => void query.refetch()}>
          {t('retry')}
        </Button>
      </div>
    );
  } else if (!data) {
    body = (
      <div role="status" className="flex h-56 items-center justify-center">
        <Spinner className="size-7 text-primary" aria-label={t('loading')} />
      </div>
    );
  } else if (data.kind === 'donut' && chart.type === 'donut') {
    const highlight = t(`legends.${chart.legend}.highlight`);
    const percentLabel = (value: number) => `${formatFaNumber(value)}٪`;
    body = (
      <DonutChart
        percent={data.percent}
        tone={chart.tone}
        centerValue={percentLabel(data.percent)}
        centerLabel={highlight}
        legend={[
          { label: highlight, value: percentLabel(data.percent), tone: chart.tone },
          { label: t(`legends.${chart.legend}.rest`), value: percentLabel(100 - data.percent), tone: null },
        ]}
      />
    );
  } else if (data.kind === 'bar') {
    body = (
      <BarChart
        data={data.points}
        series={
          chart.type === 'groupedBar'
            ? chart.series.map((item) => ({ key: item.key, label: t(`series.${item.key}`), tone: item.tone }))
            : [{ key: 'value', label: title, tone: chart.type === 'bar' ? chart.tone : 'primary' }]
        }
        fadeLast
        valueUnit={chart.type === 'bar' && chart.valueUnit ? t(`units.${chart.valueUnit}`) : undefined}
      />
    );
  }

  return (
    <ChartCard
      title={title}
      actions={<ChartPeriodToggle value={period} onValueChange={setPeriod} />}
      footer={
        chart.type === 'donut' && data?.kind === 'donut'
          ? t('total', { count: formatFaNumber(data.total), unit: t(`totals.${chart.total}`) })
          : undefined
      }
      className={className}
    >
      {body}
    </ChartCard>
  );
}
