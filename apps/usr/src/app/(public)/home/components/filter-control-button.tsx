'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type FilterControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ReactNode;
  active?: boolean;
};


export const FilterControlButton = forwardRef<
  HTMLButtonElement,
  FilterControlButtonProps
>(function FilterControlButton(
  { label, icon, active = false, className, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      title={label}
      aria-label={label}
      dir="rtl"
      className={cn(
        'inline-flex items-center justify-center gap-1 rounded-lg px-2 py-4',
        'text-base font-bold leading-6 tracking-[0.0094em] text-home-filter-ink',
        'transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        'dark:hover:bg-white/10',
        active && 'bg-black/5 text-primary dark:bg-white/10',
        className
      )}
      {...props}
    >
      <span className="inline-flex size-6 shrink-0 items-center justify-center text-home-filter-ink [&_svg]:size-6">
        {icon}
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
});
