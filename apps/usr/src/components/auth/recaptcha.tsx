'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark';
        }
      ) => number;
      reset: (widgetId?: number) => void;
    };
    ___grecaptcha_cfg?: unknown;
  }
}

const SCRIPT_ID = 'google-recaptcha-v2';
/** Google's published reCAPTCHA v2 test site key — always passes. */
export const RECAPTCHA_TEST_SITE_KEY =
  '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

type AuthRecaptchaProps = {
  onChange: (token: string | null) => void;
  label: string;
  className?: string;
};

function loadRecaptchaScript() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.grecaptcha) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    return new Promise<void>((resolve) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      if (window.grecaptcha) resolve();
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(script);
  });
}

/**
 * reCAPTCHA v2 checkbox for password login (Figma: «من ربات نیستم»).
 * Uses `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, falling back to Google's test key.
 */
export function AuthRecaptcha({ onChange, label, className }: AuthRecaptchaProps) {
  const siteKey =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || RECAPTCHA_TEST_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  const [fallbackChecked, setFallbackChecked] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const fallbackId = useId();

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;

    async function mount() {
      try {
        await loadRecaptchaScript();
        if (cancelled || !containerRef.current || !window.grecaptcha) {
          setUseFallback(true);
          return;
        }

        window.grecaptcha.ready(() => {
          if (cancelled || !containerRef.current || widgetIdRef.current !== null) {
            return;
          }
          widgetIdRef.current = window.grecaptcha!.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token) => onChangeRef.current(token),
            'expired-callback': () => onChangeRef.current(null),
            'error-callback': () => {
              onChangeRef.current(null);
              setUseFallback(true);
            },
          });
        });
      } catch {
        if (!cancelled) setUseFallback(true);
      }
    }

    void mount();
    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  if (useFallback) {
    return (
      <label
        htmlFor={fallbackId}
        className={cn(
          'flex cursor-pointer items-center gap-2.5 text-sm text-green-850 dark:text-foreground',
          className
        )}
      >
        <input
          id={fallbackId}
          type="checkbox"
          checked={fallbackChecked}
          onChange={(e) => {
            const checked = e.target.checked;
            setFallbackChecked(checked);
            onChange(checked ? 'dev-recaptcha-token' : null);
          }}
          className="size-5 accent-primary"
        />
        <span>{label}</span>
      </label>
    );
  }

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div ref={containerRef} />
      <span className="sr-only">{label}</span>
    </div>
  );
}
