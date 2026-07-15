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
  if (variant === 'discount') {
    return (
      <DiscountCard
        title={title}
        subtitle={subtitle}
        badge={badge}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        className={className}
      />
    );
  }

  return (
    <article
      className={cn(
        'group flex w-[260px] shrink-0 flex-col items-end overflow-hidden rounded-[12px] bg-home-card shadow-home-elevation-1',
        'motion-safe:transition-shadow motion-safe:duration-300 motion-safe:ease-out',
        'hover:shadow-home-elevation-2 active:shadow-home-elevation-1',
        'min-[834px]:w-[344px]',
        className
      )}
    >
      <div className="relative h-[153px] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 834px) 260px, 344px"
          className="object-cover"
        />
      </div>

      {/* Figma #42:432 — hover text: rgba(23,29,25,0.08); pressed: 0.1; elev 2 */}
      <div
        className={cn(
          'flex w-full flex-col items-end gap-2 p-4',
          'motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-out',
          'group-hover:bg-[rgba(23,29,25,0.08)] group-active:bg-[rgba(23,29,25,0.1)]'
        )}
      >
        {header || subhead ? (
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

        <h3
          className={cn(
            'w-full text-end text-base font-bold leading-6 tracking-[0.0094em] text-content',
            'motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-out',
            'group-hover:text-primary'
          )}
        >
          {title}
        </h3>

        {subtitle ? (
          <p className="w-full text-end text-xs font-bold leading-4 tracking-[0.0083em] text-content-muted">
            {subtitle}
          </p>
        ) : null}

        {description ? (
          <p className="w-full text-end text-sm leading-5 tracking-[0.0071em] text-content-muted line-clamp-2">
            {description}
          </p>
        ) : null}
      </div>
    </article>
  );
}

type DiscountCardProps = Pick<
  ContentCardProps,
  'title' | 'subtitle' | 'badge' | 'imageSrc' | 'imageAlt' | 'className'
>;

/**
 * Figma Discount card #38:292 — Default vs hover:
 * hover: media fills full card; text bar `rgba(0,0,0,0.35)` with #FAFAF5 title/subhead.
 */
function DiscountCard({
  title,
  subtitle,
  badge,
  imageSrc,
  imageAlt,
  className,
}: DiscountCardProps) {
  return (
    <article
      className={cn(
        'group relative flex w-[280px] shrink-0 flex-col overflow-hidden rounded-[12px] bg-home-card shadow-home-elevation-1',
        className
      )}
    >
      {/* In-flow media spacer — card keeps height while image goes absolute on hover */}
      <div className="h-[188px] w-full shrink-0" aria-hidden />

      <div
        className={cn(
          'absolute inset-x-0 top-0 z-0 h-[188px] overflow-hidden',
          'motion-safe:transition-[height] motion-safe:duration-500 motion-safe:ease-out',
          'group-hover:h-full'
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 834px) 280px, (max-width: 1279px) 50vw, 320px"
          className="object-cover"
        />
        {badge ? (
          <Badge className="absolute start-3 top-3 z-10 h-8 rounded-full border-0 bg-warning-subtle px-3 text-sm font-medium leading-5 tracking-[0.0071em] text-warning-700 dark:text-warning-50">
            {badge}
          </Badge>
        ) : null}
      </div>

      <div
        className={cn(
          'relative z-10 flex w-full flex-col items-end gap-2 bg-home-card p-4',
          'motion-safe:transition-colors motion-safe:duration-500 motion-safe:ease-out',
          'group-hover:bg-black/35'
        )}
      >
        <h3
          className={cn(
            'w-full text-end text-base font-medium leading-6 tracking-[0.0094em] text-content',
            'motion-safe:transition-colors motion-safe:duration-500 motion-safe:ease-out',
            'group-hover:text-[#FAFAF5]'
          )}
        >
          {title}
        </h3>
        {subtitle ? (
          <p
            className={cn(
              'w-full text-end text-sm font-medium leading-5 tracking-[0.0071em] text-content-muted',
              'motion-safe:transition-colors motion-safe:duration-500 motion-safe:ease-out',
              'group-hover:text-[#FAFAF5]'
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </article>
  );
}
