'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import type { DetailedStatusReportItem } from '@notifications/api';
import { HorizontalScroller } from '@/components/ui/horizontal-scroller';
import { Pagination } from '@/components/ui/pagination';
import { ReportCardList } from '@/components/ui/report-card-list';
import { ReportTable, type ReportTableColumn } from '@/components/ui/report-table';

/** Desktop columns, start (right) → end. */
const TABLE_COLUMNS = ['subject', 'body', 'mainCategory', 'subCategory', 'priority', 'sender'] as const;
/** Phone / tablet card fields (Figma tablet frame). */
const CARD_FIELDS = ['subject', 'body', 'mainCategory', 'subCategory', 'priority', 'status', 'channel', 'sentAt'] as const;

type FieldKey = (typeof TABLE_COLUMNS)[number] | (typeof CARD_FIELDS)[number];

type NotificationsReportRowsProps = {
  title: string;
  pageItems: DetailedStatusReportItem[];
  mobileItems: DetailedStatusReportItem[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loadMore: ReactNode;
};

/** Desktop: table + pagination · below `lg`: field cards + «بارگذاری بیشتر». */
export function NotificationsReportRows({
  title,
  pageItems,
  mobileItems,
  page,
  totalPages,
  onPageChange,
  loadMore,
}: NotificationsReportRowsProps) {
  const t = useTranslations('notifications.reports');
  const tTable = useTranslations('common.reportTable');

  const value = (item: DetailedStatusReportItem, key: FieldKey): ReactNode => {
    switch (key) {
      case 'subject':
        return item.subject || '—';
      case 'body':
        return <span className="line-clamp-2">{item.body || '—'}</span>;
      case 'mainCategory':
        return item.mainCategory;
      case 'subCategory':
        return item.subCategory;
      case 'priority':
        return t(`priority.${item.priority}`);
      case 'sender':
        return <bdi>{item.sender}</bdi>;
      case 'status':
        return t(`status.${item.status}`);
      case 'channel':
        return item.channels.length ? item.channels.map((c) => t(`channel.${c}`)).join('، ') : '—';
      case 'sentAt':
        return [item.sentDate, item.sentTime].filter(Boolean).join(' - ') || '—';
    }
  };

  const columns: ReportTableColumn[] = TABLE_COLUMNS.map((key) => ({
    key,
    header: t(`columns.${key}`),
    size: key === 'body' ? 'lg' : 'md',
  }));

  return (
    <>
      <div className="hidden flex-col gap-2 lg:flex">
        <HorizontalScroller
          label={title}
          scrollStartLabel={tTable('scrollStart')}
          scrollEndLabel={tTable('scrollEnd')}
        >
          <ReportTable
            caption={title}
            columns={columns}
            rows={pageItems}
            getRowKey={(item) => item.id}
            renderCell={(item, key) => value(item, key as FieldKey)}
          />
        </HorizontalScroller>
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        <ReportCardList
          items={mobileItems.map((item) => ({
            key: item.id,
            fields: CARD_FIELDS.map((key) => ({ key, label: t(`columns.${key}`), value: value(item, key) })),
          }))}
        />
        {loadMore}
      </div>
    </>
  );
}
