'use client';

import { Calendar, ChevronDown } from 'lucide-react';
import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

import { JalaliDatePicker } from '@/components/ui/jalali-date-picker';
import { cn } from '@/lib/utils';

export type OutlinedFieldTone = 'default' | 'warning' | 'error';

export type OutlinedFieldOption = {
  value: string;
  label: string;
};

type OutlinedFieldShellProps = {
  label: ReactNode;
  children: ReactNode;
  /** Background behind the notched floating label — match parent surface. */
  labelSurfaceClassName?: string;
  surfaceClassName?: string;
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
  multiline?: boolean;
  tone?: OutlinedFieldTone;
  disabled?: boolean;
  asLabel?: boolean;
  htmlFor?: string;
  className?: string;
  controlClassName?: string;
  errorMessage?: string | null;
  required?: boolean;
};

const DEFAULT_SURFACE = 'bg-app-card dark:bg-auth-input-bg';
const DEFAULT_LABEL_SURFACE = 'bg-app-card dark:bg-app-search-category';

const CONTROL_TEXT =
  'w-full bg-transparent text-start text-sm font-medium text-content outline-none dark:text-app-filter-ink disabled:cursor-not-allowed disabled:opacity-60';

function toneBorderClass(tone: OutlinedFieldTone = 'default') {
  if (tone === 'error') {
    return 'border-error focus-within:border-error focus-within:ring-2 focus-within:ring-error/30';
  }
  if (tone === 'warning') {
    return 'border-warning';
  }
  return 'border-[#707973] dark:border-auth-input-border focus-within:ring-2 focus-within:ring-primary/30';
}

function resolveTone({
  tone,
  error,
  pending,
}: {
  tone?: OutlinedFieldTone;
  error?: boolean | string | null;
  pending?: boolean;
}): OutlinedFieldTone {
  if (tone) return tone;
  if (error) return 'error';
  if (pending) return 'warning';
  return 'default';
}

export function OutlinedFieldShell({
  label,
  children,
  labelSurfaceClassName,
  surfaceClassName,
  endAdornment,
  startAdornment,
  multiline = false,
  tone = 'default',
  disabled = false,
  asLabel = false,
  htmlFor,
  className,
  controlClassName,
  errorMessage,
  required = false,
}: OutlinedFieldShellProps) {
  const autoId = useId();
  const fieldId = htmlFor ?? autoId;
  const errorId = errorMessage ? `${fieldId}-error` : undefined;
  const Wrapper = asLabel ? 'label' : 'div';

  const labelNode = (
    <>
      {label}
      {required ? <span className="text-error"> *</span> : null}
    </>
  );

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Wrapper
        dir="rtl"
        className={cn('relative block', disabled && 'opacity-60')}
        {...(asLabel ? { htmlFor: fieldId } : {})}
      >
        <div
          className={cn(
            'relative w-full rounded-lg border border-solid',
            surfaceClassName ?? DEFAULT_SURFACE,
            multiline
              ? 'min-h-[96px] px-3 py-3 text-start'
              : 'flex h-12 items-center justify-start px-3 text-start',
            startAdornment && 'ps-11',
            endAdornment && 'pe-11',
            toneBorderClass(tone),
            disabled && 'cursor-not-allowed',
            controlClassName
          )}
        >
          {startAdornment ? (
            <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
              {startAdornment}
            </span>
          ) : null}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
        <span
          className={cn(
            'pointer-events-none absolute start-3 top-0 z-[1] -translate-y-1/2 px-1 text-xs font-medium',
            'text-[#404943] dark:text-app-filter-muted',
            labelSurfaceClassName ?? DEFAULT_LABEL_SURFACE,
            tone === 'error' && 'text-error'
          )}
        >
          {labelNode}
        </span>
        {endAdornment ? (
          <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2">
            {endAdornment}
          </span>
        ) : null}
      </Wrapper>
      {errorMessage ? (
        <p
          id={errorId}
          role="alert"
          className="text-start text-xs font-medium text-error"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

type SharedFieldProps = {
  label: ReactNode;
  error?: boolean | string | null;
  errorMessage?: string | null;
  pending?: boolean;
  tone?: OutlinedFieldTone;
  disabled?: boolean;
  required?: boolean;
  labelSurfaceClassName?: string;
  surfaceClassName?: string;
  className?: string;
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
};

type OutlinedTextFieldProps = SharedFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'disabled'> & {
    value?: string;
    onValueChange?: (value: string) => void;
    readOnly?: boolean;
  };

export function OutlinedTextField({
  label,
  error,
  errorMessage,
  pending,
  tone,
  disabled,
  required,
  labelSurfaceClassName,
  surfaceClassName,
  className,
  endAdornment,
  startAdornment,
  value,
  onValueChange,
  onChange,
  readOnly,
  id,
  ...inputProps
}: OutlinedTextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const resolvedTone = resolveTone({ tone, error, pending });
  const message =
    errorMessage ?? (typeof error === 'string' ? error : null);

  return (
    <OutlinedFieldShell
      label={label}
      htmlFor={fieldId}
      asLabel
      tone={resolvedTone}
      disabled={disabled}
      required={required}
      labelSurfaceClassName={labelSurfaceClassName}
      surfaceClassName={surfaceClassName}
      className={className}
      endAdornment={endAdornment}
      startAdornment={startAdornment}
      errorMessage={message}
    >
      <input
        id={fieldId}
        dir="rtl"
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={resolvedTone === 'error' || undefined}
        aria-describedby={message ? `${fieldId}-error` : undefined}
        className={cn(CONTROL_TEXT, 'truncate')}
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.target.value);
        }}
        {...inputProps}
      />
    </OutlinedFieldShell>
  );
}

type OutlinedTextareaFieldProps = SharedFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'disabled'> & {
    value?: string;
    onValueChange?: (value: string) => void;
    readOnly?: boolean;
  };

export function OutlinedTextareaField({
  label,
  error,
  errorMessage,
  pending,
  tone,
  disabled,
  required,
  labelSurfaceClassName,
  surfaceClassName,
  className,
  value,
  onValueChange,
  onChange,
  readOnly,
  id,
  rows = 4,
  ...textareaProps
}: OutlinedTextareaFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const resolvedTone = resolveTone({ tone, error, pending });
  const message =
    errorMessage ?? (typeof error === 'string' ? error : null);

  return (
    <OutlinedFieldShell
      label={label}
      htmlFor={fieldId}
      asLabel
      multiline
      tone={resolvedTone}
      disabled={disabled}
      required={required}
      labelSurfaceClassName={labelSurfaceClassName}
      surfaceClassName={surfaceClassName}
      className={className}
      errorMessage={message}
    >
      <textarea
        id={fieldId}
        dir="rtl"
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        aria-invalid={resolvedTone === 'error' || undefined}
        aria-describedby={message ? `${fieldId}-error` : undefined}
        className={cn(CONTROL_TEXT, 'min-h-[72px] resize-y leading-6')}
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.target.value);
        }}
        {...textareaProps}
      />
    </OutlinedFieldShell>
  );
}

type OutlinedSelectFieldProps = SharedFieldProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'disabled'> & {
    value?: string;
    options: OutlinedFieldOption[];
    onValueChange?: (value: string) => void;
    placeholderOption?: boolean;
  };

export function OutlinedSelectField({
  label,
  options,
  error,
  errorMessage,
  pending,
  tone,
  disabled,
  required,
  labelSurfaceClassName,
  surfaceClassName,
  className,
  value,
  onValueChange,
  onChange,
  id,
  placeholderOption = true,
  ...selectProps
}: OutlinedSelectFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const resolvedTone = resolveTone({ tone, error, pending });
  const message =
    errorMessage ?? (typeof error === 'string' ? error : null);

  return (
    <OutlinedFieldShell
      label={label}
      htmlFor={fieldId}
      asLabel
      tone={resolvedTone}
      disabled={disabled}
      required={required}
      labelSurfaceClassName={labelSurfaceClassName}
      surfaceClassName={surfaceClassName}
      className={className}
      errorMessage={message}
      endAdornment={
        <ChevronDown
          className="size-5 text-[#404943] dark:text-app-filter-muted"
          strokeWidth={1.75}
          aria-hidden
        />
      }
    >
      <select
        id={fieldId}
        dir="rtl"
        value={value}
        disabled={disabled}
        aria-invalid={resolvedTone === 'error' || undefined}
        aria-describedby={message ? `${fieldId}-error` : undefined}
        className={cn(CONTROL_TEXT, 'appearance-none')}
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.target.value);
        }}
        {...selectProps}
      >
        {placeholderOption ? <option value="" /> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </OutlinedFieldShell>
  );
}

type OutlinedDateFieldProps = SharedFieldProps & {
  value?: string;
  onValueChange?: (value: string) => void;
  id?: string;
  calendarPosition?: 'start' | 'end';
};

export function OutlinedDateField({
  label,
  value = '',
  onValueChange,
  error,
  errorMessage,
  pending,
  tone,
  disabled,
  required,
  labelSurfaceClassName,
  surfaceClassName,
  className,
  id,
  calendarPosition = 'end',
}: OutlinedDateFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const resolvedTone = resolveTone({ tone, error, pending });
  const message =
    errorMessage ?? (typeof error === 'string' ? error : null);
  const calendarIcon = (
    <Calendar
      className="size-5 text-[#404943] dark:text-app-filter-muted"
      strokeWidth={1.75}
      aria-hidden
    />
  );

  return (
    <OutlinedFieldShell
      label={label}
      htmlFor={fieldId}
      tone={resolvedTone}
      disabled={disabled}
      required={required}
      labelSurfaceClassName={labelSurfaceClassName}
      surfaceClassName={surfaceClassName}
      className={className}
      errorMessage={message}
      startAdornment={calendarPosition === 'start' ? calendarIcon : undefined}
      endAdornment={calendarPosition === 'end' ? calendarIcon : undefined}
    >
      <JalaliDatePicker
        id={fieldId}
        value={value.slice(0, 10)}
        disabled={disabled}
        onChange={(iso) => onValueChange?.(iso)}
        triggerClassName={cn(
          'h-auto w-full justify-start border-0 bg-transparent p-0 shadow-none',
          'text-start text-sm font-medium text-content hover:bg-transparent',
          'dark:text-app-filter-ink',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      />
    </OutlinedFieldShell>
  );
}

type OutlinedDisplayFieldProps = SharedFieldProps & {
  value?: ReactNode;
  multiline?: boolean;
};

export function OutlinedDisplayField({
  label,
  value,
  multiline = false,
  error,
  errorMessage,
  pending,
  tone,
  required,
  labelSurfaceClassName,
  surfaceClassName,
  className,
  endAdornment,
  startAdornment,
}: OutlinedDisplayFieldProps) {
  const resolvedTone = resolveTone({ tone, error, pending });
  const message =
    errorMessage ?? (typeof error === 'string' ? error : null);

  return (
    <OutlinedFieldShell
      label={label}
      multiline={multiline}
      tone={resolvedTone}
      required={required}
      labelSurfaceClassName={labelSurfaceClassName}
      surfaceClassName={surfaceClassName}
      className={className}
      endAdornment={endAdornment}
      startAdornment={startAdornment}
      errorMessage={message}
    >
      {multiline ? (
        <p className="min-h-[72px] whitespace-pre-wrap text-start text-sm font-medium leading-6 text-content dark:text-app-filter-ink">
          {value || '\u00a0'}
        </p>
      ) : (
        <p className="truncate text-start text-sm font-medium text-content dark:text-app-filter-ink">
          {value || '\u00a0'}
        </p>
      )}
    </OutlinedFieldShell>
  );
}
