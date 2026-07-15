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

/** Figma Banner1/2/3 — light #1:10555–10849 · dark #1:11129–11423 */
const SLIDE_STYLES: Record<PromoSlide['tone'], SlideStyle> = {
  primary: {
    surface: 'bg-home-promo-primary',
    text: 'text-home-promo-primary',
    action: 'bg-home-promo-primary-action',
  },
  invite: {
    surface: 'bg-home-promo-invite',
    text: 'text-home-promo-invite',
    action: 'bg-home-promo-invite-action',
  },
  reward: {
    surface: 'bg-home-promo-reward',
    text: 'text-home-promo-reward',
    action: 'bg-home-promo-reward-action',
  },
};

type PromoSplitButtonProps = {
  label: string;
  nextLabel: string;
  actionClass: string;
  onNext?: () => void;
  className?: string;
  size?: 'sm' | 'md';
};

function PromoSplitButton({
  label,
  nextLabel,
  actionClass,
  onNext,
  className,
  size = 'md',
}: PromoSplitButtonProps) {
  const isSm = size === 'sm';

  return (
    <div
      dir="ltr"
      className={cn('inline-flex items-center gap-0.5', isSm ? 'h-[30px]' : 'h-8', className)}
    >
      <button
        type="button"
        aria-label={nextLabel}
        onClick={onNext}
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-s-2xl rounded-e-sm',
          isSm ? 'h-[30px] w-[30px]' : 'h-8 w-12',
          actionClass
        )}
      >
        <ChevronLeft className={isSm ? 'size-3.5' : 'size-[22px]'} />
      </button>
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center rounded-s-sm rounded-e-2xl font-medium tracking-[0.0071em]',
          isSm
            ? 'h-[20px] px-1.5 text-[9px] leading-[13px]'
            : 'h-8 px-3 text-sm leading-5',
          actionClass
        )}
      >
        {label}
      </button>
    </div>
  );
}

function PromoSlideDecor({
  className,
  variant = 'desktop',
}: {
  className?: string;
  variant?: 'mobile' | 'tablet' | 'desktop';
}) {
  return (
    <>
      <Image
        src={HOME_IMAGES.promoDecor}
        alt=""
        width={570}
        height={395}
        aria-hidden
        className={cn(
          'home-promo-decor pointer-events-none absolute object-contain object-bottom',
          variant === 'mobile' &&
            'bottom-0 left-0 h-[250px] w-[min(96%,346px)] opacity-60 dark:opacity-50',
          variant === 'tablet' &&
            'left-0 top-[-60px] h-[251px] w-[362px] max-w-[48%]',
          variant === 'desktop' &&
            'bottom-0 left-0 h-[250px] w-[min(96%,346px)] min-[1512px]:-top-[95px] min-[1512px]:bottom-auto min-[1512px]:h-[395px] min-[1512px]:w-[570px]',
          className
        )}
      />
      {variant !== 'mobile' ? (
        <Image
          src={HOME_IMAGES.bgPattern}
          alt=""
          width={516}
          height={258}
          aria-hidden
          className={cn(
            'home-promo-pattern pointer-events-none absolute object-contain object-right',
            variant === 'tablet' && 'right-0 top-[27px] h-[164px] w-[min(40%,328px)]',
            variant === 'desktop' && 'right-0 top-[42px] h-[258px] w-[min(40%,516px)]'
          )}
        />
      ) : null}
    </>
  );
}

type PromoCarouselProps = {
  styles: SlideStyle;
  body: string;
  cta: string;
  nextLabel: string;
  prevLabel: string;
  onPrev: () => void;
  onNext: () => void;
  variant: 'tablet' | 'desktop';
};

function PromoCarousel({
  styles,
  body,
  cta,
  nextLabel,
  prevLabel,
  onPrev,
  onNext,
  variant,
}: PromoCarouselProps) {
  const isTablet = variant === 'tablet';

  return (
    <article
      className={cn(
        'relative w-full overflow-hidden shadow-home-elevation-3',
        styles.surface,
        isTablet
          ? 'h-[190px] rounded-2xl'
          : 'h-[300px] rounded-3xl'
      )}
    >
      <PromoSlideDecor variant={variant} />

      <div
        className={cn(
          'absolute z-10 flex flex-col',
          isTablet
            ? 'right-[6%] top-[22px] w-[min(389px,48%)] gap-[15px]'
            : 'right-[123px] top-9 w-[min(612px,calc(100%-246px))] gap-6'
        )}
      >
        <p
          className={cn(
            'text-justify font-bold',
            styles.text,
            isTablet ? 'text-[13px] leading-[33px]' : 'text-xl leading-[52px]'
          )}
        >
          {body}
        </p>
        <PromoSplitButton
          label={cta}
          nextLabel={nextLabel}
          actionClass={styles.action}
          onNext={onNext}
          size={isTablet ? 'sm' : 'md'}
        />
      </div>

      <button
        type="button"
        aria-label={prevLabel}
        onClick={onPrev}
        className={cn(
          'absolute top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full bg-primary/30 text-content shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur dark:bg-primary/25 dark:text-primary-100',
          isTablet ? 'left-2.5 size-[25px]' : 'left-4 size-10'
        )}
      >
        <ChevronLeft className={isTablet ? 'size-3.5' : 'size-5'} />
      </button>
      <button
        type="button"
        aria-label={nextLabel}
        onClick={onNext}
        className={cn(
          'absolute top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full bg-primary/30 text-content shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur dark:bg-primary/25 dark:text-primary-100',
          isTablet ? 'right-2.5 size-[25px]' : 'right-4 size-10'
        )}
      >
        <ChevronRight className={isTablet ? 'size-3.5' : 'size-5'} />
      </button>
    </article>
  );
}

/**
 * Figma promo banners:
 * - Mobile #1:10553 — horizontal cards 361×405
 * - Tablet Banner-tablet #1:12984 — 833×217
 * - Desktop Banner #1:9072 — 1312×342
 */
export function HomePromoBanner() {
  const t = useTranslations('home');
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = PROMO_SLIDES[activeIndex];
  const styles = SLIDE_STYLES[slide.tone];

  const goPrev = () => setActiveIndex((index) => (index === 0 ? PROMO_SLIDES.length - 1 : index - 1));
  const goNext = () => setActiveIndex((index) => (index === PROMO_SLIDES.length - 1 ? 0 : index + 1));

  const carouselProps = {
    styles,
    body: t(slide.body),
    cta: t(slide.cta),
    nextLabel: t('promo.next'),
    prevLabel: t('promo.prev'),
    onPrev: goPrev,
    onNext: goNext,
  };

  return (
    <section className="flex w-full flex-col gap-6 min-[834px]:gap-8 min-[1512px]:gap-12">
      {/* Desktop title */}
      <SectionTitle
        title={t('promo.sectionTitle')}
        variant="wide"
        className="hidden w-[384px] shrink-0 self-start min-[1512px]:inline-flex"
      />

      {/* Tablet title */}
      <SectionTitle
        title={t('promo.sectionTitle')}
        variant="wide"
        className="hidden !min-h-[56px] !w-auto !max-w-[280px] self-start min-[834px]:inline-flex min-[1512px]:hidden [&_h2]:pt-0 [&_h2]:text-lg [&_h2]:leading-7 [&_img]:bottom-0 [&_img]:h-[48px] [&_img]:w-[240px]"
      />

      {/* Mobile title */}
      <SectionTitle
        title={t('promo.sectionTitle')}
        variant="wide"
        className="!min-h-[41px] !w-auto !max-w-[210px] self-start min-[834px]:hidden [&_h2]:pt-0 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:leading-5 [&_img]:bottom-0 [&_img]:h-[38px] [&_img]:w-[196px]"
      />

      {/* Desktop carousel — ≥1512 */}
      <div className="relative hidden min-[1512px]:block min-[1512px]:h-[342px]">
        <PromoCarousel {...carouselProps} variant="desktop" />
        <CarouselDots
          count={PROMO_SLIDES.length}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          className="absolute left-1/2 top-[332px] -translate-x-1/2"
        />
      </div>

      {/* Tablet carousel — 834–1511 · Figma Banner-tablet #1:12984 */}
      <div className="relative hidden min-[834px]:block min-[1512px]:hidden">
        <PromoCarousel {...carouselProps} variant="tablet" />
        <CarouselDots
          count={PROMO_SLIDES.length}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          className="mx-auto mt-5 justify-center"
        />
      </div>

      {/* Mobile horizontal cards — <834 · Figma #1:10553 */}
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
              <PromoSlideDecor variant="mobile" />
              <div className="relative z-10 flex h-full flex-col gap-4 p-6">
                <p
                  className={cn(
                    'w-[313px] max-w-full text-justify text-base font-bold leading-[52px]',
                    mobileStyles.text
                  )}
                >
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
    </section>
  );
}
