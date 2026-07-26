import { cn } from '@/lib/utils';

type AccentMarkProps = {
  className?: string;
  /** page title uses taller mark; section headers use compact */
  size?: 'md' | 'lg';
};

/** Shared orange accent bar used across notifications headings. */
export function AccentMark({ className, size = 'md' }: AccentMarkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block shrink-0 bg-warning-400',
        size === 'lg'
          ? 'h-8 w-2 rounded-[2px]'
          : 'h-5 w-1.5 rounded-full',
        className
      )}
    />
  );
}
