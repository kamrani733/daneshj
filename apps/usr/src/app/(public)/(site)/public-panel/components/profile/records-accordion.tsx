'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type {
  AcademicRecord,
  EducationAddress,
} from '@public-panel/types/ui';
import { AcademicRecordCard, EducationAddressCard } from '@/components/panel';
import { cn } from '@/lib/utils';

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

  // Empty records → section hidden (`400:142206`).
  if (records.length === 0) return null;

  return (
    <section className="flex w-full flex-col items-start gap-5 py-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex w-fit items-center gap-2 px-2"
      >
        {/* Secondary bar heading + trailing chevron (Public Panel export, «سوابق تحصیلی»). */}
        <span aria-hidden className="h-6 w-2 shrink-0 rounded-[2px] bg-secondary" />
        <span className="text-title-medium font-bold text-on-primary-container min-[720px]:text-title-large">
          {t('academicRecords', { username })}
        </span>
        <ChevronDown
          className={cn(
            'size-5 shrink-0 text-on-surface transition-transform',
            open && 'rotate-180'
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="flex w-full flex-col gap-5">
          <EducationAddressCard address={address} />
          <ul className="flex w-full flex-col gap-5">
            {records.map((record) => (
              <li key={record.id}>
                <AcademicRecordCard
                  record={record}
                  className="rounded-2xl border border-border bg-app-stat-card px-6 py-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]"
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
