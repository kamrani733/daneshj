'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import type { DonutSlice } from '@notifications/data/charts-mock';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type LegendItem = {
  label: string;
  value: string;
  color: string;
};

type NotificationsDonutChartProps = {
  data: DonutSlice[];
  primaryColor: string;
  otherColor?: string;
  centerPercent: number;
  centerLabel: string;
  centerColor?: string;
  legend: LegendItem[];
  showPlus?: boolean;
  className?: string;
};

export function NotificationsDonutChart({
  data,
  primaryColor,
  otherColor = 'var(--color-neutral-300)',
  centerPercent,
  centerLabel,
  centerColor,
  legend,
  showPlus = false,
  className,
}: NotificationsDonutChartProps) {
  const colors = {
    primary: primaryColor,
    other: otherColor,
  } as const;
  const percentColor = centerColor ?? primaryColor;

  return (
    <div
      dir="ltr"
      className={cn(
        'flex w-full flex-col items-center gap-5 @min-[380px]/chart:flex-row @min-[380px]/chart:justify-center @min-[380px]/chart:gap-6',
        className
      )}
    >
      <ul
        dir="rtl"
        className="flex min-w-[120px] flex-col gap-3 text-xs font-medium text-neutral-600"
      >
        {legend.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-6"
          >
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
            <span className="tabular-nums text-content">{item.value}</span>
          </li>
        ))}
      </ul>

      <div className="relative size-[168px] shrink-0" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="key"
              innerRadius={54}
              outerRadius={76}
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((slice) => (
                <Cell key={slice.key} fill={colors[slice.key]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className="text-xl font-bold leading-7"
            style={{ color: percentColor }}
          >
            {showPlus ? '+ ' : ''}
            {formatFaNumber(centerPercent)}٪
          </span>
          <span className="text-xs font-medium text-neutral-500">
            {centerLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
