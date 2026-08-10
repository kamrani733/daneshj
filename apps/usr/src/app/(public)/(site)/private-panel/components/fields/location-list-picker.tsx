'use client';

import { ChevronDown } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import type { GeoOption } from '@private-panel/data/geo';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type LocationListPickerProps = {
  label: ReactNode;
  options: GeoOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  className?: string;
};


export function LocationListPicker({
  label,
  options,
  value,
  placeholder = '',
  disabled,
  onChange,
  className,
}: LocationListPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label ?? '',
    [options, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            'relative flex h-12 w-full items-center rounded-lg border border-[#707973]',
            'bg-home-card px-3 pe-11 text-start dark:border-auth-input-border dark:bg-auth-input-bg',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
            disabled && 'cursor-not-allowed opacity-60',
            className
          )}
        >
          <span
            className={cn(
              'pointer-events-none absolute start-3 top-0 z-[1] -translate-y-1/2 px-1 text-xs font-medium',
              'bg-home-card text-[#404943] dark:bg-auth-input-bg dark:text-home-filter-muted'
            )}
          >
            {label}
          </span>
          <span
            className={cn(
              'truncate text-sm font-medium',
              selectedLabel
                ? 'text-content dark:text-home-filter-ink'
                : 'text-home-filter-muted'
            )}
          >
            {selectedLabel || placeholder || '\u00a0'}
          </span>
          <ChevronDown
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#404943] dark:text-home-filter-muted"
            strokeWidth={1.75}
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className={cn(
          'w-[var(--radix-popover-trigger-width)] min-w-[220px] overflow-hidden p-0',
          'rounded-xl border border-[#dbd8d1] bg-[#f8f8f0] shadow-md',
          'dark:border-auth-input-border dark:bg-home-stat-card'
        )}
      >
        <LocationOptionList
          options={options}
          value={value}
          onSelect={(next) => {
            onChange?.(next);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

type LocationOptionListProps = {
  options: GeoOption[];
  value?: string;
  onSelect: (value: string) => void;
  className?: string;
  maxHeightClassName?: string;
};

export function LocationOptionList({
  options,
  value,
  onSelect,
  className,
  maxHeightClassName = 'max-h-[280px]',
}: LocationOptionListProps) {
  return (
    <ul
      dir="rtl"
      className={cn(
        'overflow-y-auto overscroll-contain py-1',
        maxHeightClassName,
        '[direction:rtl] [scrollbar-gutter:stable]',
        '[&::-webkit-scrollbar]:w-2',
        '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#707973]/70',
        '[&::-webkit-scrollbar-track]:bg-transparent',
        className
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <li key={option.value}>
            <button
              type="button"
              onClick={() => onSelect(option.value)}
              className={cn(
                'flex w-full items-center justify-start px-4 py-2.5 text-sm font-medium',
                'text-[#171d19] hover:bg-[#efede6]',
                'dark:text-home-filter-ink dark:hover:bg-home-card',
                selected && 'bg-[#efede6] font-bold text-[#008d63] dark:bg-home-card dark:text-primary-100'
              )}
            >
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
