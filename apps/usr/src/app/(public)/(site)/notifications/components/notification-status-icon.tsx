import { Mail, MailOpen } from 'lucide-react';

import type { NotificationStatus } from '@home/data/notifications-mock';
import { cn } from '@/lib/utils';

type NotificationStatusIconProps = {
  status: NotificationStatus;
  unreadLabel: string;
  readLabel: string;
  className?: string;
};

/** Closed envelope = unread, open envelope = read. Color inherits via `className`. */
export function NotificationStatusIcon({
  status,
  unreadLabel,
  readLabel,
  className,
}: NotificationStatusIconProps) {
  const unread = status === 'unread';
  const Icon = unread ? Mail : MailOpen;

  return (
    <span
      className={cn(
        'inline-flex size-6 items-center justify-center text-content',
        className
      )}
      aria-label={unread ? unreadLabel : readLabel}
    >
      <Icon className="size-6" strokeWidth={1.5} aria-hidden />
    </span>
  );
}
