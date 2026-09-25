import type { ReactNode } from 'react';

import { FeaturedBadge } from '@/components/ui/featured-badge';
import { cn } from '@/lib/utils';

type CommentItemProps = {
  authorName: string;
  username?: string;
  dateLabel: string;
  timeLabel?: string;
  body: string;
  avatar: ReactNode;
  featured?: boolean;
  featuredLabel?: string;
  menu?: ReactNode;
  actions?: ReactNode;
  variant?: 'default' | 'featured';
  className?: string;
};

export function CommentItem({
  authorName,
  username,
  dateLabel,
  timeLabel,
  body,
  avatar,
  featured = false,
  featuredLabel,
  menu,
  actions,
  variant = 'default',
  className,
}: CommentItemProps) {
  const isFeatured = variant === 'featured' || featured;

  return (
    <article
      className={cn(
        'rounded-medium p-4 shadow-app-elevation-2',
        isFeatured
          ? 'border-s-[3px] border-featured bg-featured-container'
          : 'border border-outline-variant bg-surface',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col items-end gap-2">
          <div className="flex w-full items-center justify-between gap-2">
            {menu ? <div className="shrink-0">{menu}</div> : <span />}
            <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
              {isFeatured && featuredLabel ? <FeaturedBadge label={featuredLabel} /> : null}
              {timeLabel ? (
                <span className="text-label-medium text-outline">{timeLabel}</span>
              ) : null}
              {timeLabel ? (
                <span className="text-label-medium text-outline" aria-hidden>
                  •
                </span>
              ) : null}
              <span className="text-label-medium text-outline">{dateLabel}</span>
              {username ? (
                <span className="text-label-medium text-outline">{username}</span>
              ) : null}
              <span className="text-title-small font-bold text-on-surface">{authorName}</span>
            </div>
          </div>

          <p className="w-full text-start text-title-small text-on-surface">{body}</p>

          {actions ? (
            <>
              <div className="h-px w-full bg-outline-variant" role="separator" />
              <div className="flex w-full flex-wrap items-center gap-3">{actions}</div>
            </>
          ) : null}
        </div>
        <div className="shrink-0">{avatar}</div>
      </div>
    </article>
  );
}
