import { cn } from '@/lib/utils';

type PriceDisplayProps = {
  originalPrice?: string;
  finalPrice: string;
  className?: string;
};

export function PriceDisplay({
  originalPrice,
  finalPrice,
  className,
}: PriceDisplayProps) {
  return (
    <div className={cn('flex flex-col items-start gap-0.5', className)}>
      {originalPrice ? (
        <span className="text-label-small text-on-surface-variant line-through">
          {originalPrice}
        </span>
      ) : null}
      <span className="text-label-large font-medium text-on-surface">{finalPrice}</span>
    </div>
  );
}
