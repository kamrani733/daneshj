import Image from 'next/image';

import { cn } from '@/lib/utils';

import { HOME_IMAGES } from '../home-assets';

export type SectionTitleProps = {
  title: string;
  className?: string;
};

/** Figma Title Box — 24/36 headline/small-Bold + accent SVG #1:8906. */
export function SectionTitle({ title, className }: SectionTitleProps) {
  return (
    <div className={cn('relative inline-flex min-h-[89px] w-full max-w-[384px] items-start justify-end', className)}>
      <Image
        src={HOME_IMAGES.sectionTitleAccent}
        alt=""
        width={336}
        height={63}
        aria-hidden
        className="pointer-events-none absolute bottom-[11px] end-0 h-[63px] w-[min(336px,88%)] object-contain object-bottom"
      />
      <h2 className="relative z-10 pt-6 text-2xl font-bold leading-9 text-primary">{title}</h2>
    </div>
  );
}
