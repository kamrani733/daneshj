'use client';

import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import {
  formatFaNumber,
  formatFaRating,
  formatToman,
} from '@/lib/format-fa';
import { cn } from '@/lib/utils';

/** Figma Gold Star — solid yellow fill. */
function GoldStarIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="#FFC107"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
    </svg>
  );
}

export type SearchResultCardProps = {
  title: string;
  /** Business / provider name */
  businessName: string;
  imageSrc: string;
  imageAlt: string;
  rating: number;
  reviewCount: number;
  /** Final (discounted) price in toman */
  price: number;
  discountPercent?: number;
  /** Original price before discount; derived from discount when omitted */
  originalPrice?: number;
  className?: string;
};

/**
 * Figma Temp #87:1540 — search result discount card body (pixel-matched).
 * Media 320×188 · text pad 16 · gap 8 · radius 12 · elev 1.
 */
export function SearchResultCard({
  title,
  businessName,
  imageSrc,
  imageAlt,
  rating,
  reviewCount,
  price,
  discountPercent,
  originalPrice,
  className,
}: SearchResultCardProps) {
  const hasDiscount = typeof discountPercent === 'number' && discountPercent > 0;
  const beforePrice =
    originalPrice ??
    (hasDiscount
      ? Math.round(price / (1 - discountPercent / 100))
      : undefined);

  return (
    <Card
      dir="rtl"
      size="sm"
      className={cn(
        'w-full max-w-[320px] gap-0 bg-home-card py-0 shadow-home-elevation-1 ring-0',
        'min-[640px]:max-w-none',
        className
      )}
    >
      <div className="relative h-[188px] w-full shrink-0 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 320px, (max-width: 1279px) 50vw, 320px"
          className="object-cover"
        />
      </div>

      <CardContent
        className="flex w-full flex-col items-stretch gap-2 p-4"
        dir="rtl"
      >
        <div className="flex w-full flex-col gap-2">
          <CardDescription
            dir="rtl"
            className="w-full text-right text-xs font-bold leading-4 tracking-[0.0083em] text-home-filter-muted"
          >
            {businessName}
          </CardDescription>
          <CardTitle
            dir="rtl"
            className="w-full text-right text-base font-semibold leading-6 tracking-[0.0094em] text-home-filter-ink"
          >
            {title}
          </CardTitle>

          <div
            dir="rtl"
            className="flex w-full items-center justify-start gap-1"
          >
            <GoldStarIcon className="size-4 shrink-0" />
            <span className="text-sm font-bold leading-5 text-home-filter-muted">
              {formatFaRating(rating)}
            </span>
            <span className="text-xs leading-4 tracking-[0.0083em] text-home-filter-muted">
              ({formatFaNumber(reviewCount)} نظر)
            </span>
          </div>
        </div>

        <div className="mx-2 h-px bg-home-filter-border" aria-hidden />

        <div className="flex w-full items-end justify-between gap-3 px-2">
          <div className="flex flex-col items-end gap-1">
            {hasDiscount ? (
              <Badge variant="warning">
                {formatFaNumber(discountPercent)}٪ تخفیف
              </Badge>
            ) : null}
            {beforePrice != null ? (
              <span className="text-xs leading-4 tracking-[0.0083em] text-[#707973] line-through">
                {formatToman(beforePrice)}
              </span>
            ) : null}
          </div>

          <p className="shrink-0 text-lg font-bold leading-6 tracking-[0.0094em] text-primary">
            {formatToman(price)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
