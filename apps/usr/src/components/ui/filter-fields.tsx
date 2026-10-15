'use client';

import { Calendar, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { JalaliDatePicker } from '@/components/ui/jalali-date-picker';
import { cn } from '@/lib/utils';

/*
 * Filter panel building blocks — accordion field row, Jalali date range, number range, checkbox
 * (notifications inbox / reports, operational panel reports).
 */

type FilterFieldProps = {
  id: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  /** Prefix for the aria-controls id, e.g. `reports-filter`. */
  idPrefix: string;
  className?: string;
};

/** Accordion row used inside filter panels. */
export function FilterField({
  id,
  label,
  open,
  onToggle,
  children,
  idPrefix,
  className,
}: FilterFieldProps) {
  const controlsId = `${idPrefix}-${id}`;

  return (
    <div className={cn('flex min-w-0 flex-col', className)}>
      <Button
        type="button"
        variant="toolbar"
        size="field"
        dir="ltr"
        aria-expanded={open}
        aria-controls={controlsId}
        onClick={onToggle}
        className="justify-between gap-3 text-app-filter-ink hover:bg-black/[0.04] dark:hover:bg-white/5"
      >
        <ChevronDown
          className={cn(
            'size-6 shrink-0 text-app-filter-muted transition-transform',
            open && 'rotate-180'
          )}
          aria-hidden
        />
        <span className="truncate text-base font-medium leading-6 tracking-[0.0094em]">
          {label}
        </span>
      </Button>
      {open ? (
        <div id={controlsId} className="px-1 pb-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}

type DateRangeInputsProps = {
  startLabel: string;
  endLabel: string;
  placeholder: string;
  hint: string;
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
};

export function DateRangeInputs({
  startLabel,
  endLabel,
  placeholder,
  hint,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
}: DateRangeInputsProps) {
  return (
    <div className="flex flex-col gap-4 px-2 pb-2 min-[640px]:flex-row min-[640px]:items-start">
      <FilterDateField
        label={startLabel}
        placeholder={placeholder}
        hint={hint}
        value={startValue}
        onChange={onStartChange}
      />
      <FilterDateField
        label={endLabel}
        placeholder={placeholder}
        hint={hint}
        value={endValue}
        onChange={onEndChange}
      />
    </div>
  );
}

function FilterDateField({
  label,
  placeholder,
  hint,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative flex w-full min-w-0 flex-1 flex-col gap-1">
      <span className="absolute -top-2 end-3 z-10 rounded-sm bg-white px-1.5 text-xs leading-4 text-app-filter-ink dark:bg-app-card dark:text-app-filter-ink">
        {label}
      </span>
      <JalaliDatePicker
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        startAdornment={
          <Calendar
            className="size-5 shrink-0 text-app-filter-ink"
            strokeWidth={1.5}
            aria-hidden
          />
        }
      />
      <span className="px-1 text-xs leading-4 tracking-[0.0083em] text-app-filter-muted">
        {hint}
      </span>
    </div>
  );
}

type NumberRangeInputsProps = {
  startLabel: string;
  endLabel: string;
  placeholder: string;
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
};

/** «شروع بازه / پایان بازه» number pair (e.g. transaction amount) — same outlined look as the date range. */
export function NumberRangeInputs({
  startLabel,
  endLabel,
  placeholder,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
}: NumberRangeInputsProps) {
  return (
    <div className="flex flex-col gap-4 px-2 pt-2 pb-2 min-[640px]:flex-row min-[640px]:items-start">
      <FilterNumberField label={startLabel} placeholder={placeholder} value={startValue} onChange={onStartChange} />
      <FilterNumberField label={endLabel} placeholder={placeholder} value={endValue} onChange={onEndChange} />
    </div>
  );
}

function FilterNumberField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative flex w-full min-w-0 flex-1 flex-col">
      <span className="absolute -top-2 end-3 z-10 rounded-sm bg-white px-1.5 text-xs leading-4 text-app-filter-ink dark:bg-app-card dark:text-app-filter-ink">
        {label}
      </span>
      <input
        type="text"
        inputMode="numeric"
        dir="rtl"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'h-14 w-full rounded border border-app-filter bg-white px-3 text-sm leading-5 text-app-filter-ink',
          'placeholder:text-app-filter-muted outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          'dark:bg-app-search-fill'
        )}
      />
    </label>
  );
}

type FilterCheckboxProps = {
  checked: boolean;
  label: string;
  onChange: () => void;
  className?: string;
};

export function FilterCheckbox({
  checked,
  label,
  onChange,
  className,
}: FilterCheckboxProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2 text-sm font-medium leading-5 text-app-filter-ink',
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={cn(
          'size-4 shrink-0 rounded-[2px] border-app-filter-border bg-transparent',
          'accent-primary checked:border-primary',
          'dark:border-app-filter-muted dark:accent-primary'
        )}
      />
      <span className="min-w-0 flex-1 truncate text-start">{label}</span>
    </label>
  );
}
