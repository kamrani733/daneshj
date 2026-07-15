'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { lalezar } from '@/lib/fonts';

import { HOME_IMAGES } from '../home-assets';

const SLIDE_COUNT = 3;

/** Figma Main Banner #5847:169282 — 1312×480, text at x=876 y=130 w=372, dots y=452. */
export function HomeHeroBanner() {
  const t = useTranslations('home.hero');
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section
      dir="ltr"
      className="relative w-full overflow-hidden rounded-2xl bg-home-hero shadow-home-elevation-4 min-[834px]:h-[480px] min-[834px]:rounded-3xl"
    >
      <Image
        src={HOME_IMAGES.heroBg}
        alt=""
        fill
        priority
        sizes="(max-width: 834px) 100vw, 1312px"
        className="home-hero-image object-cover object-center"
      />

      <div
        dir="rtl"
        className={cn(
          'relative z-10 mx-auto flex min-h-[242px] w-full max-w-[259px] flex-col items-end justify-center gap-3 px-1 py-8 text-right',
          'min-[834px]:absolute min-[834px]:right-[64px] min-[834px]:top-[130px] min-[834px]:mx-0 min-[834px]:min-h-0 min-[834px]:max-w-none min-[834px]:w-[372px] min-[834px]:gap-12 min-[834px]:px-0 min-[834px]:py-0'
        )}
      >
        <h1 className="w-full text-base font-bold leading-6 tracking-[0.0094em] text-neutral-white min-[834px]:text-[28px] min-[834px]:leading-10 min-[834px]:tracking-normal">
          {t('brand')}
        </h1>
        <p
          className={cn(
            lalezar.className,
            'w-full text-base leading-5 text-neutral-white min-[834px]:text-[28px] min-[834px]:leading-7'
          )}
        >
          {t('tagline')}
        </p>
        <p
          className={cn(
            lalezar.className,
            'w-full max-w-[239px] text-sm leading-5 text-neutral-white min-[834px]:max-w-none min-[834px]:text-xl min-[834px]:leading-7'
          )}
        >
          {t('description')}
        </p>
      </div>

      <CarouselDots
        count={SLIDE_COUNT}
        activeIndex={activeSlide}
        onSelect={setActiveSlide}
        className="relative z-10 mx-auto mb-4 min-[834px]:absolute min-[834px]:left-1/2 min-[834px]:top-[452px] min-[834px]:mb-0 min-[834px]:-translate-x-1/2"
      />
    </section>
  );
}

type CarouselDotsProps = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
};

export function CarouselDots({ count, activeIndex, onSelect, className }: CarouselDotsProps) {
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
            'size-2.5 rounded-full transition-colors',
            index === activeIndex ? 'bg-primary' : 'bg-home-carousel-inactive'
          )}
        />
      ))}
    </div>
  );
}
