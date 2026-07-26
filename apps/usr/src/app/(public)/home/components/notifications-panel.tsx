'use client';

import Link from 'next/link';
import { MailCheck, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, type ReactNode } from 'react';

import {
  getNotificationApiErrorMessage,
  useLast5NotificationsQuery,
  useMarkLast5NotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
  useUnreadCountQuery,
  type NotificationItem,
} from '@notifications/api';
import { NotificationStatusIcon } from '@notifications/components/notification-status-icon';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

import { NOTIFICATIONS_PATH } from '../data/notifications-mock';

export type NotificationsPanelProps = {
  triggerLabel: string;
  accessToken?: string | null;
  onItemSelect?: (item: NotificationItem) => void;
  trigger: (props: {
    open: boolean;
    unreadCount: number;
  }) => ReactNode;
};

/**
 * Figma bell modal #2411:1097 — recent notifications popover.
 * APIs: last5 · read · read-last-5 · unread-count
 */
export function NotificationsPanel({
  triggerLabel,
  accessToken,
  onItemSelect,
  trigger,
}: NotificationsPanelProps) {
  const t = useTranslations('home.header.notificationsPanel');
  const tPage = useTranslations('notifications');
  const tErrors = useTranslations('notifications.apiErrors');
  const [open, setOpen] = useState(false);

  const last5Query = useLast5NotificationsQuery(accessToken, open);
  const unreadQuery = useUnreadCountQuery(accessToken);
  const markOne = useMarkNotificationAsReadMutation();
  const markLast5 = useMarkLast5NotificationsAsReadMutation();

  const items = last5Query.data ?? [];
  const unreadCount =
    unreadQuery.data?.total ??
    items.reduce((n, item) => (item.status === 'unread' ? n + 1 : n), 0);

  async function handleMarkAllRead() {
    try {
      await markLast5.mutateAsync({ accessToken: accessToken ?? '' });
    } catch (error) {
      console.error(
        getNotificationApiErrorMessage(error, t('markAllFailed'), (key) =>
          tErrors(key)
        )
      );
    }
  }

  async function handleSelect(item: NotificationItem) {
    onItemSelect?.(item);
    if (item.status === 'unread') {
      try {
        await markOne.mutateAsync({
          accessToken: accessToken ?? '',
          sentNotificationId: item.id,
        });
      } catch (error) {
        console.error(
          getNotificationApiErrorMessage(error, t('markOneFailed'), (key) =>
            tErrors(key)
          )
        );
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger({ open, unreadCount })}</PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        aria-label={triggerLabel}
        className={cn(
          'w-[min(420px,calc(100vw-16px))] gap-4 rounded-3xl border-0',
          'bg-home-header p-5 text-content shadow-home-elevation-2 ring-0'
        )}
      >
        <PopoverHeader className="flex flex-row items-center justify-between gap-3 p-0">
          <PopoverTitle className="text-lg font-bold leading-6 text-content">
            {t('title')}
          </PopoverTitle>
          <PopoverClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t('close')}
              className="size-8 shrink-0 rounded-full text-content hover:bg-muted"
            >
              <X className="size-5" strokeWidth={1.75} />
            </Button>
          </PopoverClose>
        </PopoverHeader>

        {unreadCount > 0 ? (
          <Button
            type="button"
            variant="link"
            loading={markLast5.isPending}
            onClick={handleMarkAllRead}
            className="h-auto gap-2 self-start px-0 text-sm font-medium leading-5"
          >
            <MailCheck className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
            {t('markAllRead')}
          </Button>
        ) : null}

        <ul className="flex max-h-[min(60vh,420px)] flex-col gap-2.5 overflow-auto overscroll-contain">
          {last5Query.isLoading ? (
            <li className="flex justify-center py-6">
              <Spinner className="size-6 text-primary" aria-label={t('title')} />
            </li>
          ) : items.length === 0 ? (
            <li className="py-6 text-center text-sm text-neutral-600">
              {last5Query.data === undefined && !accessToken
                ? t('title')
                : t('empty')}
            </li>
          ) : (
            items.map((item) => (
              <li key={item.id}>
                <NotificationCard
                  item={item}
                  unreadLabel={t('statusUnread')}
                  readLabel={t('statusRead')}
                  fallbackSubject={tPage('fallbackSubject')}
                  onSelect={handleSelect}
                />
              </li>
            ))
          )}
        </ul>

        <div className="flex justify-end">
          <Link
            href={NOTIFICATIONS_PATH}
            onClick={() => setOpen(false)}
            className="text-sm font-medium leading-5 text-primary transition-opacity hover:opacity-80"
          >
            {t('viewAll')}
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationCard({
  item,
  unreadLabel,
  readLabel,
  fallbackSubject,
  onSelect,
}: {
  item: NotificationItem;
  unreadLabel: string;
  readLabel: string;
  fallbackSubject: string;
  onSelect?: (item: NotificationItem) => void;
}) {
  const unread = item.status === 'unread';

  return (
    <button
      type="button"
      onClick={() => onSelect?.(item)}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border border-green-400 bg-white px-4 py-3 text-start',
        'transition-opacity hover:opacity-95 dark:border-border dark:bg-home-search-category'
      )}
    >
      <span className="flex w-[72px] shrink-0 flex-col items-center justify-center gap-0.5 text-center text-xs font-medium leading-4 text-content">
        <span>{item.date.trim()}</span>
        <span>{item.time}</span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-start gap-2">
          {unread ? (
            <span
              aria-hidden
              className="size-1.5 shrink-0 rounded-full bg-error-600"
            />
          ) : null}
          <span className="truncate text-sm font-bold leading-5 text-content">
            {item.subject || fallbackSubject}
          </span>
        </span>
        <span className="mt-1 line-clamp-2 text-xs font-medium leading-4 text-neutral-600">
          {item.body}
        </span>
      </span>

      <NotificationStatusIcon
        status={item.status}
        unreadLabel={unreadLabel}
        readLabel={readLabel}
        className="shrink-0 text-content"
      />
    </button>
  );
}

export { countUnreadNotifications } from '../data/notifications-mock';
