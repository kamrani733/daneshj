import { Clock, Star } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';

import { HOVER_MEDIA_TEXT, HoverMediaCard } from '@/components/cards/hover-media-card';
import { Badge } from '@/components/ui/badge';
import { formatFaNumber } from '@/lib/format-fa';
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
 * Product discount card shared by home «تخفیف‌ها», search results and the public
 * panel «محصولات من» (Figma Discount card #38:292 / Public Panel export): image +
 * time chip, business · product name, divider, discount pill, original / final price.
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
      mediaHeightClassName="h-[188px] min-[720px]:h-[200px]"
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
          <div className="absolute start-2.5 top-2.5 z-10 flex max-w-[calc(100%-1.25rem)] flex-wrap items-center gap-2">
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
      <p className={cn('truncate text-label-small text-on-surface-variant', HOVER_MEDIA_TEXT)}>
        {businessName}
      </p>
      <h3 className={cn('truncate text-title-small font-bold text-on-surface', HOVER_MEDIA_TEXT)}>
        {title}
      </h3>
      {showRating ? (
        <p
          className={cn(
            'flex items-center gap-1 text-label-medium text-on-surface-variant',
            ratingVisibility === 'compact' && 'min-[960px]:hidden',
            HOVER_MEDIA_TEXT
          )}
        >
          <Star className="size-3.5 fill-rating text-rating" aria-hidden />
          <span className="font-bold">
            {formatFaNumber(rating, Number.isInteger(rating) ? 0 : 1)}
          </span>
          {reviewCount != null ? (
            <span>({formatFaNumber(reviewCount)} نظر)</span>
          ) : null}
        </p>
      ) : null}

      <div
        className="h-px w-full bg-outline-variant motion-safe:transition-colors motion-safe:duration-500 group-hover:bg-white/30"
        aria-hidden
      />

      <div className="mt-auto flex flex-col items-start gap-2">
        {discountBadge ? (
          <Badge variant="warning" className="h-7 px-3 text-label-medium">
            {discountBadge}
          </Badge>
        ) : null}
        <div className="flex w-full items-center justify-between gap-2 whitespace-nowrap">
          {originalPrice ? (
            <span className={cn('text-label-medium text-outline line-through', HOVER_MEDIA_TEXT)}>
              {originalPrice}
            </span>
          ) : (
            <span />
          )}
          <span className={cn('text-title-semi-large font-bold text-primary', HOVER_MEDIA_TEXT)}>
            {finalPrice}
          </span>
        </div>
      </div>
    </HoverMediaCard>
  );
}
