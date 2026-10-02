'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { SectionHeading } from '@/components/ui/section-heading';
import { formatFaNumber } from '@/lib/format-fa';

type CatalogSectionProps = {
  title: string;
  count: number;
  children: ReactNode;
  className?: string;
  gridClassName?: string;
};

/** Catalog block with title, count, and view-all link. */
export function CatalogSection({
  title,
  count,
  children,
  className,
  gridClassName,
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

      {/* «مشاهده همه» hidden until destination routes exist (plan §5.4). */}
    </section>
  );
}
