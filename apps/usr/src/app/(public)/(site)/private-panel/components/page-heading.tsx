'use client';

import { useTranslations } from 'next-intl';

import { PanelBreadcrumb } from '@/components/panel';
import { cn } from '@/lib/utils';

type PrivatePanelHeadingProps = {
  displayName: string;
  isAdminAccess?: boolean;
};

export function PrivatePanelHeading({
  displayName,
  isAdminAccess = false,
}: PrivatePanelHeadingProps) {
  const t = useTranslations('privatePanel');

  return (
    <header
      dir="rtl"
      className="flex w-full flex-col items-start gap-4 min-[720px]:gap-4"
    >
      <PanelBreadcrumb
        label={t('breadcrumb.label')}
        current={t('breadcrumb.current')}
        account={t('breadcrumb.account')}
        home={t('breadcrumb.home')}
      />

      <div className="flex w-full flex-col items-start gap-3 py-2">
        <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1 px-2">
          <span
            aria-hidden
            className="h-8 w-3 shrink-0 rounded-[2px] bg-[#008d63] min-[720px]:h-8"
          />
          <div className="flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1">
            <h1
              className={cn(
                'text-start text-2xl font-bold leading-9 text-[#005138]',
                'min-[720px]:text-[28px] min-[720px]:leading-10',
                'dark:text-primary-100'
              )}
            >
              {t('title')}
            </h1>
            {isAdminAccess ? (
              <span className="text-center text-base font-bold leading-6 tracking-[0.0094em] text-warning-400">
                {t('tabs.adminAccess')}
              </span>
            ) : null}
          </div>
        </div>
        <p
          className={cn(
            'px-2 text-start text-sm font-semibold leading-5 tracking-[0.007em] text-[#707973]',
            'dark:text-home-filter-ink'
          )}
        >
          {displayName || t('titleUserFallback')}
        </p>
      </div>
    </header>
  );
}
