'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { PanelAcademicRecord } from './types';

type AcademicRecordCardProps = {
  record: PanelAcademicRecord;
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function AcademicRecordCard({
  record,
  actions,
  footer,
  className,
}: AcademicRecordCardProps) {
  const t = useTranslations('panel.academicRecord');
  const roleLabel = record.roleLabel || t(`role.${record.role}`);
  const statusLabel = record.statusLabel || t(`status.${record.status}`);
  const verified = record.status === 'verified';

  return (
    <article className={cn('flex w-full flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center justify-start gap-2">
        <h4 className="text-sm font-bold text-[#171d19] dark:text-home-filter-ink min-[720px]:text-base">
          {record.degree || '\u00a0'}
        </h4>
        {roleLabel ? (
          <Badge
            variant="outline"
            className={cn(
              'h-7 rounded-full bg-transparent px-2.5 text-xs font-medium leading-4',
              record.role === 'graduate'
                ? 'border-[#008d63] text-[#008d63] dark:border-primary-100 dark:text-primary-100'
                : 'border-warning text-warning'
            )}
          >
            {roleLabel}
          </Badge>
        ) : null}
        <Badge
          variant="secondary"
          className={cn(
            'h-7 gap-1 rounded-full border-0 px-2.5 text-xs font-medium leading-4',
            verified
              ? 'bg-[#008d63]/15 text-[#008d63] dark:bg-primary/20 dark:text-primary-100'
              : 'bg-[#ffdbcf] text-[#72351f]'
          )}
        >
          {verified ? (
            <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
          ) : null}
          {statusLabel}
        </Badge>
        {actions ? (
          <div className="ms-auto flex items-center gap-2">{actions}</div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 text-start text-sm leading-6 text-[#404943] min-[720px]:flex-row min-[720px]:items-start min-[720px]:justify-between min-[720px]:gap-10 dark:text-home-filter-muted">
        <div className="flex min-w-0 flex-col items-start gap-1">
          {record.university ? (
            <p className="font-medium text-home-filter-muted dark:text-home-filter-ink">
              {record.university}
            </p>
          ) : null}
          {record.fieldGroup ? (
            <p>{t('fieldGroup', { value: record.fieldGroup })}</p>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col items-start gap-1 min-[720px]:max-w-[320px] min-[720px]:shrink-0">
          {record.description ? <p>{record.description}</p> : null}
          {record.endDate ? <p>{t('endDate', { date: record.endDate })}</p> : null}
        </div>
      </div>
      {footer}
    </article>
  );
}
