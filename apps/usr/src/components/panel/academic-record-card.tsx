'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { PanelAcademicRecord } from '@/components/panel/types';

type AcademicRecordCardProps = {
  record: PanelAcademicRecord;
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** Outer shell (border, radius, background). Footer renders inside when present. */
  bodyClassName?: string;
  footerClassName?: string;
};

export function AcademicRecordCard({
  record,
  actions,
  footer,
  className,
  bodyClassName,
  footerClassName,
}: AcademicRecordCardProps) {
  const t = useTranslations('panel.academicRecord');
  const roleLabel = record.roleLabel || t(`role.${record.role}`);
  const statusLabel = record.statusLabel || t(`status.${record.status}`);
  const verified = record.status === 'verified';
  const hasShell = Boolean(bodyClassName);

  return (
    <article
      className={cn(
        'flex w-full flex-col',
        hasShell
          ? cn('overflow-hidden', bodyClassName)
          : cn('gap-3', className)
      )}
    >
      <div
        className={cn(
          hasShell &&
            cn(
              'flex flex-col gap-2.5 p-3 min-[720px]:gap-3 min-[720px]:p-4',
              className
            ),
          !hasShell && 'contents'
        )}
      >
      <div className="flex flex-wrap items-center justify-start gap-4">
        <h4 className="text-sm font-semibold text-[#404943] min-[720px]:text-base dark:text-app-filter-ink">
          {record.degree || '\u00a0'}
        </h4>
        {roleLabel ? (
          <Badge
            variant="outline"
            className={cn(
              'h-[30px] rounded-full bg-transparent px-3 text-xs font-medium leading-4',
              record.role === 'graduate'
                ? 'border-[#008D63] text-[#008D63] dark:border-primary-100 dark:text-primary-100'
                : 'border-warning text-warning'
            )}
          >
            {roleLabel}
          </Badge>
        ) : null}
        <Badge
          variant="secondary"
          className={cn(
            'h-[30px] gap-2 rounded-full px-3 text-xs font-medium leading-4',
            verified
              ? 'border border-[#8DD5B2] bg-[#D3F4E1] text-[#008D63] dark:border-primary-100/40 dark:bg-primary/20 dark:text-primary-100'
              : 'border-0 bg-[#ffdbcf] text-[#72351f]'
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

      <div
        className={cn(
          'flex flex-col gap-2.5 text-start text-sm font-semibold leading-5',
          'text-[#404943] min-[720px]:flex-row min-[720px]:items-start',
          'min-[720px]:justify-between min-[720px]:gap-10 dark:text-app-filter-muted'
        )}
      >
        <div className="flex min-w-0 flex-col items-start gap-2.5">
          {record.university ? <p>{record.university}</p> : null}
          {record.fieldGroup ? (
            <p>{t('fieldGroup', { value: record.fieldGroup })}</p>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col items-start gap-2.5 min-[720px]:max-w-[320px] min-[720px]:shrink-0">
          {record.description ? <p>{record.description}</p> : null}
          {record.endDate ? <p>{t('endDate', { date: record.endDate })}</p> : null}
        </div>
      </div>
      </div>
      {footer ? (
        <div
          className={cn(
            'border-t border-border/70 px-3 py-2.5 min-[720px]:px-4 min-[720px]:py-3',
            'dark:border-border/60',
            footerClassName
          )}
        >
          {footer}
        </div>
      ) : null}
    </article>
  );
}
