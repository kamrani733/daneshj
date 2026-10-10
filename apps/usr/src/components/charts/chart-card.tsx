import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ChartCardProps = {
  title: string;
  /** Usually `<ChartPeriodToggle />`; sits at the end of the title row. */
  actions?: ReactNode;
  /** Small line under the chart, e.g. «مجموع: ۲٬۵۵۷ درخواست». */
  footer?: string;
  className?: string;
  children: ReactNode;
};

/** White chart card — title at the start, period chips at the end, chart, optional footer. */
export function ChartCard({ title, actions, footer, className, children }: ChartCardProps) {
  return (
    <article
      className={cn(
        '@container/chart flex h-full flex-col gap-4 rounded-medium bg-surface-container-lowest p-4 shadow-app-elevation-1 min-[720px]:p-5',
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <h3 className="min-w-0 flex-1 basis-40 text-title-small font-bold text-on-surface">{title}</h3>
        {actions}
      </div>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
      {footer ? (
        <p className="border-t border-outline-variant pt-3 text-label-small text-outline">{footer}</p>
      ) : null}
    </article>
  );
}
