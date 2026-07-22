'use client';

import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type FloatingInputProps = React.ComponentProps<'input'> & {
  label: string;
  error?: boolean;
  showVisibilityToggle?: boolean;
  visibilityLabels?: {
    show: string;
    hide: string;
  };
};

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      className,
      label,
      id,
      type,
      error = false,
      showVisibilityToggle = false,
      visibilityLabels,
      style,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const [visible, setVisible] = React.useState(false);
    const inputType = showVisibilityToggle
      ? visible
        ? 'text'
        : 'password'
      : type;

    return (
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          type={inputType}
          placeholder=" "
          aria-invalid={error || undefined}
          {...props}
          style={
            error
              ? { ...style, borderColor: 'var(--color-error)' }
              : style
          }
          className={cn(
            'peer flex h-14 w-full rounded-md border border-solid bg-auth-input-bg px-4 text-base text-content shadow-none',
            'text-end placeholder:text-transparent',
            'focus-visible:outline-none focus-visible:ring-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? '!border-error focus-visible:!border-error focus-visible:ring-error/30'
              : 'border-auth-input-border focus-visible:border-primary focus-visible:ring-primary/30',
            // Physical left padding so the icon sits on the visual left in RTL
            error && 'pl-12',
            showVisibilityToggle && 'pe-12',
            className
          )}
        />
        {error ? (
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center text-error"
          >
            <AlertCircle
              className="size-6 fill-current stroke-white"
              strokeWidth={1.75}
            />
          </span>
        ) : null}
        {showVisibilityToggle && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={
              visible ? visibilityLabels?.hide : visibilityLabels?.show
            }
            onClick={() => setVisible((value) => !value)}
            className="absolute end-3 top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center text-content-muted transition-colors hover:text-content"
          >
            {visible ? (
              <EyeOff className="size-6 stroke-[1.5]" aria-hidden />
            ) : (
              <Eye className="size-6 stroke-[1.5]" aria-hidden />
            )}
          </button>
        )}
        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute start-4 top-1/2 z-[1] max-w-[calc(100%-3.5rem)] -translate-y-1/2 truncate text-base transition-all duration-200',
            error ? 'text-error' : 'text-content-muted',
            'peer-focus:top-0 peer-focus:start-3 peer-focus:-translate-y-1/2 peer-focus:bg-auth-input-bg peer-focus:px-1 peer-focus:text-xs',
            !error && 'peer-focus:text-primary',
            error && 'peer-focus:text-error',
            'peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:start-3 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:bg-auth-input-bg peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-xs'
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);
FloatingInput.displayName = 'FloatingInput';

export { FloatingInput };
