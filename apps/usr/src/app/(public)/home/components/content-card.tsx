import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type ContentCardVariant = 'discount' | 'business';

export type ContentCardProps = {
  variant: ContentCardVariant;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  header?: string;
  subhead?: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
};

/** Figma Discount card (320×…) / Bussiness card (344 desktop, 260 mobile). */
export function ContentCard({
  variant,
  title,
  subtitle,
  description,
  badge,
  header,
  subhead,
  imageSrc,
  imageAlt,
  className,
}: ContentCardProps) {
  const isDiscount = variant === 'discount';

  return (
    <article
      className={cn(
        'flex shrink-0 flex-col items-end overflow-hidden rounded-[12px] bg-home-header shadow-home-elevation-1',
        isDiscount ? 'w-[280px] shrink-0' : 'w-[260px] min-[834px]:w-[344px]',
        className
      )}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden',
          isDiscount ? 'h-[188px]' : 'h-[153px]'
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes={
            isDiscount
              ? '(max-width: 834px) 280px, (max-width: 1279px) 50vw, 320px'
              : '(max-width: 834px) 260px, 344px'
          }
          className="object-cover"
        />
        {badge ? (
          <Badge className="absolute start-3 top-3 h-8 rounded-full border-0 bg-warning-subtle px-3 text-sm font-medium leading-5 tracking-[0.0071em] text-warning-700">
            {badge}
          </Badge>
        ) : null}
      </div>

      <div className="flex w-full flex-col items-end gap-2 p-4">
        {!isDiscount && (header || subhead) ? (
          <div className="flex w-full flex-col items-end gap-1 text-end">
            {header ? (
              <span className="text-xs font-medium leading-4 tracking-[0.0083em] text-content-muted">
                {header}
              </span>
            ) : null}
            {subhead ? (
              <span className="text-sm font-bold leading-5 tracking-[0.0071em] text-content">
                {subhead}
              </span>
            ) : null}
          </div>
        ) : null}

        <h3 className="w-full text-end text-base font-bold leading-6 tracking-[0.0094em] text-content">
          {title}
        </h3>

        {subtitle ? (
          <p className="w-full text-end text-sm font-medium leading-5 tracking-[0.0071em] text-content-muted">
            {subtitle}
          </p>
        ) : null}

        {!isDiscount && description ? (
          <p className="w-full text-end text-sm leading-5 tracking-[0.0071em] text-content-muted line-clamp-2">
            {description}
          </p>
        ) : null}
      </div>
    </article>
  );
}
