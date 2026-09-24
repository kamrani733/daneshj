import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

type RepliesToggleProps = {
  expanded: boolean;
  label: string;
  onToggle: () => void;
  className?: string;
};

export function RepliesToggle({
  expanded,
  label,
  onToggle,
  className,
}: RepliesToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className={cn(
        'inline-flex h-9 w-fit items-center gap-1 rounded-full border border-outline-variant px-3 text-label-large font-medium text-on-surface-variant',
        className
      )}
    >
      <ChevronDown
        className={cn('size-4 transition-transform', expanded && 'rotate-180')}
        aria-hidden
      />
      {label}
    </button>
  );
}
