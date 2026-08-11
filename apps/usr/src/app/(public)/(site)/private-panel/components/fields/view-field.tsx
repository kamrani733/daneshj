'use client';

import { Calendar, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId, useRef, type ChangeEvent, type ReactNode } from 'react';

import {
  optionsForField,
  type FieldOptionsContext,
} from '@private-panel/data/field-options';
import type { VisibilityField } from '@private-panel/data/visibility-config';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarUserIcon } from '@/components/ui/avatar-user-icon';
import { JalaliDatePicker } from '@/components/ui/jalali-date-picker';
import { UploadButton } from '@/components/ui/upload-button';
import {
  dateToJalali,
  formatJalaliDisplay,
  parseIsoDate,
} from '@/lib/jalali';
import { cn } from '@/lib/utils';

import { LocationListPicker } from './location-list-picker';

const FIELD_SURFACE = 'bg-home-card dark:bg-home-search-category';
const INPUT_SURFACE = 'bg-home-card dark:bg-auth-input-bg';

export type ViewControl = 'text' | 'select' | 'date' | 'textarea' | 'photo';

const SELECT_IDS = new Set([
  'gender',
  'militaryStatus',
  'maritalStatus',
  'country',
  'province',
  'city',
  'district',
  'eduCountry',
  'eduProvince',
  'eduCity',
  'eduDistrict',
  'gradEmploymentStatus',
  'membershipType',
  'serviceProviderStatus',
]);

const CASCADE_SELECT_IDS = new Set([
  'province',
  'city',
  'eduProvince',
  'eduCity',
]);

const REQUIRED_IDS = new Set([
  'nationalId',
  'country',
  'province',
  'city',
]);

export function resolveViewControl(field: VisibilityField): ViewControl {
  if (field.kind === 'photo') return 'photo';
  if (field.kind === 'textarea') return 'textarea';
  if (field.withCalendar || field.labelKey === 'birthDate') return 'date';
  if (SELECT_IDS.has(field.id)) return 'select';
  return 'text';
}

export function isRequiredField(field: VisibilityField): boolean {
  return REQUIRED_IDS.has(field.id);
}

function formatViewDate(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const dateOnly = parseIsoDate(trimmed.slice(0, 10));
  if (dateOnly && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    if (/[Tt]/.test(trimmed) || /[Zz]|[+-]\d{2}:?\d{2}$/.test(trimmed)) {
      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.getTime())) {
        return formatJalaliDisplay(dateToJalali(parsed));
      }
    }
    return formatJalaliDisplay(dateOnly);
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return formatJalaliDisplay(dateToJalali(parsed));
  }
  return trimmed;
}

type ViewFieldProps = {
  field: VisibilityField;
  label: string;
  editable?: boolean;
  value?: string;
  values?: FieldOptionsContext;
  error?: string | null;
  onChange?: (id: string, value: string) => void;
  onPhotoPick?: (id: string, previewUrl: string, file: File) => void;
};

export function ViewField({
  field,
  label,
  editable = false,
  value,
  values,
  error,
  onChange,
  onPhotoPick,
}: ViewFieldProps) {
  const control = resolveViewControl(field);
  const required = isRequiredField(field);
  const pending = Boolean(field.pending);
  const canEdit = editable;
  const current = value ?? field.value;
  const labelNode = (
    <>
      {label}
      {required ? <span className="text-error"> *</span> : null}
    </>
  );

  if (control === 'photo') {
    return (
      <FieldWithError error={error}>
        <PhotoField
          label={label}
          imageSrc={field.imageSrc || current}
          pending={pending}
          editable={canEdit}
          onPick={(previewUrl, file) => {
            if (onPhotoPick) {
              onPhotoPick(field.id, previewUrl, file);
              return;
            }
            onChange?.(field.id, previewUrl);
          }}
        />
      </FieldWithError>
    );
  }

  if (control === 'textarea') {
    if (!canEdit) {
      return (
        <FieldWithError error={error}>
          <OutlinedShell label={labelNode} multiline pending={pending}>
            <p className="min-h-[72px] whitespace-pre-wrap text-start text-sm font-medium leading-6 text-content dark:text-home-filter-ink">
              {current || '\u00a0'}
            </p>
          </OutlinedShell>
        </FieldWithError>
      );
    }
    return (
      <FieldWithError error={error}>
        <OutlinedShell
          label={labelNode}
          multiline
          pending={pending || Boolean(error)}
          asLabel
        >
          <textarea
            dir="rtl"
            value={current}
            onChange={(event) => onChange?.(field.id, event.target.value)}
            rows={4}
            className={cn(
              'min-h-[72px] w-full resize-y bg-transparent text-start text-sm font-medium',
              'leading-6 text-content outline-none dark:text-home-filter-ink'
            )}
          />
        </OutlinedShell>
      </FieldWithError>
    );
  }

  if (control === 'date') {
    if (!canEdit) {
      return (
        <FieldWithError error={error}>
          <OutlinedShell
            label={labelNode}
            pending={pending}
            endAdornment={
              <Calendar
                className="size-5 text-[#404943] dark:text-home-filter-muted"
                strokeWidth={1.75}
                aria-hidden
              />
            }
          >
            <p className="truncate text-start text-sm font-medium text-content dark:text-home-filter-ink">
              {formatViewDate(current) || '\u00a0'}
            </p>
          </OutlinedShell>
        </FieldWithError>
      );
    }
    return (
      <FieldWithError error={error}>
        <div className="relative">
          <JalaliDatePicker
            value={current.slice(0, 10)}
            onChange={(iso) => onChange?.(field.id, iso)}
            triggerClassName={cn(
              'h-12 w-full justify-start rounded-lg border px-3 pe-11 text-start text-sm font-medium',
              INPUT_SURFACE,
              '[direction:rtl]',
              pending || error
                ? 'border-warning'
                : 'border-[#707973] dark:border-auth-input-border'
            )}
          />
          <span
            className={cn(
              'pointer-events-none absolute start-3 top-0 z-[1] -translate-y-1/2 px-1 text-xs font-medium',
              'text-[#404943] dark:text-home-filter-muted',
              FIELD_SURFACE
            )}
          >
            {labelNode}
          </span>
          <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2">
            <Calendar
              className="size-5 text-[#404943] dark:text-home-filter-muted"
              strokeWidth={1.75}
              aria-hidden
            />
          </span>
        </div>
      </FieldWithError>
    );
  }

  if (control === 'select') {
    const options = optionsForField(field.id, values);
    const useListPicker =
      canEdit && (options.length > 0 || CASCADE_SELECT_IDS.has(field.id));
    if (useListPicker) {
      return (
        <FieldWithError error={error}>
          <LocationListPicker
            label={
              required ? (
                <>
                  {label}
                  <span className="text-error"> *</span>
                </>
              ) : (
                label
              )
            }
            options={options}
            value={current}
            disabled={options.length === 0}
            onChange={(next) => onChange?.(field.id, next)}
          />
        </FieldWithError>
      );
    }
    if (canEdit) {
      return (
        <FieldWithError error={error}>
          <OutlinedShell
            label={labelNode}
            pending={pending || Boolean(error)}
            endAdornment={
              <ChevronDown
                className="size-5 text-[#404943] dark:text-home-filter-muted"
                strokeWidth={1.75}
                aria-hidden
              />
            }
            asLabel
          >
            <input
              dir="rtl"
              type="text"
              value={current}
              onChange={(event) => onChange?.(field.id, event.target.value)}
              className={cn(
                'w-full truncate bg-transparent text-start text-sm font-medium',
                'text-content outline-none dark:text-home-filter-ink'
              )}
            />
          </OutlinedShell>
        </FieldWithError>
      );
    }
    return (
      <FieldWithError error={error}>
        <OutlinedShell
          label={labelNode}
          pending={pending}
          endAdornment={
            <ChevronDown
              className="size-5 text-[#404943] dark:text-home-filter-muted"
              strokeWidth={1.75}
              aria-hidden
            />
          }
        >
          <p className="truncate text-start text-sm font-medium text-content dark:text-home-filter-ink">
            {current || '\u00a0'}
          </p>
        </OutlinedShell>
      </FieldWithError>
    );
  }

  if (!canEdit) {
    return (
      <FieldWithError error={error}>
        <OutlinedShell label={labelNode} pending={pending}>
          <p className="truncate text-start text-sm font-medium text-content dark:text-home-filter-ink">
            {current || '\u00a0'}
          </p>
        </OutlinedShell>
      </FieldWithError>
    );
  }

  return (
    <FieldWithError error={error}>
      <OutlinedShell
        label={labelNode}
        pending={pending || Boolean(error)}
        asLabel
      >
        <input
          dir="rtl"
          type="text"
          value={current}
          onChange={(event) => onChange?.(field.id, event.target.value)}
          className={cn(
            'w-full truncate bg-transparent text-start text-sm font-medium',
            'text-content outline-none dark:text-home-filter-ink'
          )}
        />
      </OutlinedShell>
    </FieldWithError>
  );
}

function FieldWithError({
  error,
  children,
}: {
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      {children}
      {error ? (
        <p role="alert" className="text-start text-xs font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PhotoField({
  label,
  imageSrc,
  editable,
  onPick,
}: {
  label: string;
  imageSrc?: string;
  pending: boolean;
  editable: boolean;
  onPick: (previewUrl: string, file: File) => void;
}) {
  const t = useTranslations('privatePanel.fields');
  const inputRef = useRef<HTMLInputElement>(null);
  const hasPhoto =
    Boolean(imageSrc?.trim()) &&
    !imageSrc!.includes('/images/public-panel/avatar.png');

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) return;
    onPick(URL.createObjectURL(file), file);
  };

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center gap-4 rounded-2xl border border-[#dbd8d1] px-4 pb-5 pt-4',
        FIELD_SURFACE,
        'dark:border-auth-input-border'
      )}
    >
      <p className="w-full text-start text-sm font-bold text-[#404943] dark:text-home-filter-muted">
        {label}
      </p>

      <Avatar className="size-24 bg-[#efede7] min-[720px]:size-[112px]">
        {hasPhoto ? <AvatarImage src={imageSrc} alt={label} /> : null}
        <AvatarFallback className="bg-[#efede7] text-[#7a807a]">
          <AvatarUserIcon className="size-12" />
        </AvatarFallback>
      </Avatar>

      <p className="text-center text-xs font-medium leading-5 text-[#404943] dark:text-home-filter-muted">
        {t('photosHintMax')}
      </p>

      {editable ? (
        <>
          <UploadButton onClick={() => inputRef.current?.click()}>
            {t('uploadPhoto')}
          </UploadButton>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            className="sr-only"
            aria-label={t('photosPickAria')}
            onChange={onFile}
          />
        </>
      ) : null}
    </div>
  );
}

function OutlinedShell({
  label,
  children,
  endAdornment,
  multiline,
  pending,
  asLabel,
}: {
  label: ReactNode;
  children: ReactNode;
  endAdornment?: React.ReactNode;
  multiline?: boolean;
  pending?: boolean;
  asLabel?: boolean;
}) {
  const id = useId();
  const Wrapper = asLabel ? 'label' : 'div';

  return (
    <Wrapper dir="rtl" className="relative block">
      <div
        id={id}
        className={cn(
          'w-full rounded-lg border border-solid',
          INPUT_SURFACE,
          multiline
            ? 'min-h-[96px] px-3 py-3 text-start'
            : 'flex h-12 items-center justify-start px-3 text-start',
          endAdornment && 'pe-11',
          pending
            ? 'border-warning'
            : 'border-[#707973] dark:border-auth-input-border'
        )}
      >
        {children}
      </div>
      <span
        className={cn(
          'pointer-events-none absolute start-3 top-0 z-[1] -translate-y-1/2 px-1 text-xs font-medium',
          'text-[#404943] dark:text-home-filter-muted',
          FIELD_SURFACE
        )}
      >
        {label}
      </span>
      {endAdornment ? (
        <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2">
          {endAdornment}
        </span>
      ) : null}
    </Wrapper>
  );
}
