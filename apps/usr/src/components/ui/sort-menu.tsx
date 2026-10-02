'use client';

import { Check, ChevronDown, ListFilter } from 'lucide-react';
import { useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type SortMenuOption<T extends string> = {
  value: T;
  label: string;
};

type SortMenuProps<T extends string> = {
  value: T;
  options: SortMenuOption<T>[];
  onChange: (value: T) => void;
  /** Accessible name of the trigger, e.g. «مرتب‌سازی». */
  label: string;
  /**
   * `button`: lines icon + `label` (transferred list in Figma).
   * `select`: bordered pill with the current choice + chevron (registered list).
   * Phones always show the icon only (responsive export).
   */
  trigger?: 'button' | 'select';
  /** Text for the `select` trigger; defaults to the selected option's label. */
  selectedLabel?: string;
  className?: string;
};

/** Sort trigger + overlay menu (Figma «Sorting overlay», desktop 296 · mobile full width). */
export function SortMenu<T extends string>({
  value,
  options,
  onChange,
  label,
  trigger = 'select',
  selectedLabel,
  className,
}: SortMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const current =
    selectedLabel ?? options.find((option) => option.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            'inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full text-label-large font-medium text-on-surface-variant',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
            'max-[719px]:size-12 max-[719px]:border max-[719px]:border-outline-variant',
            trigger === 'select'
              ? 'min-[720px]:min-w-[176px] min-[720px]:justify-between min-[720px]:border min-[720px]:border-outline-variant min-[720px]:px-4'
              : 'min-[720px]:px-2 hover:bg-black/[0.04] dark:hover:bg-white/10',
            className
          )}
        >
          {trigger === 'select' ? (
            <>
              <ListFilter className="size-5 min-[720px]:hidden" aria-hidden />
              <span className="hidden min-[720px]:inline">{current}</span>
              <ChevronDown className="hidden size-4 min-[720px]:block" aria-hidden />
            </>
          ) : (
            <>
              <ListFilter className="size-5" aria-hidden />
              <span className="hidden min-[720px]:inline">{label}</span>
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        dir="rtl"
        className="w-[min(calc(100vw-2rem),296px)] gap-0 rounded-lg border-0 bg-surface-container p-0 py-2 shadow-app-elevation-2 ring-0 max-[719px]:w-[calc(100vw-2rem)]"
      >
        <ul role="listbox" aria-label={label} className="flex flex-col">
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex h-14 w-full items-center justify-between gap-3 px-4 text-start text-body-large text-on-surface',
                    'hover:bg-black/[0.04] dark:hover:bg-white/10',
                    selected && 'font-bold text-primary'
                  )}
                >
                  {option.label}
                  {selected ? <Check className="size-4" aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
