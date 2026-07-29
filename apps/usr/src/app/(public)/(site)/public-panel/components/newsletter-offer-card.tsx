import { Star } from 'lucide-react';
import Image from 'next/image';

import type { NewsletterItem } from '@public-panel/data/public-panel-mock';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type NewsletterOfferCardProps = {
  item: NewsletterItem;
  className?: string;
};

/** Newsletter card — Figma service-info «خبرنامه». */
export function NewsletterOfferCard({ item, className }: NewsletterOfferCardProps) {
  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-border/40 bg-home-card shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:bg-home-search-category',
        className
      )}
    >
      <div className="flex items-center gap-2 px-3 pt-3">
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
            {item.publisherInitial}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 text-start">
          <p className="truncate text-xs font-medium text-home-filter-ink">
            {item.publisherName}
          </p>
          <p className="text-[11px] text-home-filter-muted">{item.publishedAt}</p>
        </div>
      </div>

      <div className="relative mx-3 mt-3 h-[140px] shrink-0 overflow-hidden rounded-lg bg-neutral-200">
        <Image
          src={item.imageSrc}
          alt={item.title}
          fill
          unoptimized
          sizes="(max-width: 720px) 100vw, 25vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="text-sm font-bold leading-5 text-home-filter-ink">
          {item.title}
        </h3>
        <p className="text-xs leading-4 text-home-filter-muted">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-center gap-1 pt-2 text-xs text-home-filter-ink">
          <Star className="size-3.5 fill-warning text-warning" aria-hidden />
          <span>
            {item.rating} ({item.reviewCount} نظر)
          </span>
        </div>
      </div>
    </article>
  );
}
