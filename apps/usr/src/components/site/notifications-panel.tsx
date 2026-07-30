'use client';

import Link from 'next/link';
import { MailCheck, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState, type ReactNode } from 'react';

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
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

import { NOTIFICATIONS_PATH } from '@notifications/data/notifications-ui';

/** Matches site-header: desktop chrome from `lg` (1024px). */
const DESKTOP_MQ = '(min-width: 1024px)';

export type NotificationsPanelProps = {
  triggerLabel: string;
  accessToken?: string | null;
  onItemSelect?: (item: NotificationItem) => void;
  trigger: (props: {
    open: boolean;
    unreadCount: number;
  }) => ReactNode;
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isDesktop;
}

/**
 * Figma bell modal #2411:1097 —
 * desktop: popover · mobile: bottom sheet.
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
  const isDesktop = useIsDesktop();

  const last5Query = useLast5NotificationsQuery(accessToken, open);
  const unreadQuery = useUnreadCountQuery(accessToken);
  const markOne = useMarkNotificationAsReadMutation();
  const markLast5 = useMarkLast5NotificationsAsReadMutation();

  const items = last5Query.data ?? [];
  const listUnreadCount = items.reduce(
    (n, item) => (item.status === 'unread' ? n + 1 : n),
    0
  );
  /** Prefer list unread when unread-count API is 0/mismatched (common schema drift). */
  const unreadCount = Math.max(unreadQuery.data?.total ?? 0, listUnreadCount);

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

  const panelBody = (
    <NotificationsPanelBody
      title={t('title')}
      closeLabel={t('close')}
      markAllLabel={t('markAllRead')}
      viewAllLabel={t('viewAll')}
      emptyLabel={t('empty')}
      unreadLabel={t('statusUnread')}
      readLabel={t('statusRead')}
      fallbackSubject={tPage('fallbackSubject')}
      items={items}
      listUnreadCount={listUnreadCount}
      isLoading={last5Query.isLoading}
      showAuthHint={last5Query.data === undefined && !accessToken}
      markAllPending={markLast5.isPending}
      onMarkAllRead={handleMarkAllRead}
      onSelect={handleSelect}
      onClose={() => setOpen(false)}
    />
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {trigger({ open, unreadCount })}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          aria-label={triggerLabel}
          className={cn(
            'w-[min(420px,calc(100vw-16px))] gap-4 rounded-3xl border-0',
            'bg-home-header p-5 text-content shadow-home-elevation-2 ring-0'
          )}
        >
          {panelBody}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger({ open, unreadCount })}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        aria-label={triggerLabel}
        className={cn(
          'top-auto right-0 bottom-0 left-0 flex w-full max-w-none translate-x-0 translate-y-0 flex-col gap-4',
          'max-h-[min(85vh,720px)] rounded-t-3xl rounded-b-none border-0 bg-home-header p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-content',
          'ring-0 shadow-home-elevation-3 sm:max-w-none',
          'data-open:zoom-in-100 data-closed:zoom-out-100',
          'data-open:slide-in-from-bottom-4 data-closed:slide-out-to-bottom-4'
        )}
      >
        <div className="flex flex-col items-center">
          <span
            aria-hidden
            className="mb-1 h-1 w-10 rounded-full bg-neutral-300 dark:bg-neutral-600"
          />
          <DialogTitle className="sr-only">{t('title')}</DialogTitle>
        </div>
        {panelBody}
      </DialogContent>
    </Dialog>
  );
}

function CloseButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      className="relative z-10 size-8 shrink-0 rounded-full text-content hover:bg-muted"
    >
      <X className="size-5" strokeWidth={1.75} />
    </Button>
  );
}

function NotificationsPanelBody({
  title,
  closeLabel,
  markAllLabel,
  viewAllLabel,
  emptyLabel,
  unreadLabel,
  readLabel,
  fallbackSubject,
  items,
  listUnreadCount,
  isLoading,
  showAuthHint,
  markAllPending,
  onMarkAllRead,
  onSelect,
  onClose,
}: {
  title: string;
  closeLabel: string;
  markAllLabel: string;
  viewAllLabel: string;
  emptyLabel: string;
  unreadLabel: string;
  readLabel: string;
  fallbackSubject: string;
  items: NotificationItem[];
  listUnreadCount: number;
  isLoading: boolean;
  showAuthHint: boolean;
  markAllPending: boolean;
  onMarkAllRead: () => void;
  onSelect: (item: NotificationItem) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="flex flex-row items-center justify-between gap-3">
        <h2 className="text-lg font-bold leading-6 text-content">{title}</h2>
        <CloseButton label={closeLabel} onClick={onClose} />
      </div>

      {listUnreadCount > 0 ? (
        <Button
          type="button"
          variant="link"
          loading={markAllPending}
          onClick={onMarkAllRead}
          className="h-auto gap-2 self-end px-0 text-sm font-medium leading-5 text-primary"
        >
          <MailCheck className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
          {markAllLabel}
        </Button>
      ) : null}

      <ul className="flex max-h-[min(55vh,420px)] flex-col gap-2.5 overflow-auto overscroll-contain">
        {isLoading ? (
          <li className="flex justify-center py-6">
            <Spinner className="size-6 text-primary" aria-label={title} />
          </li>
        ) : items.length === 0 ? (
          <li className="py-6 text-center text-sm text-neutral-600 dark:text-muted-foreground">
            {showAuthHint ? title : emptyLabel}
          </li>
        ) : (
          items.map((item) => (
            <li key={item.id}>
              <NotificationCard
                item={item}
                unreadLabel={unreadLabel}
                readLabel={readLabel}
                fallbackSubject={fallbackSubject}
                onSelect={onSelect}
              />
            </li>
          ))
        )}
      </ul>

      <div className="flex justify-end">
        <Link
          href={NOTIFICATIONS_PATH}
          onClick={onClose}
          className="text-sm font-medium leading-5 text-primary transition-opacity hover:opacity-80"
        >
          {viewAllLabel}
        </Link>
      </div>
    </>
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
        'flex w-full items-center gap-3 rounded-xl border border-[#E0E0E0] bg-white px-3 py-3 text-start',
        'transition-opacity hover:opacity-95 dark:border-border dark:bg-home-search-category'
      )}
    >
      <span
        dir="ltr"
        className="flex w-[76px] shrink-0 flex-col items-center justify-center gap-0.5 text-center text-xs font-medium leading-4 text-content"
      >
        <span className="whitespace-nowrap">{item.date.trim()}</span>
        <span className="whitespace-nowrap">{item.time}</span>
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
        <span className="mt-1 line-clamp-2 text-xs font-medium leading-4 text-neutral-600 dark:text-muted-foreground">
          {item.body}
        </span>
      </span>

      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-[#BDBDBD] text-content dark:border-border">
        <NotificationStatusIcon
          status={item.status}
          unreadLabel={unreadLabel}
          readLabel={readLabel}
          className="size-5 text-content [&_svg]:size-5"
        />
      </span>
    </button>
  );
}

