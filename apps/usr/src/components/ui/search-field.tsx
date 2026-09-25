'use client';

import { Search } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const SIZE_STYLES = {
  sm: {
    wrap: 'h-10',
    input: 'text-sm',
    icon: 'size-5 start-3',
    pad: 'ps-10 pe-4',
  },
  md: {
    wrap: 'h-11',
    input: 'text-sm min-[834px]:text-base',
    icon: 'size-5 start-3.5',
    pad: 'ps-11 pe-4',
  },
  lg: {
    wrap: 'h-12',
    input: 'text-base',
    icon: 'size-5 start-4',
    pad: 'ps-12 pe-5',
  },
  xl: {
    wrap: 'h-14',
    input: 'text-base',
    icon: 'size-6 start-4',
    pad: 'ps-12 pe-5',
  },
} as const;

const VARIANT_STYLES = {
  default: {
    wrap: '',
    input:
      'rounded-full border border-app-filter-border bg-app-search-fill text-app-filter-ink placeholder:text-app-filter-muted focus-visible:border-app-filter-border dark:border-app-filter-border dark:bg-app-search-fill dark:text-app-filter-ink dark:placeholder:text-app-filter-muted dark:focus-visible:border-app-filter-border',
    icon: 'text-app-filter-muted',
  },
  panelComments: {
    wrap: '',
    input:
      'rounded-full border border-outline-variant bg-surface-container-low text-body-large text-on-surface placeholder:text-on-surface-variant focus-visible:border-outline-variant focus-visible:ring-2 focus-visible:ring-primary/20',
    icon: 'text-on-surface-variant',
  },
} as const;

export type SearchFieldProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'size'
> & {
  /** Accessible label (visually hidden). */
  label: string;
  size?: keyof typeof SIZE_STYLES;
  variant?: keyof typeof VARIANT_STYLES;
  containerClassName?: string;
};

/**
 * Shared pill search field — Figma Search bar (#191:6227):
 * fill #f8f8f0 · border #bfc9c1 · icon/placeholder #404943
 */
export const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      label,
      size = 'sm',
      variant = 'default',
      className,
      containerClassName,
      dir = 'rtl',
      ...props
    },
    ref
  ) => {
    const styles = SIZE_STYLES[size];
    const variantStyles = VARIANT_STYLES[variant];
    const resolvedSize = variant === 'panelComments' ? SIZE_STYLES.lg : styles;

    return (
      <label
        className={cn(
          'relative block w-full',
          resolvedSize.wrap,
          variantStyles.wrap,
          containerClassName
        )}
      >
        <span className="sr-only">{label}</span>
        <Search
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2',
            resolvedSize.icon,
            variantStyles.icon
          )}
          strokeWidth={1.5}
          aria-hidden
        />
        <input
          ref={ref}
          type="search"
          dir={dir}
          className={cn(
            'h-full w-full text-start font-medium shadow-none outline-none',
            'focus-visible:ring-0',
            '[&::-webkit-search-cancel-button]:appearance-none',
            variantStyles.input,
            resolvedSize.input,
            resolvedSize.pad,
            className
          )}
          {...props}
        />
      </label>
    );
  }
);
SearchField.displayName = 'SearchField';
