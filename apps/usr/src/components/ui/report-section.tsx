'use client';

import { ChevronDown } from 'lucide-react';
import { useId, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ReportSectionProps = {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
};

/**
 * Collapsible report card — Figma «گزارش …» blocks (operational panel, notifications reports):
 * orange bar + title + chevron next to the title; body below while open.
 */
export function ReportSection({ title, open, onOpenChange, children, className }: ReportSectionProps) {
  const bodyId = useId();

  return (
    <section
      className={cn('flex flex-col rounded-large bg-surface-container-low shadow-app-elevation-1', className)}
    >
      <h2 className="flex px-4 py-4 min-[720px]:px-6 min-[720px]:py-6">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => onOpenChange(!open)}
          className="flex min-w-0 items-center gap-6 rounded-small text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span aria-hidden className="h-4.5 w-1.5 shrink-0 rounded-extra-small bg-secondary" />
            <span className="text-title-small font-bold text-on-primary-container min-[720px]:text-title-medium">
              {title}
            </span>
          </span>
          <ChevronDown
            aria-hidden
            className={cn('size-6 shrink-0 text-on-surface-variant transition-transform', open && 'rotate-180')}
            strokeWidth={1.75}
          />
        </button>
      </h2>

      {open ? (
        <div id={bodyId} className="flex flex-col gap-2 px-2 pb-4 min-[720px]:px-4">
          {children}
        </div>
      ) : null}
    </section>
  );
}
