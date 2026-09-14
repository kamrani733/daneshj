'use client';

import { useTranslations } from 'next-intl';

import { ppTheme } from '@private-panel/data/private-panel-theme';
import { PanelBreadcrumb } from '@/components/panel';
import { cn } from '@/lib/utils';

type PrivatePanelHeadingProps = {
  displayName: string;
  username?: string;
  isAdminAccess?: boolean;
};

export function PrivatePanelHeading({
  displayName,
  username,
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
            className={cn(
              'h-8 w-3 shrink-0 rounded-[2px] min-[720px]:h-8',
              ppTheme.titleBar
            )}
          />
          <div className="flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1">
            <h1
              className={cn(
                'text-start text-2xl font-bold leading-9',
                'min-[720px]:text-[28px] min-[720px]:leading-10',
                ppTheme.title
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
            'px-2 text-start text-sm font-semibold leading-5 tracking-[0.007em]',
            ppTheme.subtitle
          )}
        >
          {isAdminAccess
            ? t('adminAccessNote', {
                username:
                  username || displayName || t('titleUserFallback'),
              })
            : displayName || t('titleUserFallback')}
        </p>
      </div>
    </header>
  );
}
