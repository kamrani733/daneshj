import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type CatalogOfferCardShellProps = {
  children: ReactNode;
  className?: string;
};

/** Shared surface for discount / news / newsletter catalog cards. */
export function CatalogOfferCardShell({
  children,
  className,
}: CatalogOfferCardShellProps) {
  return (
    <article
      dir="rtl"
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-border/40 bg-home-card shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:bg-home-search-category',
        className
      )}
    >
      {children}
    </article>
  );
}
