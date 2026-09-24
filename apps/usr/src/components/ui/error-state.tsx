import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ErrorStateProps = {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  message,
  retryLabel,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex min-h-[220px] w-full flex-col items-center justify-center gap-4 rounded-large bg-surface-container-lowest px-6 py-10',
        className
      )}
    >
      <p className="text-center text-body-medium text-on-surface">{message}</p>
      {onRetry && retryLabel ? (
        <Button type="button" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
