'use client';

import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  JALALI_MONTHS,
  JALALI_WEEKDAYS,
  addJalaliMonths,
  buildJalaliMonthGrid,
  dateToJalali,
  formatJalaliDisplay,
  parseIsoDate,
  toFaDigits,
  toIsoDate,
  type JalaliDate,
} from '@/lib/jalali';
import { cn } from '@/lib/utils';

export type JalaliDatePickerProps = {
  value: string;
  onChange: (isoDate: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  /** Leading adornment inside the field (e.g. calendar icon). */
  startAdornment?: ReactNode;
};

type ViewMode = 'day' | 'month' | 'year';

function sameJalali(a: JalaliDate | null, b: JalaliDate | null) {
  return !!a && !!b && a.year === b.year && a.month === b.month && a.day === b.day;
}

/**
 * Figma docked Jalali date picker (desktop).
 * Value is Gregorian ISO `YYYY-MM-DD` for API filters; UI is Jalali.
 */
export function JalaliDatePicker({
  value,
  onChange,
  placeholder,
  disabled,
  id,
  className,
  triggerClassName,
  startAdornment,
}: JalaliDatePickerProps) {
  const t = useTranslations('datePicker');
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => parseIsoDate(value), [value]);
  const today = useMemo(() => dateToJalali(new Date()), []);

  const [draft, setDraft] = useState<JalaliDate>(selected ?? today);
  const [view, setView] = useState<{ year: number; month: number }>({
    year: (selected ?? today).year,
    month: (selected ?? today).month,
  });
  const [mode, setMode] = useState<ViewMode>('day');

  useEffect(() => {
    if (!open) return;
    const initial = selected ?? today;
    setDraft(initial);
    setView({ year: initial.year, month: initial.month });
    setMode('day');
  }, [open, selected, today]);

  const grid = useMemo(
    () => buildJalaliMonthGrid(view.year, view.month),
    [view.year, view.month]
  );

  const yearOptions = useMemo(() => {
    const start = view.year - 60;
    return Array.from({ length: 80 }, (_, index) => start + index);
  }, [view.year]);

  function confirm() {
    onChange(toIsoDate(draft));
    setOpen(false);
  }

  function cancel() {
    setOpen(false);
  }

  const display = selected ? formatJalaliDisplay(selected) : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(
            'flex h-14 w-full items-center gap-2 rounded border border-home-filter bg-white px-3 text-start',
            'outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:bg-home-search-fill',
            triggerClassName
          )}
        >
          {startAdornment}
          <span
            className={cn(
              'min-w-0 flex-1 truncate text-sm leading-5',
              display ? 'text-home-filter-ink' : 'text-home-filter-muted'
            )}
          >
            {display || placeholder || t('placeholder')}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className={cn(
          'w-[min(328px,calc(100vw-24px))] gap-3 rounded-2xl border-0 p-4',
          'bg-home-header text-content shadow-home-elevation-2 ring-0',
          className
        )}
      >
        <div dir="rtl" className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            {/* Month on the right in RTL */}
            <MonthYearControl
              label={JALALI_MONTHS[view.month - 1]!}
              expanded={mode === 'month'}
              prevLabel={t('prev')}
              nextLabel={t('next')}
              onPrev={() => setView((v) => addJalaliMonths({ ...v, day: 1 }, -1))}
              onNext={() => setView((v) => addJalaliMonths({ ...v, day: 1 }, 1))}
              onToggle={() => setMode((m) => (m === 'month' ? 'day' : 'month'))}
            />
            {/* Year on the left in RTL */}
            <MonthYearControl
              label={toFaDigits(view.year)}
              expanded={mode === 'year'}
              prevLabel={t('prev')}
              nextLabel={t('next')}
              onPrev={() => setView((v) => ({ ...v, year: v.year - 1 }))}
              onNext={() => setView((v) => ({ ...v, year: v.year + 1 }))}
              onToggle={() => setMode((m) => (m === 'year' ? 'day' : 'year'))}
            />
          </div>

          {mode === 'month' ? (
            <div className="grid grid-cols-3 gap-1.5">
              {JALALI_MONTHS.map((name, index) => {
                const month = index + 1;
                const active = month === view.month;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setView((v) => ({ ...v, month }));
                      setMode('day');
                    }}
                    className={cn(
                      'h-10 rounded-full text-sm font-medium',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-content hover:bg-black/5 dark:hover:bg-white/10'
                    )}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          ) : null}

          {mode === 'year' ? (
            <div className="grid max-h-[240px] grid-cols-3 gap-1.5 overflow-y-auto">
              {yearOptions.map((year) => {
                const active = year === view.year;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setView((v) => ({ ...v, year }));
                      setMode('day');
                    }}
                    className={cn(
                      'h-10 rounded-full text-sm font-medium',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-content hover:bg-black/5 dark:hover:bg-white/10'
                    )}
                  >
                    {toFaDigits(year)}
                  </button>
                );
              })}
            </div>
          ) : null}

          {mode === 'day' ? (
            <>
              <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-medium text-neutral-600">
                {JALALI_WEEKDAYS.map((label) => (
                  <span key={label} className="flex h-8 items-center justify-center">
                    {label}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1">
                {grid.map((cell) => {
                  const selectedDay = sameJalali(cell.jalali, draft);
                  return (
                    <button
                      key={cell.iso + String(cell.inCurrentMonth)}
                      type="button"
                      onClick={() => {
                        setDraft(cell.jalali);
                        if (!cell.inCurrentMonth) {
                          setView({
                            year: cell.jalali.year,
                            month: cell.jalali.month,
                          });
                        }
                      }}
                      className={cn(
                        'mx-auto flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors',
                        !cell.inCurrentMonth && 'text-neutral-400',
                        cell.inCurrentMonth && !selectedDay && 'text-content hover:bg-black/5 dark:hover:bg-white/10',
                        selectedDay && 'bg-primary text-primary-foreground hover:bg-primary'
                      )}
                    >
                      {toFaDigits(cell.jalali.day)}
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          <div dir="ltr" className="flex items-center justify-start gap-4 pt-1">
            <Button
              type="button"
              variant="link"
              onClick={confirm}
              className="h-auto px-0 text-sm font-medium text-primary"
            >
              {t('confirm')}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={cancel}
              className="h-auto px-0 text-sm font-medium text-primary"
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MonthYearControl({
  label,
  expanded,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  onToggle,
}: {
  label: string;
  expanded: boolean;
  prevLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
}) {
  return (
    <div dir="ltr" className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={onPrev}
        className="flex size-8 items-center justify-center rounded-full text-content hover:bg-black/5 dark:hover:bg-white/10"
        aria-label={prevLabel}
      >
        <ChevronLeft className="size-4" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="inline-flex h-8 items-center gap-1 rounded-full px-1.5 text-sm font-medium text-content hover:bg-black/5 dark:hover:bg-white/10"
      >
        <span>{label}</span>
        <ChevronDown
          className={cn('size-4 transition-transform', expanded && 'rotate-180')}
          strokeWidth={1.75}
        />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="flex size-8 items-center justify-center rounded-full text-content hover:bg-black/5 dark:hover:bg-white/10"
        aria-label={nextLabel}
      >
        <ChevronRight className="size-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}
