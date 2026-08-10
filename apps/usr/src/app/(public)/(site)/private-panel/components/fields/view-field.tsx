'use client';

import { Calendar, ChevronDown, User } from 'lucide-react';
import { useId, type ReactNode } from 'react';

import type { VisibilityField } from '@private-panel/data/visibility-config';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  dateToJalali,
  formatJalaliDisplay,
  parseIsoDate,
} from '@/lib/jalali';
import { cn } from '@/lib/utils';

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
};

/** Read-only field chrome — Figma view mode (empty / filled). */
export function ViewField({ field, label }: ViewFieldProps) {
  const control = resolveViewControl(field);
  const required = isRequiredField(field);
  const pending = Boolean(field.pending);
  const labelNode = (
    <>
      {label}
      {required ? <span className="text-error"> *</span> : null}
    </>
  );

  if (control === 'photo') {
    const hasPhoto =
      Boolean(field.imageSrc?.trim()) &&
      !field.imageSrc!.includes('/images/public-panel/avatar.png');

    return (
      <div
        className={cn(
          'flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-xl border px-4 py-5',
          FIELD_SURFACE,
          pending
            ? 'border-warning'
            : 'border-[#707973] dark:border-auth-input-border'
        )}
      >
        <Avatar className="size-20 min-[720px]:size-24">
          {hasPhoto ? (
            <AvatarImage src={field.imageSrc} alt={label} />
          ) : null}
          <AvatarFallback className="bg-transparent text-home-filter-muted">
            <User className="size-10" strokeWidth={1.25} />
          </AvatarFallback>
        </Avatar>
        <p className="text-xs font-medium text-[#404943] dark:text-home-filter-muted">
          {label}
        </p>
      </div>
    );
  }

  if (control === 'textarea') {
    return (
      <OutlinedShell label={labelNode} multiline pending={pending}>
        <p className="min-h-[72px] whitespace-pre-wrap text-sm font-medium leading-6 text-content dark:text-home-filter-ink">
          {field.value || '\u00a0'}
        </p>
      </OutlinedShell>
    );
  }

  const display =
    control === 'date' ? formatViewDate(field.value) : field.value;

  return (
    <OutlinedShell
      label={labelNode}
      pending={pending}
      endAdornment={
        control === 'date' ? (
          <Calendar
            className="size-5 text-[#404943] dark:text-home-filter-muted"
            strokeWidth={1.75}
            aria-hidden
          />
        ) : control === 'select' ? (
          <ChevronDown
            className="size-5 text-[#404943] dark:text-home-filter-muted"
            strokeWidth={1.75}
            aria-hidden
          />
        ) : null
      }
    >
      <p className="truncate text-sm font-medium text-content dark:text-home-filter-ink">
        {display || '\u00a0'}
      </p>
    </OutlinedShell>
  );
}

function OutlinedShell({
  label,
  children,
  endAdornment,
  multiline,
  pending,
}: {
  label: ReactNode;
  children: ReactNode;
  endAdornment?: React.ReactNode;
  multiline?: boolean;
  pending?: boolean;
}) {
  const id = useId();

  return (
    <div className="relative">
      <div
        id={id}
        className={cn(
          'w-full rounded-lg border border-solid',
          INPUT_SURFACE,
          multiline ? 'min-h-[96px] px-3 py-3' : 'flex h-12 items-center px-3',
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
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          {endAdornment}
        </span>
      ) : null}
    </div>
  );
}
