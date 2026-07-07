'use client';

import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type FloatingInputProps = React.ComponentProps<'input'> & {
  label: string;
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
      showVisibilityToggle = false,
      visibilityLabels,
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
          className={cn(
            'peer flex h-14 w-full rounded-md border border-auth-input-border bg-auth-input-bg px-4 text-base text-content shadow-none',
            'text-end placeholder:text-transparent',
            'focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
            showVisibilityToggle && 'pe-12',
            className
          )}
          {...props}
        />
        {showVisibilityToggle && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={
              visible ? visibilityLabels?.hide : visibilityLabels?.show
            }
            onClick={() => setVisible((value) => !value)}
            className="absolute end-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-content-muted transition-colors hover:text-content"
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
            'pointer-events-none absolute start-4 top-1/2 max-w-[calc(100%-2rem)] -translate-y-1/2 truncate text-base text-content-muted transition-all duration-200',
            'peer-focus:top-0 peer-focus:start-3 peer-focus:-translate-y-1/2 peer-focus:bg-auth-input-bg peer-focus:px-1 peer-focus:text-xs peer-focus:text-primary',
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
