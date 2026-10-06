import Image from 'next/image';

import { cn } from '@/lib/utils';

/** Figma «نتایج جستجو» empty state illustration (320 × 320, outline colour baked in). */
const NO_RESULT_IMAGE = '/images/states/no-result.svg';

type NoResultStateProps = {
  /** e.g. «هیچ نتیجه ای یافت نشد». */
  message: string;
  imageSrc?: string;
  className?: string;
};

/**
 * Search / filter returned nothing (distinct from `EmptyState`, which is "no data yet").
 * Illustration (256 px on phones, 320 px from 640) + muted message, centred.
 */
export function NoResultState({
  message,
  imageSrc = NO_RESULT_IMAGE,
  className,
}: NoResultStateProps) {
  return (
    <div
      role="status"
      className={cn('flex w-full flex-col items-center gap-5', className)}
    >
      <Image
        src={imageSrc}
        alt=""
        width={320}
        height={320}
        className="size-64 min-[640px]:size-80"
      />
      <p className="text-center text-title-medium font-medium text-outline">
        {message}
      </p>
    </div>
  );
}
