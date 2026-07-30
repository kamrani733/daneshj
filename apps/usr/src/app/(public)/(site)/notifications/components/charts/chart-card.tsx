'use client';

import type { ReactNode } from 'react';

import type { ChartPeriod } from '@notifications/data/charts-mock';
import { cn } from '@/lib/utils';

import { ChartPeriodToggle } from './period-toggle';

export type ChartCardHeaderLayout = 'stack' | 'split';

type ChartCardProps = {
  title: string;
  period: ChartPeriod;
  onPeriodChange: (value: ChartPeriod) => void;
  footer?: string;
  /** split: title left · period toggles right (bar charts) */
  headerLayout?: ChartCardHeaderLayout;
  className?: string;
  children: ReactNode;
};

/** White chart card with period filter header. */
export function ChartCard({
  title,
  period,
  onPeriodChange,
  footer,
  headerLayout = 'stack',
  className,
  children,
}: ChartCardProps) {
  const isSplit = headerLayout === 'split';

  return (
    <article
      className={cn(
        '@container/chart flex h-full flex-col gap-4 rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-border/30 dark:bg-home-search-category dark:ring-border/50 min-[720px]:gap-5 min-[720px]:px-5 min-[720px]:py-6',
        className
      )}
    >
      <div
        dir={isSplit ? 'ltr' : undefined}
        className={cn(
          isSplit
            ? 'flex flex-wrap items-center justify-between gap-x-4 gap-y-3'
            : 'flex flex-col items-center gap-3 text-center'
        )}
      >
        <h3
          dir="rtl"
          className={cn(
            'text-sm font-medium leading-6 text-primary-700 dark:text-primary-100',
            isSplit && 'min-w-0 flex-1'
          )}
        >
          {title}
        </h3>
        <ChartPeriodToggle
          value={period}
          onValueChange={onPeriodChange}
          className={cn(isSplit && 'ms-auto shrink-0')}
        />
      </div>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
      {footer ? (
        <p className="border-t border-border/60 pt-3 text-start text-xs font-medium text-neutral-500 dark:text-muted-foreground">
          {footer}
        </p>
      ) : null}
    </article>
  );
}
