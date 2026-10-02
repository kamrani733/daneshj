import { Clock, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import type { DiscountOffer } from '@public-panel/types/ui';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/ui/price-display';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { CatalogOfferCardShell } from '@public-panel/components/catalog/offer-card-shell';

type DiscountOfferCardProps = {
  offer: DiscountOffer;
  className?: string;
};

/**
 * «محصولات من» discount card (Public Panel export): image + time chip,
 * business · product name, divider, discount pill, original / final price.
 */
export function DiscountOfferCard({ offer, className }: DiscountOfferCardProps) {
  const t = useTranslations('publicPanel.catalog');
  return (
    <CatalogOfferCardShell
      className={cn('hover:shadow-app-elevation-2', className)}
    >
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-surface-container-highest">
        <Image
          src={offer.imageSrc}
          alt={offer.title}
          fill
          unoptimized
          sizes="(max-width: 720px) 100vw, 25vw"
          className="object-cover"
        />
        <Badge variant="time" className="absolute start-2.5 top-2.5 z-10">
          <Clock aria-hidden />
          {offer.postedAgo}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 text-start">
        <p className="truncate text-label-small text-on-surface-variant">
          {offer.businessName}
        </p>
        <h3 className="truncate text-title-small font-bold text-on-surface">
          {offer.title}
        </h3>
        {/* Rating shows on phone / tablet cards only (responsive export; desktop card has none). */}
        <p className="flex items-center gap-1 text-label-medium text-on-surface-variant min-[960px]:hidden">
          <Star className="size-3.5 fill-rating text-rating" aria-hidden />
          <span className="font-bold">{formatFaNumber(offer.rating, 1)}</span>
          <span>({t('reviews', { count: formatFaNumber(offer.reviewCount) })})</span>
        </p>

        <div className="h-px w-full bg-outline-variant" aria-hidden />

        <div className="mt-auto flex flex-col items-start gap-2">
          <Badge variant="warning" className="h-7 px-3 text-label-medium">
            {offer.discountBadge}
          </Badge>
          {/* Row: original at the start (right), final at the end (left). */}
          <PriceDisplay
            layout="row"
            originalPrice={offer.originalPrice}
            finalPrice={offer.finalPrice}
          />
        </div>
      </div>
    </CatalogOfferCardShell>
  );
}
