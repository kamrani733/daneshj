'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

type PanelInfoBannerProps = {
  className?: string;
};

/**
 * Figma mid-page info banner — full art with overlaid title/body (RTL text on right).
 */
export function PanelInfoBanner({ className }: PanelInfoBannerProps) {
  const t = useTranslations('publicPanel.infoBanner');

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden rounded-2xl',
        'aspect-[1322/240] min-h-[112px]',
        className
      )}
    >
      <Image
        src="/public-panel/info-banner-art.png"
        alt=""
        fill
        sizes="(max-width: 1152px) 100vw, 1152px"
        className="object-cover object-left"
        aria-hidden
      />

      <div
        className={cn(
          'relative z-10 flex h-full flex-col items-start justify-center gap-1.5',
          'px-5 py-4 text-start',
          'min-[640px]:max-w-[58%] min-[640px]:gap-2 min-[640px]:px-8',
          'min-[834px]:max-w-[55%] min-[834px]:px-10'
        )}
      >
        <h2 className="text-base font-bold leading-7 text-primary-700 min-[640px]:text-xl min-[640px]:leading-8 min-[834px]:text-2xl min-[834px]:leading-9">
          {t('title')}
        </h2>
        <p className="text-xs leading-5 text-primary-700/90 min-[640px]:text-sm min-[640px]:leading-6 min-[834px]:text-base min-[834px]:leading-7">
          <span className="block">{t('bodyLine1')}</span>
          <span className="block">{t('bodyLine2')}</span>
        </p>
      </div>
    </section>
  );
}
