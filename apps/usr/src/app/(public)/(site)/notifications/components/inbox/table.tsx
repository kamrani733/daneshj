'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import type { NotificationRecord } from '@notifications/data/notifications-ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { NotificationDateTime } from './datetime';
import { NotificationStatusIcon } from './status-icon';

/**
 * Figma visual left → right (dir=ltr on table):
 * status · readAt · link · body · subject · subCategory · mainCategory · sentAt
 */
const COLUMNS = [
  { key: 'status', width: '56px' },
  { key: 'readAt', width: '90px' },
  { key: 'link', width: '140px' },
  { key: 'body', width: '140px' },
  { key: 'subject', width: '90px' },
  { key: 'subCategory', width: '110px' },
  { key: 'mainCategory', width: '110px' },
  { key: 'sentAt', width: '90px' },
] as const;

type ColKey = (typeof COLUMNS)[number]['key'];

type NotificationsTableProps = {
  items: NotificationRecord[];
  onItemSelect?: (item: NotificationRecord) => void;
};

/** Desktop Figma #2424:2076 — shadcn Table. */
export function NotificationsTable({
  items,
  onItemSelect,
}: NotificationsTableProps) {
  const t = useTranslations('notifications');

  return (
    <Table
      dir="ltr"
      className="min-w-[860px] border-separate border-spacing-y-2 text-center"
    >
      <TableHeader className="[&_tr]:border-0">
        <TableRow className="border-0 hover:bg-transparent">
          {COLUMNS.map((col, index) => (
            <TableHead
              key={col.key}
              style={{ width: col.width }}
              className={cn(
                'h-auto bg-home-carousel-inactive px-1.5 py-2.5 text-center text-sm font-medium leading-5 tracking-[0.0071em] text-neutral-600 dark:text-muted-foreground',
                'border-y border-green-400 dark:border-border',
                index === 0 && 'rounded-l-xl border-l',
                index === COLUMNS.length - 1 && 'rounded-r-xl border-r'
              )}
            >
              {t(`columns.${col.key}`)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <NotificationRow
            key={item.id}
            item={item}
            unreadLabel={t('statusUnread')}
            readLabel={t('statusRead')}
            fallbackSubject={t('fallbackSubject')}
            onSelect={onItemSelect}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function NotificationRow({
  item,
  unreadLabel,
  readLabel,
  fallbackSubject,
  onSelect,
}: {
  item: NotificationRecord;
  unreadLabel: string;
  readLabel: string;
  fallbackSubject: string;
  onSelect?: (item: NotificationRecord) => void;
}) {
  const unread = item.status === 'unread';
  const cells: Record<ColKey, ReactNode> = {
    status: (
      <NotificationStatusIcon
        status={item.status}
        unreadLabel={unreadLabel}
        readLabel={readLabel}
        className="mx-auto text-green-700 dark:text-primary-200"
      />
    ),
    readAt: <NotificationDateTime date={item.readDate} time={item.readTime} />,
    link: item.link ? (
      <a
        href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
        target="_blank"
        rel="noreferrer"
        className="break-all whitespace-normal hover:underline"
        onClick={(event) => event.stopPropagation()}
      >
        {item.link}
      </a>
    ) : (
      '—'
    ),
    body: (
      <span className="whitespace-normal">{item.body}</span>
    ),
    subject: item.subject || fallbackSubject,
    subCategory: (
      <span className="whitespace-normal">{item.subCategory}</span>
    ),
    mainCategory: (
      <span className="whitespace-normal">{item.mainCategory}</span>
    ),
    sentAt: <NotificationDateTime date={item.date} time={item.time} />,
  };

  return (
    <TableRow
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect?.(item)}
      onKeyDown={(event) => {
        if (!onSelect) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(item);
        }
      }}
      className={cn(
        'border-0 text-sm font-medium leading-5 tracking-[0.0071em] text-green-700 hover:bg-transparent dark:text-muted-foreground',
        unread
          ? 'bg-home-search-fill font-bold dark:bg-home-search-fill dark:text-content'
          : 'bg-white dark:bg-home-search-category',
        onSelect && 'cursor-pointer'
      )}
    >
      {COLUMNS.map((col, index) => (
        <TableCell
          key={col.key}
          className={cn(
            'border-y border-green-400 px-1.5 py-2 text-center align-middle dark:border-border',
            index === 0 && 'rounded-l-xl border-l',
            index === COLUMNS.length - 1 && 'rounded-r-xl border-r'
          )}
        >
          {cells[col.key]}
        </TableCell>
      ))}
    </TableRow>
  );
}
