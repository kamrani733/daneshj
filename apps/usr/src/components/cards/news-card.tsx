import { Eye } from 'lucide-react';
import Image from 'next/image';

import { HOVER_MEDIA_TEXT, HoverMediaCard } from '@/components/cards/hover-media-card';
import { Badge } from '@/components/ui/badge';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

export type NewsCardData = {
  title: string;
  imageSrc: string;
  viewCount: number;
  /** «دانشگاهی» · «بین المللی» · «کشوری». */
  scopeLabel: string;
  publisherType: string;
  publishedAt: string;
  mainCategory: string;
  subCategory: string;
  summary: string;
  eventRange: string;
};

type NewsCardProps = NewsCardData & { href?: string; className?: string };

/** News card (public panel «خبر»; Nws service) with the shared hover. */
export function NewsCard({
  title,
  imageSrc,
  viewCount,
  scopeLabel,
  publisherType,
  publishedAt,
  mainCategory,
  subCategory,
  summary,
  eventRange,
  href,
  className,
}: NewsCardProps) {
  return (
    <HoverMediaCard
      href={href}
      className={className}
      mediaHeightClassName="h-[160px]"
      media={
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 720px) 100vw, 33vw"
          className="object-cover"
        />
      }
      mediaOverlay={
        <>
          <Badge variant="viewcount" className="absolute start-2.5 top-2.5 z-10">
            <Eye aria-hidden />
            {formatFaNumber(viewCount)}
          </Badge>
          <Badge className="absolute bottom-2.5 end-2.5 z-10 h-auto rounded-md border-0 bg-info-50 px-2 py-1 text-label-small font-medium text-info-700 dark:bg-info-800 dark:text-info-50">
            {scopeLabel}
          </Badge>
        </>
      }
      bodyClassName="gap-2.5 p-3"
    >
      <h3 className={cn('text-title-small font-bold text-on-surface', HOVER_MEDIA_TEXT)}>
        {title}
      </h3>
      <div
        className={cn(
          'flex flex-wrap items-center gap-x-3 gap-y-1 text-label-medium text-on-surface-variant',
          HOVER_MEDIA_TEXT
        )}
      >
        <span>{publisherType}</span>
        <span>{publishedAt}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {[mainCategory, subCategory].map((label) => (
          <Badge
            key={label}
            className="h-auto rounded-full border-0 bg-primary/10 px-2.5 py-1 text-label-small font-medium text-primary group-hover:bg-white/20 group-hover:text-white"
          >
            {label}
          </Badge>
        ))}
      </div>
      <p className={cn('line-clamp-3 text-label-medium text-on-surface-variant', HOVER_MEDIA_TEXT)}>
        {summary}
      </p>
      <p className={cn('mt-auto pt-1 text-label-medium text-on-surface-variant', HOVER_MEDIA_TEXT)}>
        {eventRange}
      </p>
    </HoverMediaCard>
  );
}
