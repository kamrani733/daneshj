'use client';

import { ChevronDown } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import type { GeoOption } from '@private-panel/data/geo';
import {
  OutlinedFieldShell,
  type OutlinedFieldTone,
} from '@/components/ui/outlined-field';
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
  required?: boolean;
  error?: boolean | string | null;
  pending?: boolean;
  tone?: OutlinedFieldTone;
  onChange?: (value: string) => void;
  className?: string;
  labelSurfaceClassName?: string;
  surfaceClassName?: string;
};

export function LocationListPicker({
  label,
  options,
  value,
  placeholder = '',
  disabled,
  required,
  error,
  pending,
  tone,
  onChange,
  className,
  labelSurfaceClassName = 'bg-home-card dark:bg-auth-input-bg',
  surfaceClassName = 'bg-home-card dark:bg-auth-input-bg',
}: LocationListPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    if (!value) return '';
    return (
      options.find((option) => option.value === value)?.label ??
      options.find((option) => option.label === value)?.label ??
      ''
    );
  }, [options, value]);

  const resolvedTone: OutlinedFieldTone =
    tone ?? (error ? 'error' : pending ? 'warning' : 'default');
  const errorMessage = typeof error === 'string' ? error : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <OutlinedFieldShell
        label={label}
        required={required}
        tone={resolvedTone}
        disabled={disabled}
        labelSurfaceClassName={labelSurfaceClassName}
        surfaceClassName={surfaceClassName}
        className={className}
        errorMessage={errorMessage}
        endAdornment={
          <ChevronDown
            className="size-5 text-[#404943] dark:text-home-filter-muted"
            strokeWidth={1.75}
            aria-hidden
          />
        }
        controlClassName="p-0"
      >
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            dir="rtl"
            disabled={disabled}
            className={cn(
              'flex h-full min-h-12 w-full items-center justify-start px-3 text-start',
              'focus-visible:outline-none',
              disabled && 'cursor-not-allowed'
            )}
          >
            <span
              className={cn(
                'w-full truncate text-start text-sm font-medium',
                selectedLabel
                  ? 'text-content dark:text-home-filter-ink'
                  : 'text-home-filter-muted'
              )}
            >
              {selectedLabel || placeholder || '\u00a0'}
            </span>
          </button>
        </PopoverTrigger>
      </OutlinedFieldShell>
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
                'flex w-full items-center justify-start px-4 py-2.5 text-start text-sm font-medium',
                'text-[#171d19] hover:bg-[#efede6]',
                'dark:text-home-filter-ink dark:hover:bg-home-card',
                selected &&
                  'bg-[#efede6] font-bold text-[#008d63] dark:bg-home-card dark:text-primary-100'
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
