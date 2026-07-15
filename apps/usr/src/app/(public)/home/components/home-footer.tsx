import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { FOOTER_LEGAL_LINKS, FOOTER_QUICK_LINKS } from '../data/home-content';
import { HOME_IMAGES } from '../home-assets';

/** Figma Footer #5847:169219 — quick access | brand | logo group. */
export async function HomeFooter() {
  const t = await getTranslations('home.footer');

  return (
    <footer className="relative overflow-hidden bg-home-header">
      <div
        aria-hidden
        className="home-footer-pattern pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${HOME_IMAGES.bgPattern})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />

      <div className="relative mx-auto w-full max-w-[1512px] px-4 py-10 min-[834px]:px-12">
        <div
          dir="ltr"
          className="flex flex-col gap-10 min-[834px]:flex-row min-[834px]:items-start min-[834px]:justify-between"
        >
          {/* Quick access — physical left */}
          <div className="flex w-full flex-col items-center gap-4 text-center min-[834px]:w-[240px] min-[834px]:items-center">
            <h3 className="text-[28px] font-bold leading-10 text-content-muted">{t('quickAccess')}</h3>
            <span aria-hidden className="h-px w-full max-w-[208px] bg-border" />
            <div className="flex flex-col items-center gap-1">
              {FOOTER_QUICK_LINKS.map((key) => (
                <Link
                  key={key}
                  href="#"
                  dir="rtl"
                  className="rounded-full px-4 py-2.5 text-sm font-semibold leading-5 tracking-[0.0071em] text-content transition-colors hover:bg-muted"
                >
                  {t(key)}
                </Link>
              ))}
            </div>
          </div>

          {/* Brand + social — center */}
          <div className="flex flex-1 flex-col items-center gap-[18px] text-center min-[834px]:max-w-[560px]">
            <h2 className="text-[32px] font-bold leading-10 text-primary">{t('brand')}</h2>
            <span aria-hidden className="h-1 w-[171px] rounded-full bg-warning-400" />
            <p
              dir="rtl"
              className="max-w-[354px] text-justify text-base font-bold leading-6 tracking-[0.0094em] text-content"
            >
              {t('description')}
            </p>
            <div className="flex items-center gap-[29px] pt-2">
              <SocialIcon label="X" src={HOME_IMAGES.socialX} />
              <SocialIcon label="LinkedIn" src={HOME_IMAGES.socialLinkedIn} />
              <SocialIcon label="Instagram" src={HOME_IMAGES.socialInstagram} />
            </div>
          </div>

          {/* Logo group — physical right */}
          <div className="flex flex-col items-center gap-8 py-8 text-center min-[834px]:w-[330px]">
            <Image
              src={HOME_IMAGES.logo}
              alt={t('logoAlt')}
              width={285}
              height={113}
              className="h-[113px] w-[285px] object-contain"
            />
            <div className="flex items-end gap-4">
              <Image
                src={HOME_IMAGES.footerDeco1}
                alt=""
                width={150}
                height={150}
                aria-hidden
                className="size-[150px] rounded-full object-cover"
              />
              <Image
                src={HOME_IMAGES.footerDeco2}
                alt=""
                width={125}
                height={136}
                aria-hidden
                className="h-[136px] w-[125px] rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-border">
        <div
          dir="ltr"
          className="mx-auto flex w-full max-w-[1512px] flex-col gap-4 px-4 py-4 min-[834px]:flex-row min-[834px]:items-center min-[834px]:justify-between min-[834px]:px-12"
        >
          <p dir="rtl" className="text-base font-bold leading-6 tracking-[0.0094em] text-content-muted">
            {t('copyright')}
          </p>
          <nav
            className="flex flex-wrap items-center justify-end gap-[18px]"
            aria-label={t('legalNav')}
          >
            {FOOTER_LEGAL_LINKS.map((key) => (
              <Link
                key={key}
                href="#"
                dir="rtl"
                className="text-base font-bold leading-6 tracking-[0.0094em] text-content-muted transition-colors hover:text-content"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ label, src }: { label: string; src: string }) {
  return (
    <Link
      href="#"
      aria-label={label}
      className="inline-flex size-10 items-center justify-center transition-opacity hover:opacity-80"
    >
      <Image src={src} alt="" width={40} height={40} aria-hidden className="size-10 object-contain" />
    </Link>
  );
}
