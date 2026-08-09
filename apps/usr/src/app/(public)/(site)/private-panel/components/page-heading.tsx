'use client';

import { ContactRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PanelBreadcrumb } from '@/components/panel';

/** Private panel breadcrumb + title with panel icon (mobile/desktop). */
export function PrivatePanelHeading() {
  const t = useTranslations('privatePanel');

  return (
    <header className="flex w-full flex-col items-start gap-5 min-[720px]:gap-6">
      <PanelBreadcrumb
        label={t('breadcrumb.label')}
        current={t('breadcrumb.current')}
        account={t('breadcrumb.account')}
        home={t('breadcrumb.home')}
      />

      <div className="flex items-center gap-2.5">
        <ContactRound
          className="size-8 shrink-0 text-primary min-[720px]:size-9 dark:text-primary-100"
          strokeWidth={1.5}
          aria-hidden
        />
        <h1 className="text-[28px] font-bold leading-10 text-primary-700 min-[720px]:text-[32px] dark:text-primary-100">
          {t('title')}
        </h1>
      </div>
    </header>
  );
}
