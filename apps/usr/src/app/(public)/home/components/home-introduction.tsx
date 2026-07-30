import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { cn } from '@/lib/utils';

import { SITE_IMAGES } from '@/components/site/site-assets';

function IntroSidePattern({
  side,
  className,
}: {
  side: 'left' | 'right';
  className?: string;
}) {
  const src =
    side === 'left' ? SITE_IMAGES.introPatternLeft : SITE_IMAGES.introPatternRight;

  return (
    <Image
      src={src}
      alt=""
      width={390}
      height={505}
      aria-hidden
      className={cn('home-intro-pattern', className)}
    />
  );
}

/** Figma main introduction box #1:8987 — 1312×auto desktop, patterns 390×505. */
export async function HomeIntroduction() {
  const t = await getTranslations('home.intro');

  return (
    <section className="w-full overflow-hidden rounded-xl border border-home-intro bg-home-header min-[834px]:rounded-3xl min-[834px]:border-2 min-[834px]:bg-home-card">
      {/* Desktop / tablet — row, space-between, center column 1078px */}
      <div
        className="relative hidden min-h-[280px] items-center justify-center min-[834px]:flex"
        dir="ltr"
      >
        <IntroSidePattern
          side="left"
          className="pointer-events-none absolute left-0 top-1/2 h-[505px] w-[390px] max-w-[30%] -translate-y-1/2 object-contain object-left"
        />
        <IntroSidePattern
          side="right"
          className="pointer-events-none absolute right-0 top-1/2 h-[505px] w-[390px] max-w-[30%] -translate-y-1/2 object-contain object-right"
        />

        <div
          dir="rtl"
          className="relative z-10 flex w-full max-w-[1078px] flex-col items-center gap-2 px-8 py-10"
        >
          <Image
            src={SITE_IMAGES.logo}
            alt={t('logoAlt')}
            width={159}
            height={63}
            className="h-[63px] w-[159px] object-contain"
          />
          <p className="max-w-[982px] text-center text-2xl font-bold leading-[52px] text-content">
            {t('body')}
          </p>
        </div>
      </div>

      {/* Mobile — patterns 197×255, text 10/24 centered, no logo */}
      <div className="relative flex min-h-[255px] items-center justify-center min-[834px]:hidden" dir="ltr">
        <IntroSidePattern
          side="left"
          className="pointer-events-none absolute left-0 top-1/2 h-[255px] w-[197px] -translate-y-1/2 object-contain object-left"
        />
        <IntroSidePattern
          side="right"
          className="pointer-events-none absolute right-0 top-1/2 h-[255px] w-[197px] -translate-y-1/2 object-contain object-right"
        />

        <p
          dir="rtl"
          className="relative z-10 max-w-[256px] px-4 text-center text-[10px] font-bold leading-6 text-content"
        >
          {t('body')}
        </p>
      </div>
    </section>
  );
}
