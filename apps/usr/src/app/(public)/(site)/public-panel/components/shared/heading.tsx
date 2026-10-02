'use client';

import { useTranslations } from 'next-intl';

import { PanelBreadcrumb } from '@/components/panel';

type PublicPanelHeadingProps = {
  displayName: string;
};

/** Breadcrumb + bar title «پنل عمومی» with the owner's name below (Public Panel export). */
export function PublicPanelHeading({ displayName }: PublicPanelHeadingProps) {
  const t = useTranslations('publicPanel');

  return (
    <header className="flex w-full flex-col items-start gap-8">
      <PanelBreadcrumb
        label={t('breadcrumb.label')}
        current={t('breadcrumb.current')}
        account={t('breadcrumb.account')}
        home={t('breadcrumb.home')}
      />

      <div className="flex flex-col items-start gap-2">
        <h1 className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="h-8 w-3 shrink-0 rounded-[2px] bg-primary"
          />
          <span className="text-headline-medium font-bold text-on-primary-container">
            {t('breadcrumb.current')}
          </span>
        </h1>
        {displayName ? (
          <p className="text-body-medium text-on-surface-variant">
            {displayName}
          </p>
        ) : null}
      </div>
    </header>
  );
}
