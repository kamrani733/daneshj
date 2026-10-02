import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Text inside a HoverMediaCard body: turns light while the media covers the card.
 * Use on every text node of the body (titles, meta, prices).
 */
export const HOVER_MEDIA_TEXT =
  'motion-safe:transition-colors motion-safe:duration-500 motion-safe:ease-out group-hover:text-white';

type HoverMediaCardProps = {
  /** `next/image` with `fill` (or any absolutely sized media). */
  media: ReactNode;
  /** Chips / badges drawn on the media. */
  mediaOverlay?: ReactNode;
  /** Media height in the resting state, e.g. `h-[200px]`. */
  mediaHeightClassName: string;
  children: ReactNode;
  href?: string;
  className?: string;
  bodyClassName?: string;
};

/**
 * Shared card hover (Figma Discount card #38:292, home): on hover the media grows
 * to fill the whole card and the body becomes a translucent dark bar with light
 * text. Used by discount, business, news and newsletter cards on the home page,
 * search results and the panels. Hover-only devices (Tailwind v4 `hover` media).
 */
export function HoverMediaCard({
  media,
  mediaOverlay,
  mediaHeightClassName,
  children,
  href,
  className,
  bodyClassName,
}: HoverMediaCardProps) {
  const card = (
    <article
      dir="rtl"
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant/40',
        'bg-surface-container-lowest shadow-app-elevation-1 text-start',
        'motion-safe:transition-shadow motion-safe:duration-300 hover:shadow-app-elevation-2',
        className
      )}
    >
      {/* In-flow spacer keeps the card height while the media layer grows. */}
      <div className={cn('w-full shrink-0', mediaHeightClassName)} aria-hidden />

      <div
        className={cn(
          'absolute inset-x-0 top-0 z-0 overflow-hidden',
          'motion-safe:transition-[height] motion-safe:duration-500 motion-safe:ease-out group-hover:h-full',
          mediaHeightClassName
        )}
      >
        {media}
        {mediaOverlay}
      </div>

      <div
        className={cn(
          'relative z-10 flex flex-1 flex-col bg-surface-container-lowest',
          'motion-safe:transition-colors motion-safe:duration-500 motion-safe:ease-out group-hover:bg-black/35',
          bodyClassName
        )}
      >
        {children}
      </div>
    </article>
  );

  if (!href) return card;
  return (
    <Link
      href={href}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {card}
    </Link>
  );
}
