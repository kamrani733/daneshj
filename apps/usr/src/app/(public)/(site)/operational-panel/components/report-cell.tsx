import type { ReactNode } from 'react';

import { formatFaNumber } from '@/lib/format-fa';
import { formatIsoDateTime, toFaDigits } from '@/lib/jalali';

import type { ReportCellValue, ReportColumnDefinition } from '@operational-panel/types';

type Translate = (key: string, values?: Record<string, string>) => string;

/**
 * One report value → display. Digits follow the shared display policy (Persian), dates go through the
 * shared Jalali util, usernames / IPs / ids are isolated LTR. `t` is the `operationalPanel` namespace.
 */
export function formatReportCell(
  value: ReportCellValue,
  column: ReportColumnDefinition,
  t: Translate,
): ReactNode {
  if (value === null || value === '') return '—';

  switch (column.kind) {
    case 'datetime': {
      const parts = formatIsoDateTime(String(value));
      if (!parts) return '—';
      return (
        <span className="inline-flex flex-wrap justify-center gap-x-1.5 whitespace-nowrap">
          <span>{parts.time}</span>
          <span>{parts.date}</span>
        </span>
      );
    }
    case 'number':
    case 'money':
      return typeof value === 'number' ? formatFaNumber(value) : toFaDigits(value);
    case 'hours':
      return t('units.hours', { count: typeof value === 'number' ? formatFaNumber(value) : toFaDigits(value) });
    case 'enum':
      return column.enumId ? t(`enums.${column.enumId}.${value}`) : String(value);
    case 'ltr':
      return <bdi dir="ltr">{toFaDigits(value)}</bdi>;
    case 'longText':
      return <span className="line-clamp-2">{toFaDigits(value)}</span>;
    case 'text':
      return toFaDigits(value);
  }
}
