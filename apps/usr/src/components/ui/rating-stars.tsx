import { Star } from 'lucide-react';

import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type RatingStarsProps = {
  rating: number;
  reviewCount?: number;
  className?: string;
};

export function RatingStars({ rating, reviewCount, className }: RatingStarsProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-label-medium text-on-surface',
        className
      )}
    >
      <Star className="size-3.5 fill-rating text-rating" aria-hidden />
      <span>
        {formatFaNumber(rating)}
        {reviewCount != null ? ` (${formatFaNumber(reviewCount)})` : null}
      </span>
    </span>
  );
}
