import { cn } from '@/lib/utils';

type AccentMarkProps = {
  className?: string;
  /** page title uses taller mark; section headers use compact */
  size?: 'md' | 'lg';
};

/** Shared orange accent bar for page/section headings. */
export function AccentMark({ className, size = 'md' }: AccentMarkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block shrink-0 bg-warning-400 dark:bg-warning-100',
        size === 'lg'
          ? 'h-8 w-2 rounded-[2px]'
          : 'h-5 w-1.5 rounded-full',
        className
      )}
    />
  );
}
