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

export type SearchFieldProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'size'
> & {
  /** Accessible label (visually hidden). */
  label: string;
  size?: keyof typeof SIZE_STYLES;
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
      className,
      containerClassName,
      dir = 'rtl',
      ...props
    },
    ref
  ) => {
    const styles = SIZE_STYLES[size];

    return (
      <label className={cn('relative block w-full', styles.wrap, containerClassName)}>
        <span className="sr-only">{label}</span>
        <Search
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2 text-app-filter-muted',
            styles.icon
          )}
          strokeWidth={1.5}
          aria-hidden
        />
        <input
          ref={ref}
          type="search"
          dir={dir}
          className={cn(
            'h-full w-full rounded-full border border-app-filter-border bg-app-search-fill',
            'text-start font-medium text-app-filter-ink shadow-none outline-none',
            'placeholder:text-app-filter-muted',
            'focus-visible:border-app-filter-border focus-visible:ring-0',
            'dark:border-app-filter-border dark:bg-app-search-fill dark:text-app-filter-ink',
            'dark:placeholder:text-app-filter-muted dark:focus-visible:border-app-filter-border',
            '[&::-webkit-search-cancel-button]:appearance-none',
            styles.input,
            styles.pad,
            className
          )}
          {...props}
        />
      </label>
    );
  }
);
SearchField.displayName = 'SearchField';
