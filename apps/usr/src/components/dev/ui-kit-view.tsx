'use client';

import { useTranslations } from 'next-intl';

import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

const COLOR_ROLES = [
  ['primary', 'bg-primary text-on-primary'],
  ['on-primary', 'bg-on-primary text-primary'],
  ['primary-container', 'bg-primary-container text-on-primary-container'],
  ['brand-secondary', 'bg-brand-secondary text-on-brand-secondary'],
  ['background', 'bg-background text-foreground border border-outline-variant'],
  ['surface (card)', 'bg-surface text-on-surface border border-outline-variant'],
  [
    'surface-container-lowest',
    'bg-surface-container-lowest text-on-surface border border-outline-variant',
  ],
  ['error', 'bg-error text-on-error'],
  ['featured-container', 'bg-featured-container text-featured'],
  ['rating', 'bg-surface-container text-rating'],
  ['like-active', 'bg-surface-container text-like-active'],
  ['outline', 'bg-background text-outline border border-outline'],
] as const;

const TYPE_SAMPLES = [
  ['display-small', 'text-display-small'],
  ['headline-large', 'text-headline-large'],
  ['headline-medium', 'text-headline-medium'],
  ['title-large', 'text-title-large'],
  ['title-medium', 'text-title-medium'],
  ['body-large', 'text-body-large'],
  ['body-medium', 'text-body-medium'],
  ['label-large', 'text-label-large'],
  ['label-small', 'text-label-small'],
] as const;

const SHAPES = [
  'rounded-extra-small',
  'rounded-small',
  'rounded-medium',
  'rounded-large',
  'rounded-large-increased',
  'rounded-extra-large',
] as const;

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
    </main>
  );
}
