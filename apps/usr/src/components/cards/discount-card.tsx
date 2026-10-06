import { Clock } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';

import { HOVER_MEDIA_TEXT, HoverMediaCard } from '@/components/cards/hover-media-card';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from '@/components/ui/rating-stars';
import { cn } from '@/lib/utils';

export type DiscountCardData = {
  title: string;
  businessName: string;
  imageSrc: string;
  imageAlt?: string;
  /** Time chip on the image, e.g. «دو ساعت پیش». */
  postedAgo?: string;
  /** Orange pill, e.g. «۳۰٪ تخفیف». */
  discountBadge?: string;
  originalPrice?: string;
  finalPrice: string;
  rating?: number;
  reviewCount?: number;
};

type DiscountCardProps = DiscountCardData & {
  /**
   * `compact` (default): rating on phone / tablet cards only — desktop Figma card
   * has none. `always`: search results show it at every width.
   */
  ratingVisibility?: 'compact' | 'always' | 'never';
  /** Extra chips on the image (search: sell count, address). */
  extraChips?: ReactNode;
  href?: string;
  className?: string;
};

/**
 * Product discount card (Figma catalog + home): image + time chip, business
 * title · product name, discount pill, original / final price.
 */
export function DiscountCard({
  title,
  businessName,
  imageSrc,
  imageAlt,
  postedAgo,
  discountBadge,
  originalPrice,
  finalPrice,
  rating,
  reviewCount,
  ratingVisibility = 'compact',
  extraChips,
  href,
  className,
}: DiscountCardProps) {
  const showRating = ratingVisibility !== 'never' && rating != null;

  return (
    <HoverMediaCard
      href={href}
      className={className}
      mediaHeightClassName="h-[188px]"
      media={
        <Image
          src={imageSrc}
          alt={imageAlt ?? title}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1280px) 50vw, 320px"
          className="object-cover"
        />
      }
      mediaOverlay={
        postedAgo || extraChips ? (
          <div className="absolute end-2.5 top-2.5 z-10 flex max-w-[calc(100%-1.25rem)] flex-wrap items-center gap-2">
            {postedAgo ? (
              <Badge variant="time">
                <Clock aria-hidden />
                {postedAgo}
              </Badge>
            ) : null}
            {extraChips}
          </div>
        ) : null
      }
      bodyClassName="gap-2 p-4"
    >
      <h3 className={cn('truncate text-title-small font-bold text-on-surface', HOVER_MEDIA_TEXT)}>
        {businessName}
      </h3>
      <p className={cn('truncate text-body-small text-on-surface-variant', HOVER_MEDIA_TEXT)}>
        {title}
      </p>
      {showRating ? (
        <RatingStars
          rating={rating}
          reviewCount={reviewCount}
          className={cn(
            ratingVisibility === 'compact' && 'min-[960px]:hidden',
            HOVER_MEDIA_TEXT
          )}
        />
      ) : null}

      <div className="mt-auto flex w-full items-center justify-between gap-2 whitespace-nowrap">
        <div className="flex min-w-0 items-center gap-2">
          {discountBadge ? (
            <Badge variant="warning" className="h-7 px-3 text-label-medium">
              {discountBadge}
            </Badge>
          ) : null}
          {originalPrice ? (
            <span className={cn('text-label-medium text-outline line-through', HOVER_MEDIA_TEXT)}>
              {originalPrice}
            </span>
          ) : null}
        </div>
        <span className={cn('text-title-semi-large font-bold text-primary', HOVER_MEDIA_TEXT)}>
          {finalPrice}
        </span>
      </div>
    </HoverMediaCard>
  );
}
