import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type BorderedSectionCardProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** Matches parent surface so the floating title punches a hole in the border. */
  titleBgClassName?: string;
  titleClassName?: string;
};

/** Card with floating title on the top border. */
export function BorderedSectionCard({
  title,
  children,
  footer,
  className,
  titleBgClassName = 'bg-home-scene',
  titleClassName,
}: BorderedSectionCardProps) {
  return (
    <section
      className={cn(
        'relative flex w-full flex-col gap-2 rounded-2xl border px-6 pb-6 pt-6',
        className
      )}
    >
      <h3
        className={cn(
          'absolute -top-2.5 start-4 px-1 text-sm font-bold leading-5 tracking-[0.0071em] text-primary',
          'dark:!bg-home-search-category',
          titleBgClassName,
          titleClassName
        )}
      >
        {title}
      </h3>
      <div className="min-h-[64px] flex-1 text-start">{children}</div>
      {footer ? (
        <div className="flex justify-end pt-0.5">{footer}</div>
      ) : null}
    </section>
  );
}
