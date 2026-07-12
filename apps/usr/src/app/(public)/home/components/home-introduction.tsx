import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { cn } from '@/lib/utils';

import { HOME_IMAGES } from '../home-assets';

/** Figma main introduction box — 1312px, border 2px warning-subtle, radius 24px. */
export async function HomeIntroduction() {
  const t = await getTranslations('home.intro');

  return (
    <section className="w-full rounded-2xl border border-warning-subtle bg-surface min-[834px]:rounded-3xl min-[834px]:border-2">
      <div className="relative flex items-center overflow-hidden px-2 py-6 min-[834px]:px-8 min-[834px]:py-10">
        <Image
          src={HOME_IMAGES.introPattern}
          alt=""
          width={195}
          height={253}
          aria-hidden
          className="hidden h-auto w-[120px] shrink-0 object-contain min-[834px]:block min-[834px]:w-[195px]"
        />

        <div className="relative z-10 flex flex-1 flex-col items-center gap-2 px-4 min-[834px]:max-w-[982px] min-[834px]:gap-2">
          <Image
            src={HOME_IMAGES.logo}
            alt={t('logoAlt')}
            width={159}
            height={63}
            className="hidden h-[63px] w-[159px] object-contain min-[834px]:block"
          />
          <p
            className={cn(
              'text-center font-bold text-content',
              'text-[10px] leading-6 min-[834px]:text-2xl min-[834px]:leading-[52px]'
            )}
          >
            {t('body')}
          </p>
        </div>

        <Image
          src={HOME_IMAGES.introPattern}
          alt=""
          width={195}
          height={253}
          aria-hidden
          className="hidden h-auto w-[120px] shrink-0 scale-x-[-1] object-contain min-[834px]:block min-[834px]:w-[195px]"
        />
      </div>
    </section>
  );
}
