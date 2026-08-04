'use client';

import { Calendar, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, type ReactNode } from 'react';

import {
  type FilterCategoryOption,
} from '@notifications/data/notifications-filter-data';
import { Button } from '@/components/ui/button';
import { JalaliDatePicker } from '@/components/ui/jalali-date-picker';
import { cn } from '@/lib/utils';

type FilterFieldProps = {
  id: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  /** Prefix for aria-controls id, e.g. `notifications-filter` or `reports-filter`. */
  idPrefix: string;
  className?: string;
};

/** Accordion row used inside notification / report filter panels. */
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
        className="justify-between gap-3 text-home-filter-ink hover:bg-black/[0.04] dark:hover:bg-white/5"
      >
        <ChevronDown
          className={cn(
            'size-6 shrink-0 text-home-filter-muted transition-transform',
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
      <span className="absolute -top-2 end-3 z-10 rounded-sm bg-white px-1.5 text-xs leading-4 text-home-filter-ink dark:bg-home-card dark:text-home-filter-ink">
        {label}
      </span>
      <JalaliDatePicker
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        startAdornment={
          <Calendar
            className="size-5 shrink-0 text-home-filter-ink"
            strokeWidth={1.5}
            aria-hidden
          />
        }
      />
      <span className="px-1 text-xs leading-4 tracking-[0.0083em] text-home-filter-muted">
        {hint}
      </span>
    </div>
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
        'flex cursor-pointer items-center gap-2 text-sm font-medium leading-5 text-home-filter-ink',
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={cn(
          'size-4 shrink-0 rounded-[2px] border-home-filter-border bg-transparent',
          'accent-primary checked:border-primary',
          'dark:border-home-filter-muted dark:accent-primary'
        )}
      />
      <span className="min-w-0 flex-1 truncate text-start">{label}</span>
    </label>
  );
}

type CategoryTreeProps = {
  options: FilterCategoryOption[];
  selected: string[];
  onToggle: (id: string) => void;
  depth?: number;
};

export function CategoryTree({
  options,
  selected,
  onToggle,
  depth = 0,
}: CategoryTreeProps) {
  const t = useTranslations('notifications.filter.categories');
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(options.map((o) => o.id))
  );

  const toggleExpand = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <ul className="flex max-h-64 flex-col overflow-y-auto px-2 pb-2">
      {options.map((option) => {
        const hasChildren = (option.children?.length ?? 0) > 0;
        const isOpen = expanded.has(option.id);
        return (
          <li key={option.id} className="flex flex-col">
            <div
              className="flex min-h-11 items-center gap-2"
              style={{ paddingInlineStart: depth * 16 }}
            >
              <FilterCheckbox
                checked={selected.includes(option.id)}
                label={t(option.labelKey)}
                onChange={() => onToggle(option.id)}
                className="min-w-0 flex-1"
              />
              {hasChildren ? (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={t(option.labelKey)}
                  onClick={() => toggleExpand(option.id)}
                  className="flex size-6 shrink-0 items-center justify-center text-home-filter-muted"
                >
                  <ChevronDown
                    className={cn(
                      'size-5 transition-transform',
                      isOpen && 'rotate-180'
                    )}
                    aria-hidden
                  />
                </button>
              ) : (
                <span className="size-6 shrink-0" aria-hidden />
              )}
            </div>
            {hasChildren && isOpen ? (
              <CategoryTree
                options={option.children!}
                selected={selected}
                onToggle={onToggle}
                depth={depth + 1}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
