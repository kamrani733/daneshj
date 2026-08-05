import { Eye } from 'lucide-react';
import Image from 'next/image';

import type { NewsItem } from '@public-panel/data/public-panel-ui';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { CatalogOfferCardShell } from './offer-card-shell';

type NewsOfferCardProps = {
  item: NewsItem;
  className?: string;
};

/** News catalog card. */
export function NewsOfferCard({ item, className }: NewsOfferCardProps) {
  return (
    <CatalogOfferCardShell
      className={cn(
        'hover:bg-muted hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] dark:hover:bg-home-card',
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
        <Badge className="absolute start-2.5 top-2.5 z-10 h-auto gap-1 rounded-md border-0 bg-warning-50 px-2 py-1 text-[11px] font-medium text-warning-700 transition-colors duration-200 group-hover:bg-warning-400 group-hover:text-white dark:bg-warning/30 dark:text-warning-50 dark:group-hover:bg-warning-400 dark:group-hover:text-white">
          <Eye className="size-3.5" aria-hidden />
          {item.viewCount}
        </Badge>
        <Badge className="absolute end-2.5 bottom-2.5 z-10 h-auto rounded-md border-0 bg-info-50 px-2 py-1 text-[11px] font-medium text-info-700 transition-colors duration-200 group-hover:bg-green-600 group-hover:text-white dark:bg-sky-900/60 dark:text-sky-100 dark:group-hover:bg-green-600 dark:group-hover:text-white">
          {item.scopeLabel}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3 transition-colors duration-200">
        <h3 className="text-sm font-bold leading-5 text-home-filter-ink">
          {item.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-home-filter-muted">
          <span>{item.publisherType}</span>
          <span>{item.publishedAt}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge className="h-auto rounded-full border-0 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
            {item.mainCategory}
          </Badge>
          <Badge className="h-auto rounded-full border-0 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
            {item.subCategory}
          </Badge>
        </div>

        <p className="line-clamp-3 text-xs leading-5 text-home-filter-muted">
          {item.summary}
        </p>

        <p className="mt-auto pt-1 text-xs text-home-filter-muted">
          {item.eventRange}
        </p>
      </div>
    </CatalogOfferCardShell>
  );
}
