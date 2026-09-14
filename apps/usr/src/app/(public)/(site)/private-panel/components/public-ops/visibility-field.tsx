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

const CARD_BG = 'bg-app-search-fill';
const LOCKED_CARD_BG = 'bg-private-panel-locked-field';
const INPUT_BG = 'dark:bg-app-search-category';
const LOCKED_INPUT_BG = 'bg-private-panel-locked-field';

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
  const interactionLocked = locked || Boolean(field.pending);
  const lockedMuted = locked && field.lockedCaptionKey === 'notDisplayed';
  const cardBg = cardSurfaceClass(state);
  const inputBg = inputSurfaceClass(state);
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
          <p className="w-full text-start text-xs font-medium text-app-filter-muted">
            {label}
          </p>
          <Avatar className="size-[72px] min-[720px]:size-24">
            {field.imageSrc ? (
              <AvatarImage src={field.imageSrc} alt={label} />
            ) : null}
            <AvatarFallback>{label.slice(0, 1)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="border-t border-border/70 px-3 py-2.5 min-[720px]:px-4 min-[720px]:py-3 dark:border-border/60">
          <VisibilityCheckbox
            label={label}
            caption={caption}
            state={state}
            selected={selected}
            locked={interactionLocked}
            lockedMuted={lockedMuted}
            onToggle={() => onToggle(field.id)}
          />
        </div>
      </div>
    );
  }

  if (field.kind === 'document') {
    const documentName =
      field.documentName ??
      t(`documents.${field.documentSlot ?? 'resume'}`);

    return (
      <div
        className={cn(
          cardClass(state),
          'gap-2.5 p-3 pt-2.5 min-[720px]:gap-3 min-[720px]:p-4 min-[720px]:pt-3'
        )}
      >
        <OutlinedTextField
          label={label}
          value={value}
          readOnly
          labelSurfaceClassName={cardBg}
          surfaceClassName={inputBg}
        />

        <div className="flex items-center justify-end gap-2 px-1">
          <span className="truncate text-xs font-medium text-content min-[720px]:text-sm dark:text-app-filter-ink">
            {documentName}
          </span>
          <span
            aria-hidden
            className="flex h-6 min-w-9 shrink-0 items-center justify-center rounded bg-error-50 px-1 text-[10px] font-bold text-error"
          >
            JPEG
          </span>
        </div>

        <VisibilityCheckbox
          label={`${label} — ${documentName}`}
          caption={caption}
          state={state}
          selected={selected}
          locked={interactionLocked}
          lockedMuted={lockedMuted}
          onToggle={() => onToggle(field.id)}
        />
      </div>
    );
  }

  if (field.kind === 'toggle') {
    return (
      <AcademicFieldToggleCard
        label={label}
        caption={caption}
        state={state}
        selected={selected}
        locked={interactionLocked}
        lockedMuted={lockedMuted}
        onToggle={() => onToggle(field.id)}
      />
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
          labelSurfaceClassName={cardBg}
          surfaceClassName={inputBg}
        />
      ) : showCalendar ? (
        <OutlinedDateField
          label={label}
          value={toPickerIsoValue(value)}
          disabled
          calendarPosition="start"
          labelSurfaceClassName={cardBg}
          surfaceClassName={inputBg}
        />
      ) : (
        <OutlinedTextField
          label={label}
          value={value}
          readOnly
          labelSurfaceClassName={cardBg}
          surfaceClassName={inputBg}
        />
      )}

      <VisibilityCheckbox
        label={label}
        caption={caption}
        state={state}
        selected={selected}
        locked={interactionLocked}
        lockedMuted={lockedMuted}
        onToggle={() => onToggle(field.id)}
      />
    </div>
  );
}

function cardClass(state: VisibilityUiState) {
  return cn(
    'flex min-w-0 flex-col rounded-xl border',
    cardSurfaceClass(state),
    state === 'visible' && 'border-app-filter-border dark:border-primary-100/40',
    state === 'pendingRemoval' && 'border-warning/50',
    (state === 'hidden' || state === 'locked') &&
      'border-border dark:border-border'
  );
}

function cardSurfaceClass(state: VisibilityUiState) {
  return state === 'locked' ? LOCKED_CARD_BG : CARD_BG;
}

function inputSurfaceClass(state: VisibilityUiState) {
  return state === 'locked' ? LOCKED_INPUT_BG : INPUT_BG;
}

export function AcademicFieldToggleCard({
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
  const visible = state === 'visible';

  return (
    <div
      className={cn(
        'flex min-w-0 w-full flex-col items-end gap-2 rounded-lg border p-4',
        'bg-app-card dark:bg-app-card',
        visible
          ? 'border-[#8DD5B2]'
          : 'border-border dark:border-auth-input-border'
      )}
    >
      <p
        className={cn(
          'w-full text-start text-base leading-6 tracking-[0.0094em]',
          'text-[#404943] dark:text-app-filter-ink'
        )}
      >
        {label}
      </p>
      <VisibilityCheckbox
        label={label}
        caption={caption}
        state={state}
        selected={selected}
        locked={locked}
        lockedMuted={lockedMuted}
        className="w-full"
        onToggle={onToggle}
      />
    </div>
  );
}

export function VisibilityCheckbox({
  label,
  caption,
  state,
  selected,
  locked,
  lockedMuted = false,
  className,
  onToggle,
}: {
  label: string;
  caption: string;
  state: VisibilityUiState;
  selected: boolean;
  locked: boolean;
  lockedMuted?: boolean;
  className?: string;
  onToggle: () => void;
}) {
  return (
    <label
      className={cn(
        'flex min-h-11 cursor-pointer items-start gap-2 py-0.5',
        'min-[720px]:min-h-0',
        locked && 'cursor-not-allowed',
        className
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[3px] border min-[720px]:size-[18px]',
          state === 'visible' &&
            'border-primary bg-primary text-white dark:border-primary-100 dark:bg-primary-100 dark:text-primary-900',
          state === 'pendingRemoval' && 'border-warning bg-transparent',
          state === 'hidden' &&
            'border-neutral-600 bg-transparent dark:border-app-filter-muted',
          locked &&
            'border-neutral-600 bg-transparent opacity-70 dark:border-app-filter-muted'
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
        checked={Boolean(selected)}
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
          state === 'hidden' && 'text-app-filter-muted',
          locked && !lockedMuted && 'text-error',
          lockedMuted && 'text-app-filter-muted'
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
