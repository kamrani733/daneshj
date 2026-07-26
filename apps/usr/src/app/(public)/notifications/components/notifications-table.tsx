import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import type { NotificationRecord } from '@/app/(public)/home/data/notifications-mock';
import { cn } from '@/lib/utils';

import { NotificationDateTime } from './notification-datetime';
import { NotificationStatusIcon } from './notification-status-icon';

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
};

export function NotificationsTable({ items }: NotificationsTableProps) {
  const t = useTranslations('notifications');

  return (
    <div className="w-full overflow-x-auto">
      <table
        dir="ltr"
        className="w-full min-w-[860px] border-separate border-spacing-y-2 text-center"
      >
        <thead>
          <tr>
            {COLUMNS.map((col, index) => (
              <th
                key={col.key}
                scope="col"
                style={{ width: col.width }}
                className={cn(
                  'bg-home-carousel-inactive px-1.5 py-2.5 text-sm font-medium leading-5 tracking-[0.0071em] text-neutral-600',
                  'border-y border-green-400',
                  index === 0 && 'rounded-l-xl border-l',
                  index === COLUMNS.length - 1 && 'rounded-r-xl border-r'
                )}
              >
                {t(`columns.${col.key}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              unreadLabel={t('statusUnread')}
              readLabel={t('statusRead')}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NotificationRow({
  item,
  unreadLabel,
  readLabel,
}: {
  item: NotificationRecord;
  unreadLabel: string;
  readLabel: string;
}) {
  const unread = item.status === 'unread';
  const cells: Record<ColKey, ReactNode> = {
    status: (
      <NotificationStatusIcon
        status={item.status}
        unreadLabel={unreadLabel}
        readLabel={readLabel}
        className="mx-auto text-green-700"
      />
    ),
    readAt: <NotificationDateTime date={item.readDate} time={item.readTime} />,
    link: (
      <a
        href={item.link}
        target="_blank"
        rel="noreferrer"
        className="break-all hover:underline"
      >
        {item.link}
      </a>
    ),
    body: item.body,
    subject: item.subject,
    subCategory: item.subCategory,
    mainCategory: item.mainCategory,
    sentAt: <NotificationDateTime date={item.date} time={item.time} />,
  };

  return (
    <tr
      className={cn(
        'text-sm font-medium leading-5 tracking-[0.0071em] text-green-700',
        unread ? 'bg-home-search-fill' : 'bg-white'
      )}
    >
      {COLUMNS.map((col, index) => (
        <td
          key={col.key}
          className={cn(
            'border-y border-green-400 px-1.5 py-2 align-middle',
            index === 0 && 'rounded-l-xl border-l',
            index === COLUMNS.length - 1 && 'rounded-r-xl border-r'
          )}
        >
          {cells[col.key]}
        </td>
      ))}
    </tr>
  );
}
