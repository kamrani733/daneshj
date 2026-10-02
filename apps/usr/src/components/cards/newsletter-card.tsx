import { Star } from 'lucide-react';
import Image from 'next/image';

import { HOVER_MEDIA_TEXT, HoverMediaCard } from '@/components/cards/hover-media-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

export type NewsletterCardData = {
  title: string;
  description: string;
  imageSrc: string;
  publisherName: string;
  publisherInitial: string;
  publishedAt: string;
  rating: number;
  reviewCount: number;
};

type NewsletterCardProps = NewsletterCardData & { href?: string; className?: string };

/** Newsletter card (public panel «خبرنامه»; Nwl service) with the shared hover. */
export function NewsletterCard({
  title,
  description,
  imageSrc,
  publisherName,
  publisherInitial,
  publishedAt,
  rating,
  reviewCount,
  href,
  className,
}: NewsletterCardProps) {
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
          sizes="(max-width: 720px) 100vw, 25vw"
          className="object-cover"
        />
      }
      bodyClassName="gap-2 p-3"
    >
      <div className="flex items-center gap-2">
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary text-label-small font-bold text-on-primary">
            {publisherInitial}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className={cn('truncate text-label-medium font-medium text-on-surface', HOVER_MEDIA_TEXT)}>
            {publisherName}
          </p>
          <p className={cn('text-label-small text-on-surface-variant', HOVER_MEDIA_TEXT)}>
            {publishedAt}
          </p>
        </div>
      </div>
      <h3 className={cn('text-title-small font-bold text-on-surface', HOVER_MEDIA_TEXT)}>
        {title}
      </h3>
      <p className={cn('text-label-medium text-on-surface-variant', HOVER_MEDIA_TEXT)}>
        {description}
      </p>
      <p className={cn('mt-auto flex items-center gap-1 pt-1 text-label-medium text-on-surface', HOVER_MEDIA_TEXT)}>
        <Star className="size-3.5 fill-rating text-rating" aria-hidden />
        <span className="font-bold">
          {formatFaNumber(rating, Number.isInteger(rating) ? 0 : 1)}
        </span>
        <span>({formatFaNumber(reviewCount)} نظر)</span>
      </p>
    </HoverMediaCard>
  );
}
