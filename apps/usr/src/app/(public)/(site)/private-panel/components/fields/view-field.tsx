'use client';

import { Calendar, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, type ChangeEvent } from 'react';

import {
  optionsForField,
  type FieldOptionsContext,
} from '@private-panel/data/field-options';
import type { VisibilityField } from '@private-panel/data/visibility-config';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarUserIcon } from '@/components/ui/avatar-user-icon';
import {
  OutlinedDateField,
  OutlinedDisplayField,
  OutlinedTextareaField,
  OutlinedTextField,
} from '@/components/ui/outlined-field';
import { UploadButton } from '@/components/ui/upload-button';
import { dateToJalali, formatJalaliDisplay, parseIsoDate } from '@/lib/jalali';
import { cn } from '@/lib/utils';

import { LocationListPicker } from './location-list-picker';

const FIELD_SURFACE = 'bg-app-card dark:bg-app-card';
const INPUT_SURFACE = 'bg-app-card dark:bg-app-search-category';

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

const REQUIRED_IDS = new Set(['nationalId', 'country', 'province', 'city']);

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
  showPending?: boolean;
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
  showPending = false,
  onChange,
  onPhotoPick,
}: ViewFieldProps) {
  const control = resolveViewControl(field);
  const required = isRequiredField(field);
  const pending = showPending && Boolean(field.pending);
  const canEdit = editable;
  const current = value ?? field.value;
  const shared = {
    label,
    required,
    pending,
    error,
    labelSurfaceClassName: FIELD_SURFACE,
    surfaceClassName: INPUT_SURFACE,
  };

  if (control === 'photo') {
    return (
      <PhotoField
        label={label}
        imageSrc={field.imageSrc || current}
        editable={canEdit}
        pending={pending}
        error={error}
        onPick={(previewUrl, file) => {
          if (onPhotoPick) {
            onPhotoPick(field.id, previewUrl, file);
            return;
          }
          onChange?.(field.id, previewUrl);
        }}
      />
    );
  }

  if (control === 'textarea') {
    if (!canEdit) {
      return <OutlinedDisplayField {...shared} multiline value={current} />;
    }
    return (
      <OutlinedTextareaField
        {...shared}
        value={current}
        onValueChange={(next) => onChange?.(field.id, next)}
      />
    );
  }

  if (control === 'date') {
    if (!canEdit) {
      return (
        <OutlinedDisplayField
          {...shared}
          value={formatViewDate(current)}
          endAdornment={
            <Calendar
              className="size-5 text-[#404943] dark:text-app-filter-muted"
              strokeWidth={1.75}
              aria-hidden
            />
          }
        />
      );
    }
    return (
      <OutlinedDateField
        {...shared}
        value={current.slice(0, 10)}
        onValueChange={(iso) => onChange?.(field.id, iso)}
      />
    );
  }

  if (control === 'select') {
    const options = optionsForField(field.id, values);
    const selectedLabel =
      options.find((option) => option.value === current)?.label ??
      options.find((option) => option.label === current)?.label ??
      current;
    const useListPicker =
      canEdit && (options.length > 0 || CASCADE_SELECT_IDS.has(field.id));
    if (useListPicker) {
      return (
        <LocationListPicker
          label={label}
          required={required}
          options={options}
          value={current}
          disabled={options.length === 0}
          error={error}
          pending={pending}
          onChange={(next) => onChange?.(field.id, next)}
        />
      );
    }
    if (canEdit) {
      return (
        <OutlinedTextField
          {...shared}
          value={current}
          endAdornment={
            <ChevronDown
              className="size-5 text-[#404943] dark:text-app-filter-muted"
              strokeWidth={1.75}
              aria-hidden
            />
          }
          onValueChange={(next) => onChange?.(field.id, next)}
        />
      );
    }
    return (
      <OutlinedDisplayField
        {...shared}
        value={selectedLabel}
        endAdornment={
          <ChevronDown
            className="size-5 text-[#404943] dark:text-app-filter-muted"
            strokeWidth={1.75}
            aria-hidden
          />
        }
      />
    );
  }

  if (!canEdit) {
    return <OutlinedDisplayField {...shared} value={current} />;
  }

  return (
    <OutlinedTextField
      {...shared}
      value={current}
      onValueChange={(next) => onChange?.(field.id, next)}
    />
  );
}

function PhotoField({
  label,
  imageSrc,
  editable,
  pending,
  error,
  onPick,
}: {
  label: string;
  imageSrc?: string;
  editable: boolean;
  pending: boolean;
  error?: string | null;
  onPick: (previewUrl: string, file: File) => void;
}) {
  const t = useTranslations('privatePanel.fields');
  const inputRef = useRef<HTMLInputElement>(null);
  const hasPhoto =
    Boolean(imageSrc?.trim()) &&
    !imageSrc?.includes('/images/public-panel/avatar.png');

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) return;
    onPick(URL.createObjectURL(file), file);
  };

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          'flex w-full flex-col items-center gap-4 rounded-2xl border border-[#dbd8d1] px-4 pb-5 pt-4',
          FIELD_SURFACE,
          'dark:border-auth-input-border dark:bg-app-search-category',
          pending && 'border-[#e06333] dark:border-[#e06333]',
          error && 'border-error',
        )}
      >
        <p className="w-full text-start text-sm font-bold text-[#404943] dark:text-app-filter-muted">
          {label}
        </p>

        <Avatar className="size-24 bg-[#efede7] min-[720px]:size-[112px] dark:bg-app-card">
          {hasPhoto ? <AvatarImage src={imageSrc} alt={label} /> : null}
          <AvatarFallback className="bg-[#efede7] text-[#7a807a] dark:bg-app-card dark:text-app-filter-muted">
            <AvatarUserIcon className="size-12" />
          </AvatarFallback>
        </Avatar>

        <p className="text-center text-xs font-medium leading-5 text-[#404943] dark:text-app-filter-muted">
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
      {error ? (
        <p role="alert" className="text-start text-xs font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
