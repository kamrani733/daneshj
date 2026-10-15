import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { SITE_IMAGES } from '@/components/site/site-assets';

const WALLET_BANNER_IMAGE = '/images/operational-panel/wallet-banner.webp';

/**
 * «کیف پول» intro banner (export «Operational Panel۳»): illustration on the end side, copy on the start side
 * with the logo inline. Phones: the illustration sits above the copy.
 */
export function WalletIntroBanner() {
  const t = useTranslations('operationalPanel.wallet.intro');

  return (
    <section
      aria-label={t('label')}
      className="relative flex flex-col overflow-hidden rounded-large bg-surface-container-lowest shadow-app-elevation-1 md:min-h-70 md:justify-center"
    >
      <div className="relative h-44 w-full md:absolute md:inset-0 md:h-auto">
        <Image
          src={WALLET_BANNER_IMAGE}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 932px, 100vw"
          className="object-cover object-[0%_47%]"
        />
      </div>
      <div className="relative flex flex-col gap-1 p-4 text-body-large font-medium text-on-surface md:w-[52%] md:p-8 md:text-title-medium">
        <p>
          {t.rich('first', {
            logo: () => (
              <Image
                src={SITE_IMAGES.logo}
                alt={t('logoAlt')}
                width={84}
                height={33}
                className="mx-1 inline-block h-[1.4em] w-auto align-middle"
              />
            ),
          })}
        </p>
        <p>{t('second')}</p>
      </div>
    </section>
  );
}
