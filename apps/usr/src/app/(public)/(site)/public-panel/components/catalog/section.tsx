'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { TitleUnderline } from '../shared/title-underline';

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
  const t = useTranslations('publicPanel');

  return (
    <section
      className={cn('flex w-full flex-col items-stretch gap-8', className)}
    >
      <div className="flex w-full flex-col items-end">
        <div className="flex w-fit flex-col items-stretch gap-2 px-4">
          <h3 className="px-2 text-end text-lg font-bold leading-6 text-[#005138]">
            {title} ({count})
          </h3>
          <TitleUnderline />
        </div>
      </div>

      <div className={cn('grid gap-4', gridClassName)} dir="ltr">
        {children}
      </div>

      <div className="flex w-full justify-start" dir="ltr">
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
