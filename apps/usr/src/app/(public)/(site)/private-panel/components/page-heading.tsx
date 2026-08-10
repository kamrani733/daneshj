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
    <header className="flex w-full flex-col items-start gap-4 min-[720px]:gap-6">
      <PanelBreadcrumb
        label={t('breadcrumb.label')}
        current={t('breadcrumb.current')}
        account={t('breadcrumb.account')}
        home={t('breadcrumb.home')}
      />

      <div className="flex items-start gap-2.5 min-[720px]:gap-3">
        <span
          aria-hidden
          className="mt-1 h-8 w-1.5 shrink-0 rounded-full bg-primary min-[720px]:h-10 dark:bg-primary-100"
        />
        <div className="flex min-w-0 flex-col gap-0.5 min-[720px]:gap-1">
          <h1 className="text-2xl font-bold leading-9 text-primary-700 min-[720px]:text-[32px] min-[720px]:leading-10 dark:text-primary-100">
            {t('title')}
          </h1>
          <p className="truncate text-sm font-medium leading-6 text-home-filter-muted min-[720px]:text-base dark:text-home-filter-ink">
            {displayName}
          </p>
        </div>
      </div>
    </header>
  );
}
