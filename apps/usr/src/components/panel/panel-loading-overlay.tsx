import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

type PanelLoadingOverlayProps = {
  message: string;
  className?: string;
};

export function PanelLoadingOverlay({
  message,
  className,
}: PanelLoadingOverlayProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-20 flex min-h-[320px] flex-col items-center justify-center gap-3',
        'bg-home-scene/70 backdrop-blur-[1px]',
        'dark:bg-home-card/80',
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2
        className="size-8 animate-spin text-[#008d63]"
        strokeWidth={2}
        aria-hidden
      />
      <p className="text-sm font-medium text-[#404943] dark:text-home-filter-muted">
        {message}
      </p>
    </div>
  );
}
