'use client';

import { Mail, MailOpen, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import {
  MOCK_NOTIFICATIONS,
  countUnreadNotifications,
  type NotificationItem,
} from '../data/notifications-mock';

/** Figma Notification Item / table head — one outer border, no cell borders. */
const ROW_SHELL =
  'flex w-full items-center justify-between gap-2 rounded-xl border border-[#BFC9C1] px-6 py-2 dark:border-border';
const TEXT =
  'text-sm font-medium leading-5 tracking-[0.0071em] text-content';

export type NotificationsPanelProps = {
  triggerLabel: string;
  items?: NotificationItem[];
  onItemSelect?: (item: NotificationItem) => void;
  trigger: (props: {
    open: boolean;
    unreadCount: number;
  }) => ReactNode;
};

/**
 * Figma Notification List #100:578 — shadcn Popover under the navbar bell.
 */
export function NotificationsPanel({
  triggerLabel,
  items = MOCK_NOTIFICATIONS,
  onItemSelect,
  trigger,
}: NotificationsPanelProps) {
  const t = useTranslations('home.header.notificationsPanel');
  const [open, setOpen] = useState(false);
  const unreadCount = countUnreadNotifications(items);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger({ open, unreadCount })}</PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        aria-label={triggerLabel}
        className="w-[min(586px,calc(100vw-16px))] gap-3 rounded-2xl border-0 bg-home-header p-4 text-content shadow-home-elevation-2 ring-0"
      >
        <PopoverHeader
          dir="ltr"
          className="flex flex-row items-center justify-between gap-3 p-0"
        >
          <PopoverClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t('close')}
              className="size-6 shrink-0 text-content hover:bg-muted"
            >
              <X className="size-5" strokeWidth={1.75} />
            </Button>
          </PopoverClose>
          <PopoverTitle className="text-lg font-bold leading-6 text-content">
            {t('title')}
          </PopoverTitle>
        </PopoverHeader>

        <div
          dir="ltr"
          className="flex max-h-[min(70vh,480px)] flex-col gap-2 overflow-auto overscroll-contain"
        >
          <div
            className={cn(
              ROW_SHELL,
              'bg-[#E3E0DA] text-[#707973] dark:bg-muted dark:text-content-muted'
            )}
          >
            <span className={cn(TEXT, 'shrink-0 text-[#707973] dark:text-content-muted')}>
              {t('columns.status')}
            </span>
            <span
              className={cn(
                TEXT,
                'w-[200px] shrink text-center text-[#707973] dark:text-content-muted'
              )}
            >
              {t('columns.body')}
            </span>
            <span
              className={cn(
                TEXT,
                'w-[100px] shrink-0 text-center text-[#707973] dark:text-content-muted'
              )}
            >
              {t('columns.subject')}
            </span>
            <span
              className={cn(
                TEXT,
                'w-[70px] shrink-0 text-center text-[#707973] dark:text-content-muted'
              )}
            >
              {t('columns.date')}
            </span>
          </div>

          {items.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              unreadLabel={t('statusUnread')}
              readLabel={t('statusRead')}
              onSelect={onItemSelect}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationRow({
  item,
  unreadLabel,
  readLabel,
  onSelect,
}: {
  item: NotificationItem;
  unreadLabel: string;
  readLabel: string;
  onSelect?: (item: NotificationItem) => void;
}) {
  const unread = item.status === 'unread';
  const StatusIcon = unread ? Mail : MailOpen;

  return (
    <button
      type="button"
      className={cn(
        ROW_SHELL,
        'text-start transition-opacity hover:opacity-95',
        unread
          ? 'bg-home-search-fill dark:bg-muted/60'
          : 'bg-white dark:bg-home-search-category'
      )}
      onClick={() => onSelect?.(item)}
    >
      <span
        className="inline-flex size-[46px] shrink-0 items-center justify-center"
        aria-label={unread ? unreadLabel : readLabel}
      >
        <StatusIcon className="size-6 text-content" strokeWidth={1.5} aria-hidden />
      </span>
      <span className={cn(TEXT, 'w-[220px] shrink')}>{item.body}</span>
      <span className={cn(TEXT, 'w-[100px] shrink-0 text-center')}>{item.subject}</span>
      <span
        className={cn(
          TEXT,
          'flex w-[70px] shrink-0 flex-col items-center justify-center gap-[7px]'
        )}
      >
        <span>{item.date}</span>
        <span>{item.time}</span>
      </span>
    </button>
  );
}

export { countUnreadNotifications };
