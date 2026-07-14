import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { AUTH_ROUTES } from '@auth/lib/auth-routes';
import { Button } from '@/components/ui/button';

import { HOME_IMAGES } from '../home-assets';

/** Figma Motivation box — 1512×362, padding 48px 576px, gap 24px. */
export async function HomeMotivationBox() {
  const t = await getTranslations('home.motivation');

  return (
    <section className="relative w-full overflow-hidden min-h-[362px]">
      <Image
        src={HOME_IMAGES.motivationBg}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-primary/20 dark:bg-primary/40" aria-hidden />

      <div className="relative z-10 mx-auto flex max-w-[360px] flex-col items-center gap-6 px-6 py-12 text-center min-[834px]:max-w-[560px] min-[834px]:py-12 min-[1512px]:max-w-[360px] min-[1512px]:px-0">
        <p className="text-base font-bold leading-6 tracking-[0.0094em] text-neutral-white">
          {t('body')}
        </p>
        <Button
          asChild
          size="lg"
          className="h-12 min-w-[180px] rounded-full px-6 text-base font-medium leading-6 tracking-[0.0094em]"
        >
          <Link href={AUTH_ROUTES.register}>{t('cta')}</Link>
        </Button>
      </div>
    </section>
  );
}
