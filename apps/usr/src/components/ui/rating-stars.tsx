import { Star } from 'lucide-react';

import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type RatingStarsProps = {
  rating: number;
  reviewCount?: number;
  reviewCountLabel?: string;
  className?: string;
};

export function RatingStars({
  rating,
  reviewCount,
  reviewCountLabel,
  className,
}: RatingStarsProps) {
  const countText =
    reviewCountLabel ??
    (reviewCount != null ? `(${formatFaNumber(reviewCount)} نظر)` : undefined);

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center gap-0.5 text-on-surface-variant',
        className
      )}
    >
      <Star className="size-4 fill-rating text-rating" aria-hidden />
      <span className="text-title-small font-bold">{formatFaNumber(rating)}</span>
      {countText ? <span className="text-label-small font-medium">{countText}</span> : null}
    </span>
  );
}
