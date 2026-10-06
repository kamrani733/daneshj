import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type CompactMediaCardProps = {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt?: string;
  href?: string;
  /** `accent` = tinted surface (search «کاربران» cards). */
  tone?: 'default' | 'accent';
  className?: string;
};

/**
 * Horizontal result card: 80×80 media at the start, title (+ subtitle) beside it.
 * Search results — products, services, providers, users.
 */
export function CompactMediaCard({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  href,
  tone = 'default',
  className,
}: CompactMediaCardProps) {
  const classes = cn(
    'flex h-24 w-full min-w-0 items-center gap-4 rounded-small border border-outline-variant p-2',
    tone === 'accent' ? 'bg-app-filter-bar' : 'bg-surface-container-lowest',
    href &&
      'transition-shadow hover:shadow-app-elevation-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
    className,
  );

  const content = (
    <>
      <span className="relative size-20 shrink-0 overflow-hidden rounded-extra-small bg-surface-container">
        <Image
          src={imageSrc}
          alt={imageAlt ?? title}
          fill
          sizes="80px"
          className="object-cover"
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-2 self-start pt-3">
        <span className="w-full truncate text-start text-title-small font-medium text-on-surface">
          {title}
        </span>
        {subtitle ? (
          <span className="w-full truncate text-start text-body-small text-on-surface-variant">
            {subtitle}
          </span>
        ) : null}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
