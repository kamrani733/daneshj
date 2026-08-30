'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type UnderlineFieldProps = Omit<
  ComponentPropsWithoutRef<typeof Input>,
  'className'
> & {
  label: string;
  supporting?: string;
  className?: string;
  inputClassName?: string;
};

/**
 * Material-style underline field used in filter ranges.
 * Composes shadcn Input; owns layout only.
 */
export const UnderlineField = forwardRef<HTMLInputElement, UnderlineFieldProps>(
  function UnderlineField(
    { label, supporting, className, inputClassName, ...props },
    ref
  ) {
    return (
      <label className={cn('flex w-full max-w-[200px] flex-col items-stretch gap-0', className)}>
        <span className="sr-only">{label}</span>
        <Input
          ref={ref}
          placeholder={label}
          className={cn(
            'h-14 rounded-t rounded-b-none border-0 border-b border-app-filter bg-app-card px-4 shadow-none',
            'text-end text-base leading-6 text-app-filter-ink',
            'placeholder:text-app-filter-muted',
            'focus-visible:border-app-filter focus-visible:ring-2 focus-visible:ring-primary/30',
            inputClassName
          )}
          {...props}
        />
        {supporting ? (
          <span className="px-4 pt-1 text-xs leading-4 tracking-[0.0083em] text-app-filter-muted">
            {supporting}
          </span>
        ) : null}
      </label>
    );
  }
);
