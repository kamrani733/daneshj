'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { PanelBreadcrumb } from '@/components/panel';

import { TitleUnderline } from '@public-panel/components/shared/title-underline';

type PublicPanelHeadingProps = {
  displayName: string;
};

/** Page breadcrumb + decorative title box (public panel). */
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

      <div className="relative flex min-h-[70px] w-full max-w-[374px] items-center justify-center gap-2 pb-4">
        <Image
          src="/images/public-panel/title-deco-start.svg"
          alt=""
          width={54}
          height={40}
          aria-hidden
          className="pointer-events-none absolute bottom-[6px] start-0 h-[40px] w-[54px]"
        />
        <Image
          src="/images/public-panel/title-deco-end.svg"
          alt=""
          width={54}
          height={40}
          aria-hidden
          className="pointer-events-none absolute bottom-[6px] end-0 h-[40px] w-[54px]"
        />

        <div className="relative z-10 flex flex-col items-stretch gap-2">
          <h1
            dir="rtl"
            className="flex flex-wrap items-baseline justify-center gap-1 px-3"
          >
            <span className="text-[28px] font-bold leading-10 text-primary-700 min-[720px]:text-[32px] dark:text-primary-100">
              {t('breadcrumb.current')}
            </span>
            <span className="text-base font-bold leading-6 tracking-[0.0094em] text-primary dark:text-primary-100">
              {displayName}
            </span>
          </h1>
          <TitleUnderline />
        </div>
      </div>
    </header>
  );
}
