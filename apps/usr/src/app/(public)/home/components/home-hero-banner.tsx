'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState, type CSSProperties } from 'react';

import { cn } from '@/lib/utils';
import { lalezar } from '@/lib/fonts';

import {
  HERO_ARTBOARD,
  HERO_SLIDES,
  artboardStyle,
  type HeroSlideConfig,
  type HeroTextAlign,
} from '../data/hero-banner';

const AUTO_ADVANCE_MS = 6000;

const ALIGN_CLASS: Record<HeroTextAlign, string> = {
  end: 'items-end text-right',
  start: 'items-end text-right',
  center: 'items-center text-center',
};

function textBoxStyle(slide: HeroSlideConfig): CSSProperties {
  const { width: aw, height: ah } = HERO_ARTBOARD;
  return {
    left: `${(slide.text.x / aw) * 100}%`,
    top: `${(slide.text.y / ah) * 100}%`,
    width: `${(slide.text.w / aw) * 100}%`,
    gap: slide.text.gap,
  };
}

function HeroCopyLines({ slide }: { slide: HeroSlideConfig }) {
  const t = useTranslations('home.hero');
  const isCenter = slide.text.align === 'center';

  return (
    <>
      <p
        className={cn(
          'w-full font-bold text-neutral-white',
          isCenter ? 'text-sm leading-5' : 'text-base leading-6 tracking-[0.0094em]',
          slide.type.brand
        )}
      >
        {t(slide.keys.brand)}
      </p>
      <p
        className={cn(
          lalezar.className,
          'w-full text-base leading-5 text-neutral-white',
          slide.type.tagline
        )}
      >
        {t(slide.keys.tagline)}
      </p>
      <p
        className={cn(
          lalezar.className,
          'w-full max-w-[239px] text-sm leading-5 text-neutral-white min-[834px]:max-w-none',
          slide.type.description
        )}
      >
        {t(slide.keys.description)}
      </p>
    </>
  );
}

/** Figma Main Banner #678:5121 — artboard-scaled crops + copy. */
export function HomeHeroBanner() {
  const t = useTranslations('home.hero');
  const [activeIndex, setActiveIndex] = useState(0);
  const active = HERO_SLIDES[activeIndex] ?? HERO_SLIDES[0];

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      dir="ltr"
      className={cn(
        'relative w-full overflow-hidden rounded-2xl bg-home-hero shadow-home-elevation-4',
        'min-[834px]:aspect-[1312/480] min-[834px]:rounded-3xl'
      )}
      aria-roledescription="carousel"
      aria-label={t('slidesLabel')}
    >
      {/* Mobile — cover fill (no artboard crop) */}
      <div className="absolute inset-0 min-[834px]:hidden" aria-hidden>
        {HERO_SLIDES.map((slide, index) => (
          <Image
            key={`m-${slide.id}`}
            src={slide.imageSrc}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={cn(
              'object-cover object-center transition-opacity duration-500',
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            )}
          />
        ))}
      </div>

      {/* Desktop — Figma image rects on 1312×480 artboard */}
      <div className="absolute inset-0 hidden overflow-hidden min-[834px]:block" aria-hidden>
        {HERO_SLIDES.map((slide, index) => (
          <Image
            key={`d-${slide.id}`}
            src={slide.imageSrc}
            alt=""
            width={slide.image.w}
            height={slide.image.h}
            priority={index === 0}
            sizes="1312px"
            className={cn(
              'pointer-events-none absolute max-w-none transition-opacity duration-500',
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            )}
            style={artboardStyle(slide.image)}
          />
        ))}
      </div>

      {/* Mobile copy */}
      <div
        key={`mobile-${active.id}`}
        dir="rtl"
        className={cn(
          'relative z-10 mx-auto flex min-h-[242px] w-full max-w-[259px] flex-col justify-center gap-3 px-1 py-8',
          'animate-in fade-in-0 duration-500 min-[834px]:hidden',
          ALIGN_CLASS[active.text.align]
        )}
      >
        <HeroCopyLines slide={active} />
      </div>

      {/* Desktop copy — absolute artboard placement */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={`desktop-${slide.id}`}
            dir="rtl"
            aria-hidden={!isActive}
            className={cn(
              'absolute z-10 hidden flex-col transition-opacity duration-500 min-[834px]:flex',
              ALIGN_CLASS[slide.text.align],
              isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
            style={textBoxStyle(slide)}
          >
            <HeroCopyLines slide={slide} />
          </div>
        );
      })}

      <CarouselDots
        count={HERO_SLIDES.length}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        className={cn(
          'relative z-10 mx-auto mb-4',
          'min-[834px]:absolute min-[834px]:left-1/2 min-[834px]:top-[calc(452/480*100%)] min-[834px]:mb-0 min-[834px]:-translate-x-1/2'
        )}
        activeClassName="bg-home-carousel-inactive"
        inactiveClassName="bg-primary"
      />
    </section>
  );
}

type CarouselDotsProps = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
};

export function CarouselDots({
  count,
  activeIndex,
  onSelect,
  className,
  activeClassName = 'bg-primary',
  inactiveClassName = 'bg-home-carousel-inactive',
}: CarouselDotsProps) {
  return (
    <div className={cn('flex items-center gap-3', className)} role="tablist" aria-label="اسلایدها">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          aria-label={`اسلاید ${index + 1}`}
          onClick={() => onSelect(index)}
          className={cn(
            'size-2.5 shrink-0 rounded-full transition-colors',
            index === activeIndex ? activeClassName : inactiveClassName
          )}
        />
      ))}
    </div>
  );
}
