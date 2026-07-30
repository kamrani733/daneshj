import { Eye } from 'lucide-react';
import Image from 'next/image';

import type { NewsItem } from '@public-panel/data/public-panel-mock';
import { cn } from '@/lib/utils';

type NewsOfferCardProps = {
  item: NewsItem;
  className?: string;
};

/** News card — Figma service-info «خبر». */
export function NewsOfferCard({ item, className }: NewsOfferCardProps) {
  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-border/40 bg-home-card shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:bg-home-search-category',
        className
      )}
    >
      <div className="relative h-[160px] w-full shrink-0 overflow-hidden bg-neutral-200">
        <Image
          src={item.imageSrc}
          alt={item.title}
          fill
          unoptimized
          sizes="(max-width: 720px) 100vw, 33vw"
          className="object-cover"
        />
        <span className="absolute start-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-md bg-[#F8D7C8] px-2 py-1 text-[11px] font-medium text-[#7A3E2B] dark:bg-warning/30 dark:text-warning-50">
          <Eye className="size-3.5" aria-hidden />
          {item.viewCount}
        </span>
        <span className="absolute end-2.5 bottom-2.5 z-10 rounded-md bg-[#D6EAF8] px-2 py-1 text-[11px] font-medium text-[#1A5276] dark:bg-sky-900/60 dark:text-sky-100">
          {item.scopeLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <h3 className="text-sm font-bold leading-5 text-home-filter-ink">
          {item.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-home-filter-muted">
          <span>{item.publisherType}</span>
          <span>{item.publishedAt}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
            {item.mainCategory}
          </span>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
            {item.subCategory}
          </span>
        </div>

        <p className="line-clamp-3 text-xs leading-5 text-home-filter-muted">
          {item.summary}
        </p>

        <p className="mt-auto pt-1 text-xs text-home-filter-muted">
          {item.eventRange}
        </p>
      </div>
    </article>
  );
}
