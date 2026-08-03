'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

type PanelInfoBannerProps = {
  className?: string;
};

/** Mid-page info banner. */
export function PanelInfoBanner({ className }: PanelInfoBannerProps) {
  const t = useTranslations('publicPanel.infoBanner');

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden rounded-2xl',
        'h-[180px] shadow-[0px_2px_6px_2px_rgba(0,0,0,0.15),0px_1px_2px_0px_rgba(0,0,0,0.3)]',
        'min-[834px]:h-[240px]',
        className
      )}
    >
      <Image
        src="/public-panel/info-banner-art.png"
        alt=""
        fill
        sizes="(max-width: 1322px) 100vw, 1322px"
        className="object-cover object-left"
        aria-hidden
      />

      <div
        className={cn(
          'relative z-10 flex h-full flex-col items-start justify-center gap-2',
          'px-5 py-4 text-start',
          'min-[640px]:max-w-[55%] min-[640px]:px-10',
          'min-[834px]:max-w-[512px] min-[834px]:pe-0 min-[834px]:ps-8',
          'min-[834px]:me-auto min-[834px]:ms-[117px]'
        )}
      >
        <h2 className="text-lg font-bold leading-7 text-[#005138] min-[640px]:text-xl min-[640px]:leading-8 min-[834px]:text-2xl min-[834px]:leading-8">
          {t('title')}
        </h2>
        <p className="text-sm font-bold leading-6 text-[#005138] min-[640px]:text-base min-[834px]:text-2xl min-[834px]:leading-8">
          <span className="block">{t('bodyLine1')}</span>
          <span className="block">{t('bodyLine2')}</span>
        </p>
      </div>
    </section>
  );
}
