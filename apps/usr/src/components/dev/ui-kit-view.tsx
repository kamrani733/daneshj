'use client';

import { useTranslations } from 'next-intl';

import { UiKitComponents } from '@/components/dev/ui-kit-components';
import { UiKitMigrated } from '@/components/dev/ui-kit-migrated';
import { COLOR_ROLES, SHAPES, TYPE_SAMPLES } from '@/components/dev/ui-kit-tokens';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

export function UiKitView() {
  const t = useTranslations('uiKit');

  return (
    <main
      dir="rtl"
      className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 bg-background px-4 py-8 text-foreground"
    >
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-label-medium text-on-surface-variant">{t('devOnly')}</p>
          <h1 className="text-headline-medium font-bold">{t('title')}</h1>
          <p className="text-body-medium text-on-surface-variant">{t('subtitle')}</p>
        </div>
        <ThemeToggle />
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-title-large font-bold">{t('roles')}</h2>
        <ul className="grid grid-cols-1 gap-3 min-[560px]:grid-cols-2 min-[960px]:grid-cols-3">
          {COLOR_ROLES.map(([name, classes]) => (
            <li
              key={name}
              className={cn(
                'flex min-h-16 items-center justify-center px-3 text-label-large font-medium',
                classes
              )}
            >
              {name}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-title-large font-bold">{t('type')}</h2>
        <ul className="flex flex-col gap-2">
          {TYPE_SAMPLES.map(([name, classes]) => (
            <li key={name} className={cn('text-on-surface', classes)}>
              {name} — دانشجوام
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-title-large font-bold">{t('shapes')}</h2>
        <ul className="flex flex-wrap gap-4">
          {SHAPES.map((name) => (
            <li
              key={name}
              className={cn(
                'flex size-20 items-center justify-center bg-primary-container text-center text-label-small text-on-primary-container',
                name
              )}
            >
              {name.replace('rounded-', '')}
            </li>
          ))}
        </ul>
      </section>

      <UiKitMigrated />
      <UiKitComponents />
    </main>
  );
}
