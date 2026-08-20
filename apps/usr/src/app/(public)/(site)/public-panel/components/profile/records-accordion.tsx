'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type {
  AcademicRecord,
  EducationAddress,
} from '@public-panel/types/ui';
import { AcademicRecordCard, EducationAddressCard } from '@/components/panel';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { TitleUnderline } from '../shared/title-underline';

type RecordsAccordionProps = {
  username: string;
  records: AcademicRecord[];
  address: EducationAddress;
};

export function RecordsAccordion({
  username,
  records,
  address,
}: RecordsAccordionProps) {
  const t = useTranslations('publicPanel');
  const [open, setOpen] = useState(false);

  return (
    <section className="flex w-full flex-col items-start gap-5 py-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-fit flex-col items-start gap-1.5 px-2"
      >
        <span className="inline-flex items-center gap-1.5 text-lg font-bold leading-6 text-primary-700 dark:text-primary-100">
          <ChevronDown
            className={cn(
              'size-5 shrink-0 transition-transform',
              open && 'rotate-180'
            )}
            aria-hidden
          />
          {t('academicRecords', {
            username,
            count: formatFaNumber(records.length),
          })}
        </span>
        <TitleUnderline className="w-full" />
      </button>

      {open ? (
        <div className="flex w-full flex-col gap-5">
          <EducationAddressCard address={address} />
          <ul className="flex w-full flex-col gap-5">
            {records.map((record) => (
              <li key={record.id}>
                <AcademicRecordCard
                  record={record}
                  className="rounded-2xl border border-border bg-home-stat-card px-6 py-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]"
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
