'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { HorizontalScroller } from '@/components/ui/horizontal-scroller';
import { Pagination } from '@/components/ui/pagination';
import { ReportCardList } from '@/components/ui/report-card-list';
import { ReportTable, type ReportTableColumn } from '@/components/ui/report-table';

import { formatReportCell } from '@operational-panel/components/report-cell';
import type { ReportDefinition, ReportRow } from '@operational-panel/types';

type ReportRowsProps = {
  definition: ReportDefinition;
  title: string;
  pageItems: ReportRow[];
  mobileItems: ReportRow[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loadMore: ReactNode;
};

/** Desktop: table (horizontal scroll when wide) + pagination · below `lg`: field cards + «مشاهده بیشتر». */
export function ReportRows({
  definition,
  title,
  pageItems,
  mobileItems,
  page,
  totalPages,
  onPageChange,
  loadMore,
}: ReportRowsProps) {
  const t = useTranslations('operationalPanel');
  const tTable = useTranslations('common.reportTable');
  const header = (key: string) => t(`reports.${definition.id}.columns.${key}`);

  const columns: ReportTableColumn[] = definition.columns.map((column) => ({
    key: column.key,
    header: header(column.key),
    size: column.kind === 'longText' ? 'lg' : 'md',
  }));

  const cell = (row: ReportRow, key: string) => {
    const column = definition.columns.find((item) => item.key === key);
    return column ? formatReportCell(row, column, t) : '—';
  };

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
            getRowKey={(row) => row.id}
            renderCell={cell}
          />
        </HorizontalScroller>
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        <ReportCardList
          items={mobileItems.map((row) => ({
            key: row.id,
            fields: definition.columns.map((column) => ({
              key: column.key,
              label: header(column.key),
              value: cell(row, column.key),
            })),
          }))}
        />
        {loadMore}
      </div>
    </>
  );
}
