import Image from 'next/image';

import { cn } from '@/lib/utils';

type EmptyStateProps = {
  message: string;
  imageSrc?: string;
  className?: string;
};

/** Shared empty illustration + message. */
export function EmptyState({
  message,
  imageSrc = '/images/public-panel/empty-state-box.png',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[220px] w-full flex-col items-center justify-center gap-4 rounded-xl bg-home-search-fill px-6 py-10 dark:bg-home-search-category',
        className
      )}
    >
      <Image
        src={imageSrc}
        alt=""
        width={160}
        height={160}
        className="size-40 object-contain opacity-90"
      />
      <p className="text-center text-sm font-medium leading-5 text-home-filter-muted">
        {message}
      </p>
    </div>
  );
}
