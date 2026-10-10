'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { CHART_TONE_BG, CHART_TONE_COLOR, CHART_TONE_TEXT, type ChartTone } from '@/components/charts/types';
import { cn } from '@/lib/utils';

export type DonutLegendItem = {
  label: string;
  /** Already formatted, e.g. «۷۴٪». */
  value: string;
  /** `null` = the remainder (neutral track colour). */
  tone: ChartTone | null;
};

type DonutChartProps = {
  /** 0–100 share of the highlighted slice. */
  percent: number;
  tone: ChartTone;
  /** Already formatted, e.g. «۷۴٪». */
  centerValue: string;
  centerLabel: string;
  legend: DonutLegendItem[];
  className?: string;
};

const TRACK = 'var(--color-surface-variant)';

/** Two-slice donut (highlight vs remainder) with centre percent and an RTL legend beside it. */
export function DonutChart({ percent, tone, centerValue, centerLabel, legend, className }: DonutChartProps) {
  const value = Math.min(Math.max(percent, 0), 100);
  const data = [
    { key: 'primary', value },
    { key: 'other', value: 100 - value },
  ];

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center gap-5 @min-[22rem]/chart:flex-row @min-[22rem]/chart:justify-between',
        className
      )}
    >
      <div className="relative size-40 shrink-0" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="key"
              innerRadius={52}
              outerRadius={76}
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {data.map((slice) => (
                <Cell key={slice.key} fill={slice.key === 'primary' ? CHART_TONE_COLOR[tone] : TRACK} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {/* Plain join, not `cn()`: tailwind-merge would drop the type token next to the colour. */}
          <span className={`text-title-large font-bold ${CHART_TONE_TEXT[tone]}`}>
            {centerValue}
          </span>
          <span className="text-label-small text-outline">{centerLabel}</span>
        </div>
      </div>

      <ul className="flex min-w-32 flex-col gap-3">
        {legend.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-6 text-label-small">
            <span className="inline-flex items-center gap-2 font-medium text-on-surface">
              <span
                aria-hidden
                className={cn('size-2 shrink-0 rounded-full', item.tone ? CHART_TONE_BG[item.tone] : 'bg-surface-variant')}
              />
              {item.label}
            </span>
            <span className="tabular-nums text-outline">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
