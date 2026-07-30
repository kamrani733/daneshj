'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { AcademicRecord } from '@public-panel/data/public-panel-mock';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type RecordsAccordionProps = {
  username: string;
  records: AcademicRecord[];
};

/** Figma Records header — teal underline, chevron beside label. */
export function RecordsAccordion({ username, records }: RecordsAccordionProps) {
  const t = useTranslations('publicPanel');
  const [open, setOpen] = useState(false);

  return (
    <section className="flex w-full flex-col">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-center gap-2 border-b-2 border-primary py-3 text-base font-medium text-primary"
      >
        <ChevronDown
          className={cn(
            'size-5 shrink-0 transition-transform',
            open && 'rotate-180'
          )}
          aria-hidden
        />
        <span>
          {t('academicRecords', {
            username,
            count: formatFaNumber(records.length),
          })}
        </span>
      </button>

      {open ? (
        <ul className="mt-3 flex flex-col gap-3">
          {records.map((record) => (
            <li
              key={record.id}
              className="rounded-xl border border-border/50 bg-white px-4 py-3 dark:bg-home-search-category"
            >
              <div className="flex flex-col gap-1 text-sm leading-5 text-home-filter-ink min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between">
                <div className="flex flex-col gap-0.5 text-end min-[720px]:text-start">
                  <span className="font-bold">{record.degree}</span>
                  <span className="text-home-filter-muted">{record.field}</span>
                  <span className="text-home-filter-muted">
                    {record.university}
                  </span>
                </div>
                <span className="shrink-0 text-home-filter-muted">
                  {record.years}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
