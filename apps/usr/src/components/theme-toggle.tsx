'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

type ThemeToggleProps = {
  className?: string;
};

/** Figma Mode shifters #813:2223 — 39×24 pill, #EFEDE6 track, #3D4443 knob. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const t = useTranslations('common');
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={cn('inline-block h-6 w-[39px] shrink-0 rounded-full bg-[#efede6]', className)}
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? t('themeLight') : t('themeDark')}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative inline-flex h-6 w-[39px] shrink-0 items-center rounded-full bg-[#efede6] p-[3px] transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        className
      )}
    >
      <span
        className={cn(
          'flex size-[18px] items-center justify-center rounded-full bg-[#3d4443] text-white shadow-sm transition-transform duration-200',
          isDark ? 'translate-x-[-15px]' : 'translate-x-0'
        )}
      >
        {isDark ? (
          <Moon className="size-2.5" strokeWidth={2.5} />
        ) : (
          <Sun className="size-2.5" strokeWidth={2.5} />
        )}
      </span>
    </button>
  );
}
