'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, type CSSProperties } from 'react';

import { cn } from '@/lib/utils';

import {
  PROMO_FRAME,
  PROMO_MOBILE,
  PROMO_SLIDES,
  PROMO_SURFACE,
  PROMO_TONE_CLASS,
  surfaceStyle,
  type PromoSlideConfig,
} from '../data/promo-banner';
import { HOME_IMAGES } from '../home-assets';
import { CarouselDots } from './home-hero-banner';
import { SectionTitle } from './section-title';

function boxStyle(x: number, y: number, w?: number): CSSProperties {
  const { width: aw, height: ah } = PROMO_SURFACE;
  return {
    left: `${(x / aw) * 100}%`,
    top: `${(y / ah) * 100}%`,
    ...(w != null ? { width: `${(w / aw) * 100}%` } : null),
  };
}

/** Figma Split button — icon advances slide · label is CTA link. */
function PromoSplitButton({
  label,
  href,
  nextLabel,
  actionClass,
  onNext,
  className,
  compact = false,
}: {
  label: string;
  href: string;
  nextLabel: string;
  actionClass: string;
  onNext?: () => void;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      dir="ltr"
      className={cn(
        'inline-flex items-center gap-0.5',
        compact ? 'h-8' : 'h-12',
        className
      )}
    >
      <button
        type="button"
        aria-label={nextLabel}
        onClick={onNext}
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-s-2xl rounded-e-sm',
          compact ? 'size-8' : 'h-8 w-12',
          actionClass
        )}
      >
        <ChevronLeft className={compact ? 'size-3.5' : 'size-[22px]'} />
      </button>
      <Link
        href={href}
        className={cn(
          'inline-flex h-8 items-center justify-center rounded-s-sm rounded-e-2xl font-medium tracking-[0.0071em]',
          compact ? 'px-2 text-xs leading-4' : 'px-3 text-sm leading-5',
          actionClass
        )}
      >
        {label}
      </Link>
    </div>
  );
}

function PromoNavButton({
  label,
  onClick,
  side,
  tintClass,
}: {
  label: string;
  onClick: () => void;
  side: 'left' | 'right';
  tintClass: string;
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  /* Figma Left #31:8446 x:16 y:130 · Right #31:8444 x:1256 y:130 · 40×40 */
  const x = side === 'left' ? 16 : 1256;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'absolute z-20 flex size-10 items-center justify-center rounded-full text-content shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur',
        tintClass
      )}
      style={boxStyle(x, 130)}
    >
      <Icon className="size-5" />
    </button>
  );
}

function PromoDesktopSlide({
  slide,
  body,
  cta,
  nextLabel,
  prevLabel,
  onPrev,
  onNext,
  active,
}: {
  slide: PromoSlideConfig;
  body: string;
  cta: string;
  nextLabel: string;
  prevLabel: string;
  onPrev: () => void;
  onNext: () => void;
  active: boolean;
}) {
  const tone = PROMO_TONE_CLASS[slide.tone];

  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-500',
        active ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      aria-hidden={!active}
    >
      <div
        className={cn(
          'absolute inset-x-0 top-0  rounded-3xl shadow-home-elevation-3',
          tone.surface
        )}
        style={{ height: `${(PROMO_SURFACE.height / PROMO_FRAME.height) * 100}%` }}
      >
        <Image
          src={HOME_IMAGES.bgPattern}
          alt=""
          width={516}
          height={258}
          aria-hidden
          className="home-promo-pattern pointer-events-none absolute object-contain"
          style={surfaceStyle({ x: 796, y: 42, w: 516, h: 258 })}
        />

        <Image
          src={slide.decorSrc}
          alt=""
          width={slide.decor.w}
          height={slide.decor.h}
          aria-hidden
          className="home-promo-decor pointer-events-none absolute max-w-none object-contain"
          style={surfaceStyle(slide.decor)}
        />

        <div
          className="absolute z-10"
          style={boxStyle(slide.text.x, slide.text.y, slide.text.w)}
        >
          <p className={cn('w-full text-justify text-xl font-bold leading-[52px]', tone.text)}>
            {body}
          </p>
        </div>

        <div className="absolute z-10" style={boxStyle(slide.button.x, slide.button.y)}>
          <PromoSplitButton
            label={cta}
            href={slide.href}
            nextLabel={nextLabel}
            actionClass={tone.action}
            onNext={onNext}
          />
        </div>

        <PromoNavButton label={prevLabel} onClick={onPrev} side="left" tintClass={slide.arrowTint} />
        <PromoNavButton label={nextLabel} onClick={onNext} side="right" tintClass={slide.arrowTint} />
      </div>
    </div>
  );
}

function PromoMobileCard({
  slide,
  body,
  cta,
  nextLabel,
}: {
  slide: PromoSlideConfig;
  body: string;
  cta: string;
  nextLabel: string;
}) {
  const tone = PROMO_TONE_CLASS[slide.tone];
  const decor = PROMO_MOBILE.decorByTone[slide.tone];

  return (
    <article
      className={cn(
        'relative h-[405px] w-[361px] max-w-[calc(100%-2rem)] shrink-0 overflow-hidden rounded-3xl shadow-home-elevation-3',
        tone.surface
      )}
    >
      <Image
        src={slide.decorSrc}
        alt=""
        width={decor.w}
        height={decor.h}
        aria-hidden
        className="home-promo-decor pointer-events-none absolute object-contain opacity-60 dark:opacity-50"
        style={{ left: decor.x, top: decor.y, width: decor.w, height: decor.h }}
      />
      <div className="relative z-10 flex h-full flex-col gap-4 p-6">
        <p
          className={cn(
            'w-[313px] max-w-full text-justify text-base font-bold leading-[52px]',
            tone.text
          )}
        >
          {body}
        </p>
        <PromoSplitButton
          label={cta}
          href={slide.href}
          nextLabel={nextLabel}
          actionClass={tone.action}
          compact
          className="mt-auto self-start"
        />
      </div>
    </article>
  );
}

/** Figma Temp Banner #31:8259 — artboard-scaled desktop · mobile cards. */
export function HomePromoBanner() {
  const t = useTranslations('home');
  const [activeIndex, setActiveIndex] = useState(0);

  const goPrev = () =>
    setActiveIndex((i) => (i === 0 ? PROMO_SLIDES.length - 1 : i - 1));
  const goNext = () =>
    setActiveIndex((i) => (i === PROMO_SLIDES.length - 1 ? 0 : i + 1));

  return (
    <section className="flex w-full flex-col gap-6 min-[834px]:gap-8 min-[1512px]:gap-12">
      <SectionTitle
        title={t('promo.sectionTitle')}
        variant="wide"
        className={cn(
          '!min-h-[41px] !w-auto !max-w-[210px] self-start',
          'min-[834px]:!min-h-[56px] min-[834px]:!max-w-[280px]',
          'min-[1512px]:w-[384px] min-[1512px]:!max-w-none',
          '[&_h2]:pt-0 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:leading-5',
          'min-[834px]:[&_h2]:text-lg min-[834px]:[&_h2]:leading-7',
          '[&_img]:bottom-0 [&_img]:h-[38px] [&_img]:w-[196px]',
          'min-[834px]:[&_img]:h-[48px] min-[834px]:[&_img]:w-[240px]'
        )}
      />

      <div
        className="relative hidden w-full min-[834px]:block min-[834px]:aspect-[1312/342]"
        aria-roledescription="carousel"
        aria-label={t('promo.sectionTitle')}
      >
        {PROMO_SLIDES.map((slide, index) => (
          <PromoDesktopSlide
            key={slide.id}
            slide={slide}
            body={t(slide.bodyKey)}
            cta={t(slide.ctaKey)}
            nextLabel={t('promo.next')}
            prevLabel={t('promo.prev')}
            onPrev={goPrev}
            onNext={goNext}
            active={index === activeIndex}
          />
        ))}

        <CarouselDots
          count={PROMO_SLIDES.length}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          className="absolute left-1/2 top-[calc(332/342*100%)] -translate-x-1/2"
        />
      </div>

      <div className="-mx-4 flex flex-row-reverse gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] min-[834px]:hidden">
        {PROMO_SLIDES.map((slide) => (
          <PromoMobileCard
            key={slide.id}
            slide={slide}
            body={t(slide.bodyKey)}
            cta={t(slide.ctaKey)}
            nextLabel={t('promo.next')}
          />
        ))}
      </div>
    </section>
  );
}
