import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type PanelPageShellProps = {
  /** Breadcrumb + title block. */
  heading: ReactNode;
  /** Usually `<PanelNav />`. */
  nav: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

/** Panel page chrome: heading on top, then sidebar (start) + content (notifications, operational panel). */
export function PanelPageShell({ heading, nav, children, contentClassName }: PanelPageShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-341 flex-col gap-6 px-4 py-4 min-[1200px]:px-0">
      {heading}

      <div className="flex w-full flex-col gap-4 min-[720px]:flex-row min-[720px]:items-start min-[720px]:gap-6 min-[1200px]:gap-17.5">
        {nav}
        <section className={cn('min-w-0 flex-1', contentClassName)}>{children}</section>
      </div>
    </div>
  );
}
