import Link from 'next/link';
import type { ReactNode } from 'react';

import { formatFaNumber } from '@/lib/format-fa';
import { formatIsoDateTime, toFaDigits } from '@/lib/jalali';

import type { ReportColumnDefinition, ReportRow } from '@operational-panel/types';
import { safeInternalHref } from '@operational-panel/utils/safe-href';

type Translate = (key: string, values?: Record<string, string>) => string;

/** Figma report links: primary text over a light underline. Without a target the text stays plain. */
function linkCell(content: ReactNode, href: string | null): ReactNode {
  if (!href) return <span className="text-primary">{content}</span>;
  return (
    <Link
      href={href}
      className="rounded-extra-small text-primary underline decoration-outline-variant underline-offset-6 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      {content}
    </Link>
  );
}

/**
 * One report value → display. Digits follow the shared display policy (Persian), dates go through the
 * shared Jalali util, usernames / IPs / ids are isolated LTR. `t` is the `operationalPanel` namespace.
 */
export function formatReportCell(row: ReportRow, column: ReportColumnDefinition, t: Translate): ReactNode {
  const value = row[column.key] ?? null;
  const href = safeInternalHref(row[`${column.key}Href`]);

  if (column.kind === 'action') return column.labelKey ? linkCell(t(column.labelKey), href) : '—';
  if (value === null || value === '') return column.emptyKey ? t(column.emptyKey) : '—';

  switch (column.kind) {
    case 'datetime': {
      const parts = formatIsoDateTime(String(value));
      if (!parts) return '—';
      return (
        <span className="inline-flex justify-center gap-x-1.5 whitespace-nowrap">
          <span>{parts.time}</span>
          <span>{parts.date}</span>
        </span>
      );
    }
    case 'date':
      return formatIsoDateTime(String(value))?.date ?? '—';
    case 'number':
    case 'money':
      return typeof value === 'number' ? formatFaNumber(value) : toFaDigits(value);
    case 'signedMoney': {
      if (typeof value !== 'number') return toFaDigits(value);
      const sign = value > 0 ? '+' : value < 0 ? '-' : '';
      return (
        <bdi dir="ltr" className={value < 0 ? 'text-error' : 'text-primary'}>
          {sign}
          {formatFaNumber(Math.abs(value))}
        </bdi>
      );
    }
    case 'hours':
      return t('units.hours', { count: typeof value === 'number' ? formatFaNumber(value) : toFaDigits(value) });
    case 'enum':
      return column.enumId ? t(`enums.${column.enumId}.${value}`) : String(value);
    case 'link':
      return linkCell(column.ltr ? <bdi dir="ltr">{toFaDigits(value)}</bdi> : toFaDigits(value), href);
    case 'ltr':
      return <bdi dir="ltr">{toFaDigits(value)}</bdi>;
    case 'longText':
      return <span className="line-clamp-2">{toFaDigits(value)}</span>;
    case 'text':
      return toFaDigits(value);
  }
}
