'use client';

import { useTranslations } from 'next-intl';

import { PanelBreadcrumb } from '@/components/panel';

type PrivatePanelHeadingProps = {
  displayName: string;
};

/** Private panel breadcrumb + green-bar title (Figma). */
export function PrivatePanelHeading({ displayName }: PrivatePanelHeadingProps) {
  const t = useTranslations('privatePanel');

  return (
    <header className="flex w-full flex-col items-start gap-5 min-[720px]:gap-6">
      <PanelBreadcrumb
        label={t('breadcrumb.label')}
        current={t('breadcrumb.current')}
        account={t('breadcrumb.account')}
        home={t('breadcrumb.home')}
      />

      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="mt-1 h-10 w-1.5 shrink-0 rounded-full bg-primary dark:bg-primary-100"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-bold leading-10 text-primary-700 min-[720px]:text-[32px] dark:text-primary-100">
            {t('title')}
          </h1>
          <p className="text-base font-medium leading-6 text-home-filter-muted dark:text-home-filter-ink">
            {displayName}
          </p>
        </div>
      </div>
    </header>
  );
}
