'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { PROMO_SLIDES, type PromoSlide } from '../data/home-content';
import { HOME_IMAGES } from '../home-assets';
import { CarouselDots } from './home-hero-banner';
import { SectionTitle } from './section-title';

const TONE_CLASS: Record<PromoSlide['tone'], string> = {
  primary: 'bg-primary-subtle text-accent-foreground',
  invite: 'bg-info-100 text-info',
  reward: 'bg-warning-subtle text-content',
};

/** Figma Banner — inner 1312×300 desktop, radius 24px, elevation-3. */
export function HomePromoBanner() {
  const t = useTranslations('home');
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = PROMO_SLIDES[activeIndex];

  const goPrev = () => setActiveIndex((index) => (index === 0 ? PROMO_SLIDES.length - 1 : index - 1));
  const goNext = () => setActiveIndex((index) => (index === PROMO_SLIDES.length - 1 ? 0 : index + 1));

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title={t('promo.sectionTitle')} className="self-end" />

      <div className="relative pb-10">
        {/* Desktop carousel */}
        <article
          className={cn(
            'relative hidden min-h-[300px] overflow-hidden rounded-3xl shadow-home-elevation-3 min-[834px]:block',
            TONE_CLASS[slide.tone]
          )}
        >
          <Image
            src={HOME_IMAGES.promoDecor}
            alt=""
            width={595}
            height={399}
            aria-hidden
            className="pointer-events-none absolute bottom-0 start-0 opacity-40"
          />

          <div className="relative z-10 flex flex-col items-end gap-6 px-6 py-9 min-[834px]:ms-auto min-[834px]:max-w-[612px] min-[834px]:pe-[123px] min-[834px]:pt-9">
            <p className="w-full text-justify text-xl font-bold leading-[52px] tracking-normal">
              {t(slide.body)}
            </p>

            <div className="inline-flex h-12 overflow-hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-s-2xl rounded-ee-sm bg-primary px-4 text-sm font-medium leading-5 tracking-[0.0071em] text-primary-foreground"
              >
                {t(slide.cta)}
              </button>
              <button
                type="button"
                aria-label={t('promo.next')}
                className="inline-flex w-12 items-center justify-center rounded-ee-2xl rounded-es-sm bg-primary text-primary-foreground"
              >
                <ChevronLeft className="size-5" />
              </button>
            </div>
          </div>
        </article>

        {/* Mobile horizontal banners */}
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] min-[834px]:hidden">
          {PROMO_SLIDES.map((promoSlide) => (
            <article
              key={promoSlide.id}
              className={cn(
                'flex h-[405px] w-[min(100%,340px)] shrink-0 flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-home-elevation-3',
                TONE_CLASS[promoSlide.tone]
              )}
            >
              <p className="text-justify text-base font-bold leading-[52px]">{t(promoSlide.body)}</p>
              <div className="inline-flex h-12 self-end overflow-hidden rounded-2xl">
                <button
                  type="button"
                  className="inline-flex items-center justify-center bg-primary px-4 text-sm font-medium text-primary-foreground"
                >
                  {t(promoSlide.cta)}
                </button>
                <button
                  type="button"
                  aria-label={t('promo.next')}
                  className="inline-flex w-12 items-center justify-center bg-primary text-primary-foreground"
                >
                  <ChevronLeft className="size-5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          aria-label={t('promo.prev')}
          onClick={goPrev}
          className="absolute top-[130px] start-4 hidden size-10 items-center justify-center rounded-full bg-primary/30 shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur min-[834px]:flex"
        >
          <ChevronRight className="size-5 text-content" />
        </button>
        <button
          type="button"
          aria-label={t('promo.next')}
          onClick={goNext}
          className="absolute top-[130px] end-4 hidden size-10 items-center justify-center rounded-full bg-primary/30 shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur min-[834px]:flex"
        >
          <ChevronLeft className="size-5 text-content" />
        </button>

        <CarouselDots
          count={PROMO_SLIDES.length}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          className="absolute bottom-0 start-1/2 hidden -translate-x-1/2 min-[834px]:flex"
        />
      </div>
    </section>
  );
}
