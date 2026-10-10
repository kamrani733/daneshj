'use client';

import { useTranslations } from 'next-intl';

import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

/** Decorative bars-in-a-circle drawn with tokens (Figma comparison illustration). */
export function ComparisonIllustration({ className }: { className?: string }) {
  const bars = [
    { tone: 'bg-secondary/50', height: 'h-8' },
    { tone: 'bg-secondary/50', height: 'h-12' },
    { tone: 'bg-secondary/50', height: 'h-10' },
    { tone: 'bg-primary/50', height: 'h-10' },
    { tone: 'bg-primary/50', height: 'h-14' },
    { tone: 'bg-primary/50', height: 'h-12' },
  ];
  return (
    <div aria-hidden className={cn('relative flex h-36 w-48 items-end justify-center', className)}>
      <span className="absolute top-0 size-28 rounded-full bg-surface-container" />
      <div className="relative flex items-end gap-2 border-b border-outline-variant px-2">
        {bars.map((bar, index) => (
          <span key={index} className={cn('w-4 rounded-t-extra-small', bar.tone, bar.height, index === 2 && 'me-4')} />
        ))}
      </div>
    </div>
  );
}

/** No statistic picked yet: title, hint, illustration and the three numbered steps. */
export function ComparisonEmptyState() {
  const t = useTranslations('operationalPanel.charts.comparison');
  const steps = [
    { label: t('steps.stat'), tone: 'bg-info-subtle text-info' },
    { label: t('steps.groupA'), tone: 'bg-primary-container text-primary' },
    { label: t('steps.groupB'), tone: 'bg-secondary-container text-secondary' },
  ];

  return (
    <div className="flex flex-col items-center gap-4 rounded-medium bg-surface-container-lowest px-4 py-8 text-center shadow-app-elevation-1">
      <h3 className="text-title-medium font-bold text-on-surface">{t('emptyTitle')}</h3>
      <p className="rounded-small bg-surface-container-low px-3 py-1 text-label-small text-outline">{t('emptyBadge')}</p>
      <ComparisonIllustration />
      <p className="max-w-80 text-body-small text-on-surface-variant">{t('emptyHint')}</p>
      <ol className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        {steps.map((step, index) => (
          <li key={step.label} className="flex items-center gap-2 text-label-small text-on-surface-variant">
            {index > 0 ? <span aria-hidden>←</span> : null}
            <span
              aria-hidden
              className={cn('inline-flex size-5 items-center justify-center rounded-full font-bold', step.tone)}
            >
              {formatFaNumber(index + 1)}
            </span>
            {step.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
