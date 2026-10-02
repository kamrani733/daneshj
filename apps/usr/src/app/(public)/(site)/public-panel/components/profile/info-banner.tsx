'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

type PanelInfoBannerProps = {
  className?: string;
};

/**
 * Mid-page info banner. ≥640: text over the art (desktop export).
 * Phones: art on top, text below (responsive export).
 */
export function PanelInfoBanner({ className }: PanelInfoBannerProps) {
  const t = useTranslations('publicPanel.infoBanner');

  return (
    <section
      className={cn(
        'relative flex w-full flex-col overflow-hidden rounded-2xl bg-surface-container-low',
        'shadow-[0px_2px_6px_2px_rgba(0,0,0,0.15),0px_1px_2px_0px_rgba(0,0,0,0.3)]',
        'min-[640px]:block min-[640px]:h-[180px] min-[834px]:h-[240px]',
        className
      )}
    >
      <div className="relative order-1 h-[160px] w-full min-[640px]:absolute min-[640px]:inset-0 min-[640px]:h-full">
        <Image
          src="/images/public-panel/info-banner-art.png"
          alt=""
          fill
          sizes="(max-width: 1322px) 100vw, 1322px"
          className="object-cover object-left"
          aria-hidden
        />
      </div>

      <div
        className={cn(
          'relative z-10 order-2 flex flex-col items-start justify-center gap-2',
          'px-5 py-4 text-start',
          'min-[640px]:h-full min-[640px]:max-w-[55%] min-[640px]:px-10',
          'min-[834px]:max-w-[512px] min-[834px]:pe-0 min-[834px]:ps-8',
          'min-[834px]:me-auto min-[834px]:ms-[117px]'
        )}
      >
        <h2 className="text-lg font-bold leading-7 text-primary-700 min-[640px]:text-xl min-[640px]:leading-8 min-[834px]:text-2xl min-[834px]:leading-8 dark:text-primary-700">
          {t('title')}
        </h2>
        <p className="text-sm font-bold leading-6 text-primary-700 min-[640px]:text-base min-[834px]:text-2xl min-[834px]:leading-8 dark:text-primary-700">
          <span className="block">{t('bodyLine1')}</span>
          <span className="block">{t('bodyLine2')}</span>
        </p>
      </div>
    </section>
  );
}
