'use client';

import { useTranslations } from 'next-intl';

import fa from '@messages/fa.json';
import { toPanelAcademicRecord } from '@private-panel/api';
import type {
  VisibilityAcademicRecord,
  VisibilityField,
} from '@private-panel/data/visibility-config';
import { AcademicRecordCard } from '@/components/panel';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import {
  VisibilityCheckbox,
  VisibilityFieldCard,
  type VisibilityUiState,
} from './visibility-field';

const INTRO =
  fa.privatePanel.publicOps.manageVisibility.academicRecordsIntro;

type EducationRecordsSectionProps = {
  toggleFields: VisibilityField[];
  records: VisibilityAcademicRecord[];
  fieldSelection: Record<string, boolean>;
  recordSelection: Record<string, boolean>;
  onToggleField: (id: string) => void;
  onToggleRecord: (id: string) => void;
};

export function EducationRecordsSection({
  toggleFields,
  records,
  fieldSelection,
  recordSelection,
  onToggleField,
  onToggleRecord,
}: EducationRecordsSectionProps) {
  const t = useTranslations('privatePanel.publicOps.manageVisibility');

  return (
    <div className="flex flex-col gap-3 min-[720px]:gap-5">
      <ul className="flex list-disc flex-col gap-2 pe-4 text-justify text-xs font-medium leading-6 text-home-filter-muted marker:text-home-filter-muted min-[720px]:pe-5 min-[720px]:text-sm min-[720px]:leading-7 dark:text-home-filter-ink">
        {INTRO.map((paragraph) => (
          <li key={paragraph}>{paragraph}</li>
        ))}
      </ul>

      <div className="grid grid-cols-1 gap-3 min-[720px]:grid-cols-2 min-[720px]:gap-4">
        {toggleFields.map((field) => (
          <VisibilityFieldCard
            key={field.id}
            field={field}
            value=""
            selected={Boolean(fieldSelection[field.id])}
            onToggle={onToggleField}
          />
        ))}
      </div>

      <p className="text-justify text-xs font-medium leading-6 text-home-filter-muted min-[720px]:text-sm min-[720px]:leading-7 dark:text-home-filter-ink">
        {t('academicRecordsHint', {
          count: formatFaNumber(records.length),
        })}
      </p>

      <ul className="flex flex-col gap-3 min-[720px]:gap-4">
        {records.map((record) => {
          const selected = Boolean(recordSelection[record.id]);
          const state: VisibilityUiState = selected
            ? 'visible'
            : record.initiallyVisible
              ? 'pendingRemoval'
              : 'hidden';
          const caption = t(`captions.${state}`);

          return (
            <li key={record.id}>
              <AcademicRecordCard
                record={toPanelAcademicRecord(record)}
                className={cn(
                  'rounded-xl border-[#707973] bg-[#f8f8f0] p-3 dark:bg-home-search-category',
                  'min-[720px]:p-4',
                  state === 'visible' && 'border-[#dae6da]',
                  state === 'pendingRemoval' && 'border-warning/50',
                  state === 'hidden' && 'border-[#dbdbd3] dark:border-border'
                )}
                footer={
                  <VisibilityCheckbox
                    label={record.degree}
                    caption={caption}
                    state={state}
                    selected={selected}
                    locked={false}
                    onToggle={() => onToggleRecord(record.id)}
                  />
                }
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function academicRecordSelectionSeed(
  records: VisibilityAcademicRecord[]
): Record<string, boolean> {
  return Object.fromEntries(
    records.map((record) => [record.id, record.initiallyVisible])
  );
}
