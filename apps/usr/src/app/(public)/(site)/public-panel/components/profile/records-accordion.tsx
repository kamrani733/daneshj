'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { AcademicRecord } from '@public-panel/data/public-panel-ui';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { TitleUnderline } from '../shared/title-underline';

type RecordsAccordionProps = {
  username: string;
  records: AcademicRecord[];
};

/** Collapsible academic records section. */
export function RecordsAccordion({ username, records }: RecordsAccordionProps) {
  const t = useTranslations('publicPanel');
  const [open, setOpen] = useState(false);

  return (
    <section className="flex w-full flex-col items-start py-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-fit flex-col items-start gap-2 px-8 py-2"
      >
        <span className="inline-flex items-center gap-2 px-2 text-lg font-bold leading-6 text-[#005138]">
          <ChevronDown
            className={cn(
              'size-6 shrink-0 transition-transform',
              open && 'rotate-180'
            )}
            aria-hidden
          />
          {t('academicRecords', {
            username,
            count: formatFaNumber(records.length),
          })}
        </span>
        <TitleUnderline />
      </button>

      {open ? (
        <ul className="mt-6 flex flex-col gap-3">
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
