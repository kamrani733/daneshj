import { Star } from 'lucide-react';
import Image from 'next/image';

import type { DiscountOffer } from '@public-panel/data/public-panel-ui';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { CatalogOfferCardShell } from './offer-card-shell';

type DiscountOfferCardProps = {
  offer: DiscountOffer;
  className?: string;
};

/** Discount catalog card. */
export function DiscountOfferCard({ offer, className }: DiscountOfferCardProps) {
  const isPercentBadge =
    (offer.discountBadge.includes('٪') || offer.discountBadge.includes('%')) &&
    !offer.discountBadge.includes('تومان');

  return (
    <CatalogOfferCardShell
      className={cn(
        'relative hover:border-transparent hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)]',
        className
      )}
    >
      {/* Full-card image under content on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <Image
          src={offer.imageSrc}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 720px) 100vw, 25vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 h-[148px] w-full shrink-0 overflow-hidden bg-neutral-200 transition-colors duration-200 group-hover:bg-transparent">
        <Image
          src={offer.imageSrc}
          alt={offer.title}
          fill
          unoptimized
          sizes="(max-width: 720px) 100vw, 25vw"
          className="object-cover transition-opacity duration-200 group-hover:opacity-0"
        />
        <Badge className="absolute end-2.5 top-2.5 z-10 h-auto rounded-md border-0 bg-primary-50 px-2 py-1 text-[11px] font-medium text-primary-600 dark:bg-primary/20 dark:text-primary-100">
          {offer.postedAgo}
        </Badge>
      </div>

      <div className="relative z-10 flex flex-1 flex-col gap-3 bg-home-card p-3 transition-colors duration-200 group-hover:bg-transparent dark:bg-home-stat-card dark:group-hover:bg-transparent">
        <div className="flex flex-col gap-1 text-start">
          <h3 className="text-sm font-bold leading-5 text-home-filter-ink transition-colors duration-200 group-hover:text-white">
            {offer.title}
          </h3>
          <p className="text-xs leading-4 text-home-filter-muted transition-colors duration-200 group-hover:text-white/85">
            {offer.businessName}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-home-filter-ink transition-colors duration-200 group-hover:text-white">
            <Star
              className="size-3.5 fill-warning text-warning"
              aria-hidden
            />
            <span>
              {offer.rating} ({offer.reviewCount} نظر)
            </span>
          </div>

          <div className="flex flex-col items-start gap-1">
            <Badge
              variant="warning"
              className={cn(
                'h-auto rounded px-1.5 py-0.5 text-[11px] font-bold leading-4',
                isPercentBadge && 'bg-warning-700'
              )}
            >
              {offer.discountBadge}
            </Badge>
            <span className="text-[11px] leading-4 text-home-filter-muted line-through transition-colors duration-200 group-hover:text-white/75">
              {offer.originalPrice}
            </span>
            <span className="text-sm font-bold leading-5 text-primary transition-colors duration-200 group-hover:text-white">
              {offer.finalPrice}
            </span>
          </div>
        </div>
      </div>
    </CatalogOfferCardShell>
  );
}
