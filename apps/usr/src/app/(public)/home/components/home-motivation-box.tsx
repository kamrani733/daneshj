import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { AUTH_ROUTES } from '@auth/lib/auth-routes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { HOME_IMAGES } from '../home-assets';

/** Figma Motivation box #28:1412 — logo, text, orange CTA; 1512×362, padding 48px 576px, gap 24px. */
export async function HomeMotivationBox() {
  const [t, tIntro] = await Promise.all([
    getTranslations('home.motivation'),
    getTranslations('home.intro'),
  ]);

  return (
    <section
      className="relative h-[362px] w-full overflow-hidden bg-repeat"
      style={{
        backgroundImage: `url(${HOME_IMAGES.motivationBg})`,
        backgroundSize: '20%',
      }}
    >
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div
        className={cn(
          'relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 py-12',
          'min-[1512px]:px-[576px]'
        )}
      >
        <Image
          src={HOME_IMAGES.logo}
          alt={tIntro('logoAlt')}
          width={167}
          height={66}
          className="h-[66px] w-[167px] object-contain"
        />

        <p
          className={cn(
            'max-w-[312px] text-center text-sm font-bold leading-5 tracking-[0.0071em] text-[#FAFAF7]',
            'min-[834px]:max-w-[460px] min-[834px]:text-base min-[834px]:leading-6 min-[834px]:tracking-[0.0094em]'
          )}
        >
          {t('body')}
        </p>

        <Button
          asChild
          className="h-12 w-[112px] rounded-full border-0 bg-warning px-6 text-base font-medium leading-6 tracking-[0.0094em] text-neutral-white shadow-none hover:bg-warning/90 min-[834px]:w-[180px]"
        >
          <Link href={AUTH_ROUTES.register}>{t('cta')}</Link>
        </Button>
      </div>
    </section>
  );
}
