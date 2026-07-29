import { Star } from 'lucide-react';
import Image from 'next/image';

import type { DiscountOffer } from '@public-panel/data/public-panel-mock';
import { cn } from '@/lib/utils';

type DiscountOfferCardProps = {
  offer: DiscountOffer;
  className?: string;
};

/** Discount card — Figma service-info «تخفیف کالا و خدمات». */
export function DiscountOfferCard({ offer, className }: DiscountOfferCardProps) {
  const isPercentBadge =
    (offer.discountBadge.includes('٪') || offer.discountBadge.includes('%')) &&
    !offer.discountBadge.includes('تومان');

  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-border/40 bg-home-card shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:bg-home-search-category',
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={offer.imageSrc}
          alt={offer.title}
          fill
          sizes="(max-width: 720px) 100vw, 25vw"
          className="object-cover"
        />
        <span className="absolute end-2.5 top-2.5 rounded-md bg-[#E8F5E9] px-2 py-1 text-[11px] font-medium text-[#2E7D32] dark:bg-primary/20 dark:text-primary-100">
          {offer.postedAgo}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="flex flex-col gap-1 text-start">
          <h3 className="text-sm font-bold leading-5 text-home-filter-ink">
            {offer.title}
          </h3>
          <p className="text-xs leading-4 text-home-filter-muted">
            {offer.businessName}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col items-start gap-1">
            <span
              className={cn(
                'rounded px-1.5 py-0.5 text-[11px] font-bold leading-4 text-white',
                isPercentBadge ? 'bg-[#8B5E3C]' : 'bg-warning'
              )}
            >
              {offer.discountBadge}
            </span>
            <span className="text-[11px] leading-4 text-home-filter-muted line-through">
              {offer.originalPrice}
            </span>
            <span className="text-sm font-bold leading-5 text-primary">
              {offer.finalPrice}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-home-filter-ink">
            <Star className="size-3.5 fill-warning text-warning" aria-hidden />
            <span>
              {offer.rating} ({offer.reviewCount} نظر)
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
