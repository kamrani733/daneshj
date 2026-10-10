'use client';

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { CHART_TONE_BG, CHART_TONE_COLOR, type ChartTone } from '@/components/charts/types';
import { formatFaNumber } from '@/lib/format-fa';
import { toFaDigits } from '@/lib/jalali';
import { cn } from '@/lib/utils';

export type BarSeries = {
  key: string;
  label: string;
  tone: ChartTone;
};

export type BarDatum = { label: string } & Record<string, number | string>;

type BarChartProps = {
  data: BarDatum[];
  /** One series, or two for grouped comparisons (legend shown under the chart). */
  series: BarSeries[];
  /** Value above each bar (Figma shows them on most bar charts). */
  showValueLabels?: boolean;
  /** The last point is the running period — drawn faded. */
  fadeLast?: boolean;
  /** Small unit above the value axis, e.g. «ساعت». */
  valueUnit?: string;
  className?: string;
};

const AXIS_TICK = { fill: 'var(--color-outline)', fontSize: 10 };

/** Vertical bar chart (Recharts) on palette tokens; LTR plot area, RTL legend. */
export function BarChart({
  data,
  series,
  showValueLabels = true,
  fadeLast = false,
  valueUnit,
  className,
}: BarChartProps) {
  const dense = data.length > 12;

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {valueUnit ? <span className="text-label-small text-outline">{valueUnit}</span> : null}
      <div className="h-56 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: showValueLabels ? 20 : 8, right: 4, left: 0, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid vertical={false} stroke="var(--color-outline-variant)" strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={AXIS_TICK}
              interval={dense ? 'preserveStartEnd' : 0}
              minTickGap={dense ? 12 : 0}
              tickFormatter={(value: string) => toFaDigits(value)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={36}
              tick={AXIS_TICK}
              tickFormatter={(value: number) => formatFaNumber(value)}
            />
            <Tooltip
              cursor={{ fill: 'var(--color-state-primary-10)' }}
              formatter={(value: number, name: string) => [
                formatFaNumber(value),
                series.find((item) => item.key === name)?.label ?? name,
              ]}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid var(--color-outline-variant)',
                background: 'var(--color-surface-container-lowest)',
                color: 'var(--color-on-surface)',
                fontSize: 12,
                direction: 'rtl',
              }}
            />
            {series.map((item) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                fill={CHART_TONE_COLOR[item.tone]}
                radius={[2, 2, 0, 0]}
                maxBarSize={dense ? 10 : 48}
              >
                {fadeLast
                  ? data.map((point, index) => (
                      <Cell key={point.label} fillOpacity={index === data.length - 1 ? 0.45 : 1} />
                    ))
                  : null}
                {showValueLabels ? (
                  <LabelList
                    dataKey={item.key}
                    position="top"
                    fill={CHART_TONE_COLOR[item.tone]}
                    fontSize={dense ? 8 : 10}
                    fontWeight={700}
                    formatter={(value: number) => formatFaNumber(value)}
                  />
                ) : null}
              </Bar>
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
      {series.length > 1 ? (
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {series.map((item) => (
            <li key={item.key} className="flex items-center gap-2 text-label-small text-on-surface-variant">
              <span aria-hidden className={cn('size-2 rounded-full', CHART_TONE_BG[item.tone])} />
              {item.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
