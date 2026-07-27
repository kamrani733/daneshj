'use client';

import { useEffect, useMemo, useState } from 'react';
import { Clock3, Keyboard } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type DayPeriod = 'am' | 'pm';
type PickerMode = 'clock' | 'input';
type ClockFocus = 'hour' | 'minute';

type SettingsTimePickerProps = {
  open: boolean;
  value: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (value: string) => void;
  title?: string;
};

type TimeParts = {
  hour12: number;
  minute: number;
  period: DayPeriod;
};

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

function faPad2(value: number) {
  const fa = formatFaNumber(value);
  return fa.length === 1 ? `۰${fa}` : fa;
}

function parseTimeValue(value: string | null): TimeParts {
  const match = value?.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) {
    return { hour12: 7, minute: 0, period: 'am' };
  }
  let hour24 = Number(match[1]);
  const minute = Math.min(59, Math.max(0, Number(match[2])));
  if (!Number.isFinite(hour24)) hour24 = 7;
  hour24 = ((hour24 % 24) + 24) % 24;
  const period: DayPeriod = hour24 >= 12 ? 'pm' : 'am';
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, minute, period };
}

function toValue24({ hour12, minute, period }: TimeParts): string {
  let hour24 = hour12 % 12;
  if (period === 'pm') hour24 += 12;
  if (period === 'am' && hour12 === 12) hour24 = 0;
  return `${pad2(hour24)}:${pad2(minute)}`;
}

function clockPoint(index: number, radius: number) {
  const angle = ((index % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 128 + Math.cos(angle) * radius,
    y: 128 + Math.sin(angle) * radius,
  };
}

/** Figma time picker — dial + keyboard modes (صبح/عصر). */
export function SettingsTimePicker({
  open,
  value,
  onOpenChange,
  onConfirm,
  title,
}: SettingsTimePickerProps) {
  const t = useTranslations('notifications.settings.timePicker');
  const [mode, setMode] = useState<PickerMode>('clock');
  const [focus, setFocus] = useState<ClockFocus>('hour');
  const [parts, setParts] = useState<TimeParts>(() => parseTimeValue(value));
  const [hourInput, setHourInput] = useState('');
  const [minuteInput, setMinuteInput] = useState('');

  useEffect(() => {
    if (!open) return;
    const next = parseTimeValue(value);
    setParts(next);
    setMode('clock');
    setFocus('hour');
    setHourInput(pad2(next.hour12));
    setMinuteInput(pad2(next.minute));
  }, [open, value]);

  const dialHours = useMemo(() => [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], []);
  const dialMinutes = useMemo(
    () => [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    []
  );

  const selectedDialIndex =
    focus === 'hour' ? parts.hour12 % 12 : Math.round(parts.minute / 5) % 12;
  const hand = clockPoint(selectedDialIndex, 88);

  const handleDialSelect = (index: number) => {
    if (focus === 'hour') {
      const hour12 = index === 0 ? 12 : index;
      setParts((prev) => ({ ...prev, hour12 }));
      setHourInput(pad2(hour12));
      setFocus('minute');
      return;
    }
    const minute = dialMinutes[index] ?? 0;
    setParts((prev) => ({ ...prev, minute }));
    setMinuteInput(pad2(minute));
  };

  const handleConfirm = () => {
    let next = parts;
    if (mode === 'input') {
      let hour12 = Number(hourInput);
      let minute = Number(minuteInput);
      if (!Number.isFinite(hour12) || hour12 < 1 || hour12 > 12) {
        hour12 = parts.hour12;
      }
      if (!Number.isFinite(minute) || minute < 0 || minute > 59) {
        minute = parts.minute;
      }
      next = { ...parts, hour12, minute };
    }
    onConfirm(toValue24(next));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[328px] max-w-[calc(100%-2rem)] gap-5 rounded-[28px] border-0 bg-[#FAFAF5] p-0 text-home-filter-ink shadow-home-elevation-3 ring-0 dark:bg-home-search-fill sm:max-w-[328px]"
      >
        <div className="flex flex-col gap-5 pb-5 pt-6">
          <DialogTitle className="px-6 text-start text-xs font-medium leading-5 tracking-[0.0083em] text-home-filter-muted">
            {title ?? (mode === 'clock' ? t('selectTitle') : t('enterTitle'))}
          </DialogTitle>

          {/* Time chips keep LTR hour:minute; period sits to their left in RTL page */}
          <div className="flex items-start justify-start gap-3 px-6">
            <div dir="ltr" className="flex items-start gap-2">
              {mode === 'clock' ? (
                <>
                  <TimeChip
                    active={focus === 'hour'}
                    value={faPad2(parts.hour12)}
                    onClick={() => setFocus('hour')}
                  />
                  <span className="pt-4 text-[45px] font-normal leading-[52px] text-home-filter-ink">
                    :
                  </span>
                  <TimeChip
                    active={focus === 'minute'}
                    value={faPad2(parts.minute)}
                    onClick={() => setFocus('minute')}
                  />
                </>
              ) : (
                <>
                  <InputChip
                    active={focus === 'hour'}
                    value={hourInput}
                    label={t('hour')}
                    onFocus={() => setFocus('hour')}
                    onChange={(next) => {
                      setHourInput(next.replace(/\D/g, '').slice(0, 2));
                      setFocus('hour');
                    }}
                  />
                  <span className="pt-3 text-[45px] font-normal leading-[52px] text-home-filter-ink">
                    :
                  </span>
                  <InputChip
                    active={focus === 'minute'}
                    value={minuteInput}
                    label={t('minute')}
                    onFocus={() => setFocus('minute')}
                    onChange={(next) => {
                      setMinuteInput(next.replace(/\D/g, '').slice(0, 2));
                      setFocus('minute');
                    }}
                  />
                </>
              )}
            </div>

            <PeriodToggle
              period={parts.period}
              onChange={(period) => setParts((prev) => ({ ...prev, period }))}
            />
          </div>

          {mode === 'clock' ? (
            <div className="flex justify-center px-6">
              <div className="relative size-64 rounded-full bg-[#EAE7E1] dark:bg-home-search-category">
                <svg
                  viewBox="0 0 256 256"
                  className="absolute inset-0 size-full"
                  aria-hidden
                >
                  <line
                    x1="128"
                    y1="128"
                    x2={hand.x}
                    y2={hand.y}
                    stroke="#008D63"
                    strokeWidth="2"
                  />
                  <circle cx="128" cy="128" r="4" fill="#008D63" />
                </svg>

                {(focus === 'hour' ? dialHours : dialMinutes).map(
                  (label, index) => {
                    const point = clockPoint(index, 104);
                    const selected = index === selectedDialIndex;
                    return (
                      <button
                        key={`${focus}-${label}`}
                        type="button"
                        onClick={() => handleDialSelect(index)}
                        className={cn(
                          'absolute flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-base leading-6',
                          selected
                            ? 'bg-primary text-white'
                            : 'text-home-filter-ink hover:bg-black/5 dark:hover:bg-white/10'
                        )}
                        style={{ left: point.x, top: point.y }}
                        aria-label={String(label)}
                      >
                        {faPad2(label)}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          ) : (
            <div className="h-2" />
          )}

          <div
            dir="ltr"
            className="flex items-center justify-between px-3 ps-3 pe-6"
          >
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                onClick={handleConfirm}
                className="h-12 rounded-full px-4 text-sm font-medium text-primary hover:bg-primary/5 dark:text-primary-100"
              >
                {t('confirm')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="h-12 rounded-full px-4 text-sm font-medium text-primary hover:bg-primary/5 dark:text-primary-100"
              >
                {t('cancel')}
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={
                mode === 'clock' ? t('switchToInput') : t('switchToClock')
              }
              onClick={() =>
                setMode((current) => (current === 'clock' ? 'input' : 'clock'))
              }
              className="size-12 rounded-full text-home-filter-ink hover:bg-black/5 dark:hover:bg-white/10"
            >
              {mode === 'clock' ? (
                <Keyboard className="size-6" strokeWidth={1.5} />
              ) : (
                <Clock3 className="size-6" strokeWidth={1.5} />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PeriodToggle({
  period,
  onChange,
}: {
  period: DayPeriod;
  onChange: (period: DayPeriod) => void;
}) {
  const t = useTranslations('notifications.settings.timePicker');
  return (
    <div className="flex h-20 w-[52px] shrink-0 flex-col overflow-hidden rounded-lg border border-[#707973] bg-[#EAE7E1] dark:border-home-filter-border dark:bg-home-search-category">
      <button
        type="button"
        onClick={() => onChange('am')}
        className={cn(
          'flex flex-1 items-center justify-center text-base font-medium',
          period === 'am'
            ? 'bg-[#C1E9FB] text-[#244C5B] dark:bg-info-subtle dark:text-info'
            : 'text-home-filter-muted'
        )}
      >
        {t('am')}
      </button>
      <button
        type="button"
        onClick={() => onChange('pm')}
        className={cn(
          'flex flex-1 items-center justify-center border-t border-[#707973] text-base font-medium dark:border-home-filter-border',
          period === 'pm'
            ? 'bg-[#C1E9FB] text-[#244C5B] dark:bg-info-subtle dark:text-info'
            : 'text-home-filter-muted'
        )}
      >
        {t('pm')}
      </button>
    </div>
  );
}

function TimeChip({
  active,
  value,
  onClick,
}: {
  active: boolean;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-20 w-24 items-center justify-center rounded-lg text-[57px] font-normal leading-[64px]',
        active
          ? 'bg-[#D3F4E1] text-[#005138] dark:bg-primary-subtle dark:text-primary-100'
          : 'bg-[#EAE7E1] text-home-filter-ink dark:bg-home-search-category'
      )}
    >
      {value}
    </button>
  );
}

function InputChip({
  active,
  value,
  label,
  onFocus,
  onChange,
}: {
  active: boolean;
  value: string;
  label: string;
  onFocus: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex w-24 flex-col gap-1.5">
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'h-[72px] w-full rounded-lg text-center text-[45px] font-normal leading-[52px] outline-none',
          active
            ? 'border-2 border-primary bg-[#D3F4E1] text-[#005138] dark:bg-primary-subtle dark:text-primary-100'
            : 'border-0 bg-[#EAE7E1] text-home-filter-ink dark:bg-home-search-category'
        )}
        aria-label={label}
      />
      <span className="text-center text-xs leading-4 text-home-filter-muted">
        {label}
      </span>
    </div>
  );
}
