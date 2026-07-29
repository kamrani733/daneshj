import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type BorderedSectionCardProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/** Figma «درباره من» — floating title on top border. */
export function BorderedSectionCard({
  title,
  children,
  footer,
  className,
}: BorderedSectionCardProps) {
  return (
    <section
      className={cn(
        'relative flex w-full flex-col gap-3 rounded-xl border border-primary/40 px-4 pb-3 pt-5',
        className
      )}
    >
      <h3 className="absolute -top-2.5 end-4 bg-[#FCFAF7] px-1.5 text-sm font-medium leading-5 text-primary dark:bg-home-search-category">
        {title}
      </h3>
      <div className="min-h-[72px] text-end text-sm leading-6 tracking-[0.0071em]">
        {children}
      </div>
      {footer ? (
        <div className="flex justify-start pt-1">{footer}</div>
      ) : null}
    </section>
  );
}
