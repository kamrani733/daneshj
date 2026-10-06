import { Eye } from 'lucide-react';
import Image from 'next/image';

import { HOVER_MEDIA_TEXT, HoverMediaCard } from '@/components/cards/hover-media-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from '@/components/ui/rating-stars';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

export type NewsletterCardData = {
  title: string;
  description: string;
  imageSrc: string;
  publisherName: string;
  publisherInitial: string;
  publishedAt: string;
  rating: number;
  reviewCount: number;
  viewCount?: number;
  periodLabel?: string;
};

type NewsletterCardProps = NewsletterCardData & { href?: string; className?: string };

/** Newsletter card (public panel «خبرنامه»; Nwl service) with the shared hover. */
export function NewsletterCard({
  title,
  description,
  imageSrc,
  publisherName,
  publisherInitial,
  publishedAt,
  rating,
  reviewCount,
  viewCount,
  periodLabel,
  href,
  className,
}: NewsletterCardProps) {
  return (
    <HoverMediaCard
      href={href}
      className={className}
      mediaHeightClassName="h-[188px]"
      header={
        <div className="flex items-center gap-2 px-4 pt-4 pb-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-surface-container-high text-label-small font-bold text-on-surface">
              {publisherInitial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-label-medium font-medium text-on-surface">
              {publisherName}
            </p>
            <p className="text-label-small text-on-surface-variant">{publishedAt}</p>
          </div>
        </div>
      }
      media={
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 720px) 100vw, 25vw"
          className="object-cover"
        />
      }
      mediaOverlay={
        viewCount != null ? (
          <Badge variant="viewcount" className="absolute end-2.5 top-2.5 z-10">
            <Eye aria-hidden />
            {formatFaNumber(viewCount)}
          </Badge>
        ) : null
      }
      bodyClassName="gap-2 p-4"
    >
      <h3 className={cn('text-title-small font-bold text-on-surface', HOVER_MEDIA_TEXT)}>
        {title}
      </h3>
      {description ? (
        <p className={cn('text-label-medium text-on-surface-variant', HOVER_MEDIA_TEXT)}>
          {description}
        </p>
      ) : null}
      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <RatingStars rating={rating} reviewCount={reviewCount} className={HOVER_MEDIA_TEXT} />
        {periodLabel ? (
          <span className={cn('text-label-medium text-on-surface-variant', HOVER_MEDIA_TEXT)}>
            {periodLabel}
          </span>
        ) : null}
      </div>
    </HoverMediaCard>
  );
}
