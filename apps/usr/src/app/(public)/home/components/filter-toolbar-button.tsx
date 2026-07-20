'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type FilterToolbarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Accessible name + native tooltip (Figma rich tooltip). */
  label: string;
  active?: boolean;
  children: ReactNode;
};

/**
 * Figma Icon button — fixed 56×56, icon 24×24, radius full.
 * Label is aria + title only (Filtering / Sorting tooltips).
 */
export const FilterToolbarButton = forwardRef<
  HTMLButtonElement,
  FilterToolbarButtonProps
>(function FilterToolbarButton(
  { label, active = false, className, children, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      title={label}
      aria-label={label}
      className={cn(
        'inline-flex size-14 shrink-0 items-center justify-center rounded-full',
        'text-home-filter-ink transition-colors',
        'hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        'dark:hover:bg-white/10',
        active && 'bg-black/5 text-primary dark:bg-white/10',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
