'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { SectionHeading } from '@/components/ui/section-heading';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type CatalogSectionProps = {
  title: string;
  count: number;
  children: ReactNode;
  className?: string;
  gridClassName?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
};

/** Catalog block with title, count, and view-all link. */
export function CatalogSection({
  title,
  count,
  children,
  className,
  gridClassName,
  viewAllLabel,
  viewAllHref = '#',
}: CatalogSectionProps) {
  return (
    <section
      className={cn('flex w-full flex-col items-stretch gap-8', className)}
    >
      <SectionHeading
        title={`${title} (${formatFaNumber(count)})`}
        tone="secondary"
        size="title"
        as="h4"
        align="start"
        className="self-start"
      />

      <div className={cn('grid gap-4', gridClassName)}>
        {children}
      </div>

      {viewAllLabel ? (
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 self-end text-base font-bold leading-6 tracking-[0.0094em] text-secondary transition-opacity hover:opacity-80"
        >
          {viewAllLabel}
          <ChevronLeft className="size-5" aria-hidden />
        </Link>
      ) : null}
    </section>
  );
}
