import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type BorderedSectionCardProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** Matches parent surface so the floating title punches a hole in the border. */
  titleBg?: string;
};

/** Figma «درباره من» — floating title on top border. */
export function BorderedSectionCard({
  title,
  children,
  footer,
  className,
  titleBg = '#F9FAF4',
}: BorderedSectionCardProps) {
  return (
    <section
      className={cn(
        'relative flex w-full flex-col gap-2 rounded-[12px] border px-4 pb-3 pt-5',
        className
      )}
    >
      <h3
        className="absolute -top-2.5 end-4 px-1.5 text-sm font-medium leading-5 text-primary dark:!bg-home-search-category"
        style={{ backgroundColor: titleBg }}
      >
        {title}
      </h3>
      <div className="min-h-[64px] flex-1 text-start text-sm leading-6 tracking-[0.0071em]">
        {children}
      </div>
      {footer ? (
        <div className="flex justify-end pt-0.5">{footer}</div>
      ) : null}
    </section>
  );
}
