import { cn } from '@/lib/utils';

type CountChipProps = {
  label: string;
  className?: string;
};

export function CountChip({ label, className }: CountChipProps) {
  return (
    <span
      className={cn(
        'inline-flex h-auto items-center rounded-full bg-primary-container px-3 py-1 text-label-large font-medium text-on-primary-container',
        className
      )}
    >
      {label}
    </span>
  );
}
