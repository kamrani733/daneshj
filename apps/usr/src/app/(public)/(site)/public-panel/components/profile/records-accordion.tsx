'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type {
  AcademicRecord,
  EducationAddress,
} from '@public-panel/data/public-panel-ui';
import { Badge } from '@/components/ui/badge';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { BorderedSectionCard } from '../shared/bordered-section-card';
import { TitleUnderline } from '../shared/title-underline';

type RecordsAccordionProps = {
  username: string;
  records: AcademicRecord[];
  address: EducationAddress;
};

/** Collapsible academic records section. */
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
          <BorderedSectionCard
            title={t('educationAddress.title')}
            titleBgClassName="bg-home-scene"
            titleClassName="text-sm font-medium text-home-filter-muted dark:text-home-filter-ink"
            className="rounded-xl border-border bg-home-search-fill px-6 py-5 dark:bg-home-search-category"
          >
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 min-[720px]:grid-cols-4">
              <AddressField
                label={t('educationAddress.country')}
                value={address.country}
              />
              <AddressField
                label={t('educationAddress.province')}
                value={address.province}
              />
              <AddressField
                label={t('educationAddress.city')}
                value={address.city}
              />
              <AddressField
                label={t('educationAddress.district')}
                value={address.district}
              />
            </dl>
          </BorderedSectionCard>

          <ul className="flex w-full flex-col gap-5">
            {records.map((record) => (
              <li key={record.id}>
                <AcademicRecordCard record={record} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function AddressField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <dt className="text-xs font-medium leading-5 text-neutral-600 dark:text-home-filter-muted">
        {label}
      </dt>
      <dd className="text-sm font-bold leading-5 text-home-filter-ink">
        {value}
      </dd>
    </div>
  );
}

function AcademicRecordCard({ record }: { record: AcademicRecord }) {
  const t = useTranslations('publicPanel.academicRecord');

  return (
    <article className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-home-stat-card px-6 py-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-base font-bold leading-6 text-home-filter-ink">
          {record.degree}
        </h4>
        <RoleBadge role={record.role} />
        <StatusBadge status={record.status} />
      </div>

      <div className="flex flex-col gap-2 min-[720px]:flex-row min-[720px]:items-start min-[720px]:justify-between min-[720px]:gap-10">
        <div className="flex min-w-0 flex-col items-start gap-1 text-start">
          <p className="text-sm font-medium leading-5 text-home-filter-muted dark:text-home-filter-ink">
            {record.university}
          </p>
          <p className="text-sm leading-5 text-neutral-600 dark:text-home-filter-muted">
            {t('fieldGroup', { value: record.fieldGroup })}
          </p>
        </div>

        <div className="flex min-w-0 flex-col items-start gap-1 text-start min-[720px]:max-w-[320px] min-[720px]:shrink-0">
          <p className="text-sm leading-5 text-home-filter-muted dark:text-home-filter-ink">
            {record.description}
          </p>
          <p className="text-sm leading-5 text-neutral-600 dark:text-home-filter-muted">
            {t('endDate', { date: record.endDate })}
          </p>
        </div>
      </div>
    </article>
  );
}

function RoleBadge({ role }: { role: AcademicRecord['role'] }) {
  const t = useTranslations('publicPanel.academicRecord.role');

  return (
    <Badge
      variant="outline"
      className={cn(
        'h-7 rounded-full bg-transparent px-2.5 text-xs font-medium leading-4',
        role === 'graduate'
          ? 'border-primary text-primary dark:border-primary-100 dark:text-primary-100'
          : 'border-warning text-warning'
      )}
    >
      {t(role)}
    </Badge>
  );
}

function StatusBadge({ status }: { status: AcademicRecord['status'] }) {
  const t = useTranslations('publicPanel.academicRecord.status');

  if (status === 'verified') {
    return (
      <Badge
        variant="secondary"
        className="h-7 gap-1 rounded-full border-0 bg-primary-subtle px-2.5 text-xs font-medium leading-4 text-primary-700 dark:bg-primary/20 dark:text-primary-100"
      >
        <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
        {t('verified')}
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="h-7 rounded-full border-0 bg-home-promo-invite px-2.5 text-xs font-medium leading-4 text-home-promo-invite"
    >
      {t('declared')}
    </Badge>
  );
}
