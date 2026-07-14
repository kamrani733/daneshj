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

type SlideStyle = {
  surface: string;
  text: string;
  action: string;
};

const SLIDE_STYLES: Record<PromoSlide['tone'], SlideStyle> = {
  primary: {
    surface: 'bg-primary-subtle',
    text: 'text-accent-foreground',
    action: 'bg-accent-foreground text-primary-foreground',
  },
  invite: {
    surface: 'bg-info-100',
    text: 'text-info',
    action: 'bg-info text-primary-foreground',
  },
  reward: {
    surface: 'bg-warning-subtle',
    text: 'text-warning-700',
    action: 'bg-warning-700 text-primary-foreground',
  },
};

function PromoSplitButton({
  label,
  nextLabel,
  actionClass,
  onNext,
  className,
}: {
  label: string;
  nextLabel: string;
  actionClass: string;
  onNext?: () => void;
  className?: string;
}) {
  return (
    <div dir="ltr" className={cn('inline-flex h-12 gap-0.5', className)}>
      <button
        type="button"
        aria-label={nextLabel}
        onClick={onNext}
        className={cn(
          'inline-flex w-12 shrink-0 items-center justify-center rounded-s-2xl rounded-e-sm',
          actionClass
        )}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center rounded-s-sm rounded-e-2xl px-3 text-sm font-medium leading-5 tracking-[0.0071em]',
          actionClass
        )}
      >
        {label}
      </button>
    </div>
  );
}

function PromoSlideDecor({ className }: { className?: string }) {
  return (
    <>
      <Image
        src={HOME_IMAGES.promoDecor}
        alt=""
        width={570}
        height={395}
        aria-hidden
        className={cn(
          'pointer-events-none absolute left-0 bottom-0 h-[250px] w-[min(96%,346px)] object-contain object-bottom min-[834px]:-top-[95px] min-[834px]:h-[395px] min-[834px]:w-[570px]',
          className
        )}
      />
      <Image
        src={HOME_IMAGES.bgPattern}
        alt=""
        width={516}
        height={258}
        aria-hidden
        className="pointer-events-none absolute right-0 top-[42px] hidden h-[258px] w-[min(40%,516px)] object-contain object-right min-[834px]:block"
      />
    </>
  );
}

/** Figma Banner #1:9072 */
export function HomePromoBanner() {
  const t = useTranslations('home');
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = PROMO_SLIDES[activeIndex];
  const styles = SLIDE_STYLES[slide.tone];

  const goPrev = () => setActiveIndex((index) => (index === 0 ? PROMO_SLIDES.length - 1 : index - 1));
  const goNext = () => setActiveIndex((index) => (index === PROMO_SLIDES.length - 1 ? 0 : index + 1));

  return (
    <section className="flex w-full flex-col gap-6 min-[834px]:gap-12">
      <SectionTitle
        title={t('promo.sectionTitle')}
        variant="wide"
        className="hidden w-[384px] shrink-0 self-start min-[834px]:inline-flex"
      />
      <SectionTitle
        title={t('promo.sectionTitle')}
        variant="wide"
        className="!min-h-[41px] !w-auto !max-w-[210px] self-start min-[834px]:hidden [&_h2]:pt-0 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:leading-5 [&_img]:bottom-0 [&_img]:h-[38px] [&_img]:w-[196px]"
      />

      <div className="relative min-[834px]:h-[342px]">
        <article
          className={cn(
            'relative hidden h-[300px] rounded-3xl shadow-home-elevation-3 min-[834px]:block',
            styles.surface
          )}
        >
          <PromoSlideDecor />

          <div className="absolute right-[123px] top-9 z-10 flex w-[min(612px,calc(100%-246px))] flex-col gap-6">
            <p className={cn('text-justify text-xl font-bold leading-[52px]', styles.text)}>
              {t(slide.body)}
            </p>
            <PromoSplitButton
              label={t(slide.cta)}
              nextLabel={t('promo.next')}
              actionClass={styles.action}
              onNext={goNext}
            />
          </div>

          <button
            type="button"
            aria-label={t('promo.prev')}
            onClick={goPrev}
            className="absolute left-4 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary/30 shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur"
          >
            <ChevronLeft className="size-5 text-content" />
          </button>
          <button
            type="button"
            aria-label={t('promo.next')}
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary/30 shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur"
          >
            <ChevronRight className="size-5 text-content" />
          </button>
        </article>

        <div className="-mx-4 flex flex-row-reverse gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] min-[834px]:hidden">
          {PROMO_SLIDES.map((promoSlide) => {
            const mobileStyles = SLIDE_STYLES[promoSlide.tone];
            return (
              <article
                key={promoSlide.id}
                className={cn(
                  'relative h-[405px] w-[361px] max-w-[calc(100%-2rem)] shrink-0 overflow-hidden rounded-3xl shadow-home-elevation-3',
                  mobileStyles.surface
                )}
              >
                <PromoSlideDecor className="opacity-60" />
                <div className="relative z-10 flex h-full flex-col gap-4 p-6">
                  <p className={cn('w-[313px] max-w-full text-justify text-base font-bold leading-[52px]', mobileStyles.text)}>
                    {t(promoSlide.body)}
                  </p>
                  <PromoSplitButton
                    label={t(promoSlide.cta)}
                    nextLabel={t('promo.next')}
                    actionClass={mobileStyles.action}
                    className="mt-auto self-start"
                  />
                </div>
              </article>
            );
          })}
        </div>

        <CarouselDots
          count={PROMO_SLIDES.length}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          className="absolute left-1/2 top-[332px] hidden -translate-x-1/2 min-[834px]:flex"
        />
      </div>
    </section>
  );
}
