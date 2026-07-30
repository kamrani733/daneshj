import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type StatIconTileProps = {
  icon: LucideIcon;
  className?: string;
};

/** Light-green icon tile used on stats KPI cards. */
export function StatIconTile({ icon: Icon, className }: StatIconTileProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary-700 dark:bg-primary-800 dark:text-primary-100',
        className
      )}
    >
      <Icon className="size-5" strokeWidth={1.5} />
    </span>
  );
}
