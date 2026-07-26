'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import type { NotificationRecord } from '@/app/(public)/home/data/notifications-mock';
import { cn } from '@/lib/utils';

import { NotificationStatusIcon } from './notification-status-icon';

type NotificationsCardListProps = {
  items: NotificationRecord[];
  onItemSelect?: (item: NotificationRecord) => void;
};

/** Figma manual notifications tab #2419:2680 — RTL card list. */
export function NotificationsCardList({
  items,
  onItemSelect,
}: NotificationsCardListProps) {
  const t = useTranslations('notifications');

  return (
    <ul className="flex w-full flex-col gap-3">
      {items.map((item) => (
        <li key={item.id}>
          <NotificationCard
            item={item}
            fallbackSubject={t('fallbackSubject')}
            unreadLabel={t('statusUnread')}
            readLabel={t('statusRead')}
            mainCategoryLabel={t('columns.mainCategory')}
            subCategoryLabel={t('columns.subCategory')}
            linkLabel={t('columns.link')}
            readAtLabel={t('readAtLabel')}
            unreadPlaceholder={t('unreadPlaceholder')}
            onSelect={onItemSelect}
          />
        </li>
      ))}
    </ul>
  );
}

function NotificationCard({
  item,
  fallbackSubject,
  unreadLabel,
  readLabel,
  mainCategoryLabel,
  subCategoryLabel,
  linkLabel,
  readAtLabel,
  unreadPlaceholder,
  onSelect,
}: {
  item: NotificationRecord;
  fallbackSubject: string;
  unreadLabel: string;
  readLabel: string;
  mainCategoryLabel: string;
  subCategoryLabel: string;
  linkLabel: string;
  readAtLabel: string;
  unreadPlaceholder: string;
  onSelect?: (item: NotificationRecord) => void;
}) {
  const unread = item.status === 'unread';
  const sentLabel = [item.date.trim(), item.time.trim()].filter(Boolean).join(' ');
  const readLabelText =
    item.readDate && item.readTime
      ? `${item.readDate.trim()} ${item.readTime.trim()}`
      : unreadPlaceholder;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(item)}
      className={cn(
        'flex w-full flex-col gap-3 rounded-xl border border-border bg-white p-4 text-start',
        'transition-opacity hover:opacity-95',
        onSelect && 'cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium leading-5 text-neutral-600">
          {sentLabel}
        </span>
        <NotificationStatusIcon
          status={item.status}
          unreadLabel={unreadLabel}
          readLabel={readLabel}
          className="shrink-0 text-content"
        />
      </div>

      <div className="flex flex-col gap-2 text-sm leading-5 text-content">
        <p className="font-bold">{item.subject || fallbackSubject}</p>
        {item.body ? (
          <p className="font-medium text-neutral-600">{item.body}</p>
        ) : null}

        <MetaRow label={mainCategoryLabel} value={item.mainCategory} />
        <MetaRow label={subCategoryLabel} value={item.subCategory} />
        <MetaRow
          label={linkLabel}
          value={
            item.link ? (
              <a
                href={
                  item.link.startsWith('http') ? item.link : `https://${item.link}`
                }
                target="_blank"
                rel="noreferrer"
                className="break-all text-primary hover:underline"
                dir="ltr"
                onClick={(event) => event.stopPropagation()}
              >
                {item.link}
              </a>
            ) : (
              '—'
            )
          }
        />
      </div>

      <p
        className={cn(
          'text-sm font-medium leading-5 text-neutral-600',
          unread && 'opacity-80'
        )}
      >
        {readAtLabel} : {readLabelText}
      </p>
    </button>
  );
}

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <p className="font-medium text-neutral-600">
      <span>{label}: </span>
      <span className="text-content">{value}</span>
    </p>
  );
}
