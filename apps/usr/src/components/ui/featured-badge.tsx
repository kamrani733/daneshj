import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

type FeaturedBadgeProps = {
  label: string;
  className?: string;
};

export function FeaturedBadge({ label, className }: FeaturedBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-label-medium font-bold text-featured',
        className
      )}
    >
      <Star className="size-3.5 fill-featured text-featured" aria-hidden />
      {label}
    </span>
  );
}
