import { ArrowDown, ArrowUp } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type StatIcon = ComponentType<{ className?: string }>;

export type StatTrendInfo = {
  direction: 'up' | 'down';
  /** Already formatted, e.g. «۱۸٪ نسبت به دوره‌ی قبل». */
  label: string;
};

const CARD =
  'flex h-full flex-col rounded-medium bg-surface-container-lowest p-4 shadow-app-elevation-1 min-[720px]:p-5';

/** 40 px tinted tile with the stat icon (Figma stats KPI). */
export function StatIconTile({ icon: Icon }: { icon: StatIcon }) {
  return (
    <span
      aria-hidden
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-medium bg-state-primary-10 text-primary"
    >
      <Icon className="size-5" />
    </span>
  );
}

/** Period-over-period line under a KPI — «↑ ۱۸٪ نسبت به دوره‌ی قبل». */
export function StatTrend({ trend, className }: { trend: StatTrendInfo; className?: string }) {
  const Arrow = trend.direction === 'up' ? ArrowUp : ArrowDown;
  return (
    <p className={cn('flex items-center gap-1 text-secondary', className)}>
      <Arrow className="size-3 shrink-0" strokeWidth={2} aria-hidden />
      {/* Type token outside `cn()`: tailwind-merge reads custom sizes as colours. */}
      <span className="text-label-small font-medium">{trend.label}</span>
    </p>
  );
}

type StatCountCardProps = {
  icon: StatIcon;
  label: string;
  /** Already formatted (Persian digits). */
  value: string;
  /** Small unit after the value, e.g. «دقیقه». */
  unit?: string;
  /** Small line above the value, e.g. the most frequent interaction «پسندیدن». */
  caption?: string;
  trend?: StatTrendInfo;
  className?: string;
};

/** Count KPI — icon tile at the start, value next to it, label and trend below. */
export function StatCountCard({ icon, label, value, unit, caption, trend, className }: StatCountCardProps) {
  return (
    <article className={cn(CARD, 'gap-2', className)}>
      <div className="flex items-start gap-3">
        <StatIconTile icon={icon} />
        <div className="flex min-w-0 flex-col">
          {caption ? <span className="text-label-large font-bold text-on-surface">{caption}</span> : null}
          <p className="flex items-baseline gap-1 text-on-surface">
            <span className="text-headline-large font-bold tabular-nums">{value}</span>
            {unit ? <span className="text-label-medium">{unit}</span> : null}
          </p>
        </div>
      </div>
      <h3 className="text-body-small text-outline">{label}</h3>
      {trend ? <StatTrend trend={trend} className="mt-auto pt-1" /> : null}
    </article>
  );
}

type StatRatioCardProps = {
  icon: StatIcon;
  label: string;
  /** Already formatted, e.g. «۱٬۸۹۴ از ۲٬۵۵۷». */
  fraction?: string;
  /** 0–100. */
  percent: number;
  /** Already formatted, e.g. «۷۴٪». */
  percentLabel: string;
  trend?: StatTrendInfo;
  footer?: ReactNode;
  className?: string;
};

/** Ratio KPI — icon + label, divider, «x از y», big percent, progress bar, trend. */
export function StatRatioCard({
  icon,
  label,
  fraction,
  percent,
  percentLabel,
  trend,
  footer,
  className,
}: StatRatioCardProps) {
  const width = Math.min(Math.max(percent, 0), 100);

  return (
    <article className={cn(CARD, 'gap-3', className)}>
      <div className="flex items-center gap-3">
        <StatIconTile icon={icon} />
        <h3 className="min-w-0 flex-1 text-body-small text-on-surface-variant">{label}</h3>
      </div>
      <div aria-hidden className="h-px w-full bg-outline-variant" />
      {fraction ? <p className="text-label-large font-bold text-primary">{fraction}</p> : null}
      <p className="text-display-small font-bold tabular-nums text-primary">{percentLabel}</p>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(width)}
        aria-label={label}
        // Figma fills from the left, as in the notifications stats export.
        dir="ltr"
        className="h-1.5 w-full overflow-hidden rounded-full bg-outline-variant"
      >
        {/* Runtime-computed fill width. */}
        <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
      </div>
      {trend ? <StatTrend trend={trend} className="mt-auto" /> : null}
      {footer}
    </article>
  );
}
