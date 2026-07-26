import { cn } from '@/lib/utils';

type NotificationDateTimeProps = {
  date: string | null;
  time: string | null;
  emptyPlaceholder?: string;
  className?: string;
};

/** Two-line date/time cell; dashed placeholder when unset. Figma M3/title/small. */
export function NotificationDateTime({
  date,
  time,
  emptyPlaceholder = '----------',
  className,
}: NotificationDateTimeProps) {
  if (!date || !time) {
    return (
      <span
        className={cn(
          'text-center text-sm font-medium leading-5 tracking-[0.0071em]',
          className
        )}
      >
        {emptyPlaceholder}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'flex flex-col items-center justify-center gap-1.5 text-center text-sm font-medium leading-5 tracking-[0.0071em]',
        className
      )}
    >
      <span>{date}</span>
      <span>{time}</span>
    </span>
  );
}
