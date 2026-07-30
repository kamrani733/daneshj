'use client';

import { useTranslations } from 'next-intl';

import type { DetailedStatusReportItem } from '@notifications/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

/**
 * Figma visual left → right (dir=ltr on table):
 * sender · priority · subCategory · mainCategory · body · subject
 */
const COLUMNS = [
  { key: 'sender', width: '110px' },
  { key: 'priority', width: '80px' },
  { key: 'subCategory', width: '140px' },
  { key: 'mainCategory', width: '140px' },
  { key: 'body', width: '180px' },
  { key: 'subject', width: '120px' },
] as const;

type ColKey = (typeof COLUMNS)[number]['key'];

type ReportsTableProps = {
  items: DetailedStatusReportItem[];
};

export function ReportsTable({ items }: ReportsTableProps) {
  const t = useTranslations('notifications.reports');

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
          <TableRow
            key={item.id}
            className="border-0 bg-white shadow-sm hover:bg-white odd:dark:bg-home-search-fill even:dark:bg-home-search-category dark:hover:bg-inherit"
          >
            {COLUMNS.map((col, index) => (
              <TableCell
                key={col.key}
                dir="rtl"
                className={cn(
                  'px-1.5 py-3 text-center text-sm leading-5 text-content',
                  'border-y border-border/60 dark:border-border',
                  index === 0 && 'rounded-l-xl border-l',
                  index === COLUMNS.length - 1 && 'rounded-r-xl border-r'
                )}
              >
                {renderCell(item, col.key, t)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function renderCell(
  item: DetailedStatusReportItem,
  key: ColKey,
  t: ReturnType<typeof useTranslations<'notifications.reports'>>
) {
  switch (key) {
    case 'sender':
      return item.sender;
    case 'priority':
      return t(`priority.${item.priority}`);
    case 'subCategory':
      return item.subCategory;
    case 'mainCategory':
      return item.mainCategory;
    case 'body':
      return (
        <span className="line-clamp-2 block text-start">{item.body}</span>
      );
    case 'subject':
      return item.subject || '—';
    default:
      return '—';
  }
}
