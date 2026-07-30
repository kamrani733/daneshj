'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { AccentMark } from '@/components/site/accent-mark';

type PublicPanelHeadingProps = {
  displayName: string;
};

/** Figma breadcrumb + title: خانه ← حساب کاربری ← پنل عمومی */
export function PublicPanelHeading({ displayName }: PublicPanelHeadingProps) {
  const t = useTranslations('publicPanel');

  return (
    <header className="flex w-full flex-col items-start gap-5">
      <nav
        aria-label={t('breadcrumb.label')}
        className="flex flex-wrap items-center gap-1.5 text-sm"
      >
        <span className="font-semibold leading-5 text-primary">
          {t('breadcrumb.current')}
        </span>
        <ChevronLeft
          className="size-4 shrink-0 text-neutral-500"
          strokeWidth={1.5}
          aria-hidden
        />
        <span className="font-medium leading-5 text-neutral-600 dark:text-muted-foreground">
          {t('breadcrumb.account')}
        </span>
        <ChevronLeft
          className="size-4 shrink-0 text-neutral-500"
          strokeWidth={1.5}
          aria-hidden
        />
        <Link
          href="/"
          className="font-medium leading-5 text-neutral-600 hover:text-primary dark:text-muted-foreground"
        >
          {t('breadcrumb.home')}
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        <AccentMark size="lg" />
        <h1 className="text-[28px] font-bold leading-9 text-primary-700 dark:text-primary-100 min-[720px]:text-[32px] min-[720px]:leading-10">
          {t('title', { name: displayName })}
        </h1>
      </div>
    </header>
  );
}
