import { Eye } from 'lucide-react';
import Image from 'next/image';

import { HOVER_MEDIA_TEXT, HoverMediaCard } from '@/components/cards/hover-media-card';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from '@/components/ui/rating-stars';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

export type NewsCardData = {
  title: string;
  imageSrc: string;
  viewCount: number;
  publisherType: string;
  publishedAt: string;
  summary: string;
  rating?: number;
  reviewCount?: number;
  /** Kept for catalog data; not shown on the Figma card. */
  scopeLabel?: string;
  mainCategory?: string;
  subCategory?: string;
  eventRange?: string;
};

type NewsCardProps = NewsCardData & { href?: string; className?: string };

/** News card (public panel «خبر»; Nws service) with the shared hover. */
export function NewsCard({
  title,
  imageSrc,
  viewCount,
  publisherType,
  publishedAt,
  summary,
  rating,
  reviewCount,
  href,
  className,
}: NewsCardProps) {
  return (
    <HoverMediaCard
      href={href}
      className={className}
      mediaHeightClassName="h-[188px]"
      media={
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 720px) 100vw, 33vw"
          className="object-cover"
        />
      }
      mediaOverlay={
        <Badge variant="viewcount" className="absolute end-2.5 top-2.5 z-10">
          <Eye aria-hidden />
          {formatFaNumber(viewCount)}
        </Badge>
      }
      bodyClassName="gap-2 p-4"
    >
      <h3 className={cn('text-title-small font-bold text-on-surface', HOVER_MEDIA_TEXT)}>
        {title}
      </h3>
      <p className={cn('text-label-medium text-on-surface-variant', HOVER_MEDIA_TEXT)}>
        {publisherType}
      </p>
      <div className="flex items-center justify-between gap-2">
        {rating != null ? (
          <RatingStars rating={rating} reviewCount={reviewCount} className={HOVER_MEDIA_TEXT} />
        ) : (
          <span />
        )}
        <span className={cn('text-label-medium text-on-surface-variant', HOVER_MEDIA_TEXT)}>
          {publishedAt}
        </span>
      </div>
      <p
        className={cn(
          'line-clamp-2 text-label-medium text-on-surface-variant',
          HOVER_MEDIA_TEXT
        )}
      >
        {summary}
      </p>
    </HoverMediaCard>
  );
}
