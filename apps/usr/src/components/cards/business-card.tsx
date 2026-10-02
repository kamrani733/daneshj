import Image from 'next/image';

import { HOVER_MEDIA_TEXT, HoverMediaCard } from '@/components/cards/hover-media-card';
import { cn } from '@/lib/utils';

type BusinessCardProps = {
  title: string;
  imageSrc: string;
  imageAlt?: string;
  href?: string;
  className?: string;
};

/** Home «کسب و کار ها» card (Figma Bussiness card: 344 desktop · 260 mobile). */
export function BusinessCard({
  title,
  imageSrc,
  imageAlt,
  href,
  className,
}: BusinessCardProps) {
  return (
    <HoverMediaCard
      href={href}
      className={cn('w-[260px] shrink-0 min-[834px]:w-[344px]', className)}
      mediaHeightClassName="h-[153px] min-[834px]:h-[180px]"
      media={
        <Image
          src={imageSrc}
          alt={imageAlt ?? title}
          fill
          sizes="(max-width: 834px) 260px, 344px"
          className="object-cover"
        />
      }
      bodyClassName="p-4"
    >
      <h3 className={cn('truncate text-title-small font-bold text-on-surface', HOVER_MEDIA_TEXT)}>
        {title}
      </h3>
    </HoverMediaCard>
  );
}
