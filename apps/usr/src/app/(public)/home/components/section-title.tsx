import Image from 'next/image';

import { cn } from '@/lib/utils';

import { HOME_IMAGES } from '../home-assets';

export type SectionTitleProps = {
  title: string;
  /** wide #1:8904 (384px) · narrow #1:8912 discounts (239px) */
  variant?: 'wide' | 'narrow';
  className?: string;
};

/** Figma Title Box — 24/36 headline/small-Bold + accent SVG. */
export function SectionTitle({ title, variant = 'wide', className }: SectionTitleProps) {
  const isNarrow = variant === 'narrow';

  return (
    <div
      className={cn(
        'relative inline-flex min-h-[89px] w-full flex-col items-start justify-start',
        isNarrow ? 'w-[239px] max-w-[239px]' : 'max-w-[384px]',
        className
      )}
    >
      <Image
        src={HOME_IMAGES.sectionTitleAccent}
        alt=""
        width={isNarrow ? 215 : 336}
        height={63}
        aria-hidden
        className={cn(
          'pointer-events-none absolute bottom-[11px] h-[63px] object-contain object-bottom',
          isNarrow ? 'end-0 w-[215px]' : 'end-[17px] w-[min(336px,88%)]'
        )}
      />
      <h2 className="relative z-10 pt-6 text-end text-2xl font-bold leading-9 text-primary">{title}</h2>
    </div>
  );
}
