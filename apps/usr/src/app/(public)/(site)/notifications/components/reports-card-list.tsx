'use client';

import { useTranslations } from 'next-intl';

import type { DetailedStatusReportItem } from '@notifications/api';
import { cn } from '@/lib/utils';

type ReportsCardListProps = {
  items: DetailedStatusReportItem[];
};

/** Mobile/tablet Figma — labeled field cards. */
export function ReportsCardList({ items }: ReportsCardListProps) {
  const t = useTranslations('notifications.reports');

  return (
    <ul className="flex w-full flex-col gap-3">
      {items.map((item) => (
        <li key={item.id}>
          <article className="flex flex-col gap-2.5 rounded-xl bg-white p-4 ring-1 ring-border/40 dark:bg-home-search-category">
            <Field label={t('columns.subject')} value={item.subject || '—'} />
            <Field label={t('columns.body')} value={item.body || '—'} />
            <Field
              label={t('columns.mainCategory')}
              value={item.mainCategory}
            />
            <Field
              label={t('columns.subCategory')}
              value={item.subCategory}
            />
            <Field
              label={t('columns.priority')}
              value={t(`priority.${item.priority}`)}
            />
            <Field
              label={t('columns.status')}
              value={t(`status.${item.status}`)}
            />
            <Field
              label={t('columns.channel')}
              value={
                item.channels.length
                  ? item.channels.map((c) => t(`channel.${c}`)).join('، ')
                  : '—'
              }
            />
            <Field
              label={t('columns.sentAt')}
              value={[item.sentTime, item.sentDate].filter(Boolean).join(' ') || '—'}
            />
          </article>
        </li>
      ))}
    </ul>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 text-sm leading-5">
      <span className="font-medium text-neutral-500">{label}</span>
      <span className={cn('font-medium text-content')}>{value}</span>
    </div>
  );
}
