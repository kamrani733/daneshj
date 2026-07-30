'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type CatalogSectionProps = {
  title: string;
  count: number;
  children: ReactNode;
  className?: string;
  gridClassName?: string;
};

/** Horizontal catalog block with title count + «مشاهده همه». */
export function CatalogSection({
  title,
  count,
  children,
  className,
  gridClassName,
}: CatalogSectionProps) {
  const t = useTranslations('publicPanel');

  return (
    <section className={cn('flex w-full flex-col gap-4', className)}>
      <h3 className="text-base font-bold leading-6 text-primary">
        {title} ({count})
      </h3>

      <div className={cn('grid gap-4', gridClassName)}>{children}</div>

      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm font-medium text-warning hover:underline"
        >
          {t('viewAll')}
        </button>
      </div>
    </section>
  );
}
