'use client';

import { useId, useState } from 'react';

import { cn } from '@/lib/utils';

type AuthRecaptchaProps = {
  onChange: (token: string | null) => void;
  label: string;
  className?: string;
};

/**
 * Temporary local checkbox (Figma: «من ربات نیستم»).
 * Replaces Google reCAPTCHA widget for now — swap back when site key/domain is ready.
 */
export function AuthRecaptcha({ onChange, label, className }: AuthRecaptchaProps) {
  const [checked, setChecked] = useState(false);
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={cn(
        'flex min-h-10 cursor-pointer items-center gap-2.5 text-sm text-content',
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          const next = e.target.checked;
          setChecked(next);
          onChange(next ? 'dev-recaptcha-token' : null);
        }}
        className="size-5 shrink-0 rounded border border-border accent-primary"
      />
      <span>{label}</span>
    </label>
  );
}
