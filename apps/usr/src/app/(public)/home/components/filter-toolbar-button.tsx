'use client';

import type { LucideIcon } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FilterToolbarButtonProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  'variant' | 'size'
> & {
  icon: LucideIcon;
  label: string;
  active?: boolean;
};

/**
 * Shared filter/sort pill control — one composition for toolbar actions.
 */
export const FilterToolbarButton = forwardRef<
  HTMLButtonElement,
  FilterToolbarButtonProps
>(function FilterToolbarButton(
  { icon: Icon, label, active = false, className, ...props },
  ref
) {
  return (
    <Button
      ref={ref}
      type="button"
      variant="toolbar"
      size="pill"
      dir="rtl"
      className={cn(
        active && 'bg-black/5 text-primary dark:bg-white/10',
        className
      )}
      {...props}
    >
      <Icon className="size-6 shrink-0" strokeWidth={1.75} />
      <span>{label}</span>
    </Button>
  );
});
