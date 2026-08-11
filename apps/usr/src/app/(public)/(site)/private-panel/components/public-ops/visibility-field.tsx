'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { VisibilityField } from '@private-panel/data/visibility-config';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  OutlinedDateField,
  OutlinedTextareaField,
  OutlinedTextField,
} from '@/components/ui/outlined-field';
import { cn } from '@/lib/utils';

export type VisibilityUiState =
  | 'visible'
  | 'hidden'
  | 'pendingRemoval'
  | 'locked';

type VisibilityFieldCardProps = {
  field: VisibilityField;
  value: string;
  selected: boolean;
  onToggle: (id: string) => void;
};

const CARD_BG = 'bg-[#f8f8f0] dark:bg-home-search-category';
const INPUT_BG = 'bg-[#fffbff] dark:bg-auth-input-bg';

export function resolveVisibilityState(
  field: VisibilityField,
  selected: boolean
): VisibilityUiState {
  if (field.locked) return 'locked';
  if (selected) return 'visible';
  if (field.initiallyVisible) return 'pendingRemoval';
  return 'hidden';
}

export function VisibilityFieldCard({
  field,
  value,
  selected,
  onToggle,
}: VisibilityFieldCardProps) {
  const t = useTranslations('privatePanel.publicOps.manageVisibility');
  const state = resolveVisibilityState(field, selected);
  const locked = state === 'locked';
  const lockedMuted = locked && field.lockedCaptionKey === 'notDisplayed';
  const label = t(`fields.${field.labelKey}`);
  const caption =
    state === 'locked'
      ? t(`captions.${field.lockedCaptionKey ?? 'locked'}`)
      : state === 'hidden' && field.hiddenCaptionKey
        ? t(`captions.${field.hiddenCaptionKey}`)
        : t(`captions.${state}`);
  const showCalendar =
    Boolean(field.withCalendar) || field.labelKey === 'birthDate';

  if (field.kind === 'photo') {
    return (
      <div className={cn(cardClass(state), 'overflow-hidden p-0')}>
        <div className="flex flex-col items-center gap-3 px-3 pb-3 pt-4 min-[720px]:px-4 min-[720px]:pt-5">
          <p className="w-full text-start text-xs font-medium text-[#404943] dark:text-home-filter-muted">
            {label}
          </p>
          <Avatar className="size-[72px] min-[720px]:size-24">
            {field.imageSrc ? (
              <AvatarImage src={field.imageSrc} alt={label} />
            ) : null}
            <AvatarFallback>{label.slice(0, 1)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="border-t border-[#dbdbd3]/70 px-3 py-2.5 min-[720px]:px-4 min-[720px]:py-3 dark:border-border/60">
          <VisibilityCheckbox
            label={label}
            caption={caption}
            state={state}
            selected={selected}
            locked={locked}
            lockedMuted={lockedMuted}
            onToggle={() => onToggle(field.id)}
          />
        </div>
      </div>
    );
  }

  if (field.kind === 'toggle') {
    return (
      <div
        className={cn(
          cardClass(state),
          'gap-2.5 p-2.5 pt-2 min-[720px]:gap-3 min-[720px]:p-3'
        )}
      >
        <fieldset className="min-w-0 rounded-lg border border-[#707973] px-3 py-2.5 min-[720px]:py-3 dark:border-auth-input-border">
          <legend
            className={cn(
              'px-1 text-xs font-medium text-[#404943] dark:text-home-filter-muted',
              CARD_BG
            )}
          >
            {label}
          </legend>
        </fieldset>
        <VisibilityCheckbox
          label={label}
          caption={caption}
          state={state}
          selected={selected}
          locked={locked}
          lockedMuted={lockedMuted}
          onToggle={() => onToggle(field.id)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        cardClass(state),
        'gap-2.5 p-3 pt-2.5 min-[720px]:gap-3 min-[720px]:p-4 min-[720px]:pt-3'
      )}
    >
      {field.kind === 'textarea' ? (
        <OutlinedTextareaField
          label={label}
          value={value}
          readOnly
          labelSurfaceClassName={CARD_BG}
          surfaceClassName={INPUT_BG}
        />
      ) : showCalendar ? (
        <OutlinedDateField
          label={label}
          value={toPickerIsoValue(value)}
          disabled
          calendarPosition="start"
          labelSurfaceClassName={CARD_BG}
          surfaceClassName={INPUT_BG}
        />
      ) : (
        <OutlinedTextField
          label={label}
          value={value}
          readOnly
          labelSurfaceClassName={CARD_BG}
          surfaceClassName={INPUT_BG}
        />
      )}

      <VisibilityCheckbox
        label={label}
        caption={caption}
        state={state}
        selected={selected}
        locked={locked}
        lockedMuted={lockedMuted}
        onToggle={() => onToggle(field.id)}
      />
    </div>
  );
}

function cardClass(state: VisibilityUiState) {
  return cn(
    'flex min-w-0 flex-col rounded-xl border',
    CARD_BG,
    state === 'visible' && 'border-[#dae6da]',
    state === 'pendingRemoval' && 'border-warning/50',
    (state === 'hidden' || state === 'locked') &&
      'border-[#dbdbd3] dark:border-border'
  );
}

export function VisibilityCheckbox({
  label,
  caption,
  state,
  selected,
  locked,
  lockedMuted = false,
  onToggle,
}: {
  label: string;
  caption: string;
  state: VisibilityUiState;
  selected: boolean;
  locked: boolean;
  lockedMuted?: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={cn(
        'flex min-h-11 cursor-pointer items-start gap-2 py-0.5',
        'min-[720px]:min-h-0',
        locked && 'cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[3px] border min-[720px]:size-[18px]',
          state === 'visible' && 'border-primary bg-primary text-white',
          state === 'pendingRemoval' && 'border-warning bg-transparent',
          state === 'hidden' &&
            'border-[#707973] bg-transparent dark:border-home-filter-muted',
          locked &&
            'border-[#707973] bg-transparent opacity-70 dark:border-home-filter-muted'
        )}
        aria-hidden
      >
        {state === 'visible' ? (
          <Check className="size-3 stroke-[3]" />
        ) : null}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={selected && !locked}
        disabled={locked}
        onChange={onToggle}
        aria-label={`${label} — ${caption}`}
      />
      <span
        className={cn(
          'min-w-0 flex-1 text-start text-[11px] font-medium leading-5 tracking-[0.008em]',
          'min-[720px]:text-xs',
          state === 'visible' && 'text-primary dark:text-primary-100',
          state === 'pendingRemoval' && 'text-warning',
          state === 'hidden' && 'text-[#404943] dark:text-home-filter-muted',
          locked && !lockedMuted && 'text-error',
          lockedMuted && 'text-[#404943] dark:text-home-filter-muted'
        )}
      >
        {caption}
      </span>
    </label>
  );
}

function toPickerIsoValue(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  return '';
}
