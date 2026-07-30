'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { AccentMark } from '@/components/site/accent-mark';

type NotificationsPageHeadingProps = {
  titleKey?: string;
  breadcrumbCurrentKey?: string;
};

/** Figma Title part #2392:4851 — breadcrumb + orange bar + title. */
export function NotificationsPageHeading({
  titleKey = 'title',
  breadcrumbCurrentKey = 'breadcrumb.current',
}: NotificationsPageHeadingProps) {
  const t = useTranslations('notifications');

  return (
    <header className="flex w-full flex-col items-start gap-6">
      <nav
        aria-label={t('breadcrumb.label')}
        className="flex items-center gap-2 text-sm"
      >
        <span className="font-semibold leading-5 tracking-[0.0071em] text-green-700 dark:text-primary-100">
          {t(breadcrumbCurrentKey)}
        </span>
        <ChevronLeft
          className="size-5 shrink-0 text-neutral-600 dark:text-muted-foreground"
          strokeWidth={1.5}
          aria-hidden
        />
        <Link
          href="/"
          className="font-medium leading-5 tracking-[0.0071em] text-neutral-600 hover:text-green-700 dark:text-muted-foreground dark:hover:text-primary-100"
        >
          {t('breadcrumb.home')}
        </Link>
      </nav>

      <div className="flex items-center gap-2 px-2">
        <AccentMark size="lg" />
        <h1 className="text-[32px] font-bold leading-10 text-primary-700 dark:text-primary-100">
          {t(titleKey)}
        </h1>
      </div>
    </header>
  );
}
