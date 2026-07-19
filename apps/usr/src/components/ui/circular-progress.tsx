import { cn } from '@/lib/utils';

type CircularProgressProps = {
  size?: number;
  className?: string;
  'aria-label'?: string;
};

/** Material Design–style indeterminate circular progress. */
export function CircularProgress({
  size = 20,
  className,
  'aria-label': ariaLabel = 'Loading',
}: CircularProgressProps) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={cn('inline-flex shrink-0 text-current', className)}
      style={{ width: size, height: size }}
    >
      <svg
        className="md-circular-progress"
        viewBox="22 22 44 44"
        width={size}
        height={size}
        aria-hidden
      >
        <circle
          className="md-circular-progress__path"
          cx="44"
          cy="44"
          r="20.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
