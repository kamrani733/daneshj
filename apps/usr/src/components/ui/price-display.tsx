import { cn } from '@/lib/utils';

type PriceDisplayProps = {
  originalPrice?: string;
  finalPrice: string;
  layout?: 'stack' | 'row';
  className?: string;
};

export function PriceDisplay({
  originalPrice,
  finalPrice,
  layout = 'stack',
  className,
}: PriceDisplayProps) {
  if (layout === 'row') {
    return (
      <div
        className={cn(
          'flex w-full items-center justify-between gap-2 whitespace-nowrap',
          className
        )}
      >
        {originalPrice ? (
          <span className="text-label-medium text-outline line-through">{originalPrice}</span>
        ) : (
          <span />
        )}
        <span className="text-title-semi-large font-bold text-primary">{finalPrice}</span>
      </div>
    );
  }

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
