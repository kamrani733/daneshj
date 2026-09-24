import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type StatItemProps = {
  value: string;
  label: string;
  icon?: LucideIcon | ReactNode;
  onClick?: () => void;
  className?: string;
};

export function StatItem({
  value,
  label,
  icon,
  onClick,
  className,
}: StatItemProps) {
  const Icon = typeof icon === 'function' ? icon : null;
  const content = (
    <>
      <span className="text-headline-medium font-bold text-on-surface">{value}</span>
      <span className="inline-flex items-center gap-1 text-label-large font-medium text-on-surface-variant">
        {Icon ? <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden /> : icon}
        {label}
      </span>
    </>
  );

  const shared = cn(
    'flex min-w-0 flex-col items-center gap-1 text-center',
    className
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={shared}>
        {content}
      </button>
    );
  }

  return <div className={shared}>{content}</div>;
}
