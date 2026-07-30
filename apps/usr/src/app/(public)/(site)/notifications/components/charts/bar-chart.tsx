'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { BarPoint } from '@notifications/data/charts';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type NotificationsBarChartProps = {
  data: BarPoint[];
  barColor: string;
  showValueLabels?: boolean;
  className?: string;
};

export function NotificationsBarChart({
  data,
  barColor,
  showValueLabels = false,
  className,
}: NotificationsBarChartProps) {
  return (
    <div className={cn('h-[240px] w-full', className)} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: showValueLabels ? 28 : 12,
            right: 12,
            left: 4,
            bottom: 4,
          }}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--color-border)"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--color-content-muted)', fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={32}
            tick={{ fill: 'var(--color-content-muted)', fontSize: 11 }}
            tickFormatter={(value: number) => formatFaNumber(value)}
          />
          <Tooltip
            cursor={{ fill: 'color-mix(in oklab, var(--color-content) 8%, transparent)' }}
            formatter={(value: number) => formatFaNumber(value)}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-content)',
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="value"
            fill={barColor}
            radius={[4, 4, 0, 0]}
            maxBarSize={18}
          >
            {showValueLabels ? (
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value: number) => formatFaNumber(value)}
                className="fill-[var(--color-content-muted)] text-[10px]"
              />
            ) : null}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
