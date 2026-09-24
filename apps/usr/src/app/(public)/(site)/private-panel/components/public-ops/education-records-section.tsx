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
} from '@private-panel/components/public-ops/visibility-field';

const INTRO =
  fa.privatePanel.publicOps.manageVisibility.academicRecordsIntro;

/** Grid order in Figma (RTL wrap: university first, then major, etc.). */
const ACADEMIC_TOGGLE_FIELD_ORDER = [
  'recordUniversity',
  'recordMajor',
  'recordFieldGroup',
  'recordStudentStatus',
  'recordDegreeLevel',
  'recordFaculty',
  'recordGraduationDate',
  'recordDegreeDescription',
] as const;

function orderAcademicToggleFields(fields: VisibilityField[]) {
  const byId = new Map(fields.map((field) => [field.id, field]));
  return ACADEMIC_TOGGLE_FIELD_ORDER.flatMap((id) => {
    const field = byId.get(id);
    return field ? [field] : [];
  });
}

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
      <ul className="flex list-disc flex-col gap-3 pe-4 text-justify text-xs font-medium leading-6 text-[#171D19] marker:text-[#171D19] min-[720px]:pe-5 min-[720px]:text-sm min-[720px]:leading-7 dark:text-app-filter-ink dark:marker:text-app-filter-ink">
        {INTRO.map((paragraph) => (
          <li key={paragraph}>{paragraph}</li>
        ))}
      </ul>

      <div
        className={cn(
          'grid grid-cols-1 gap-4',
          'min-[720px]:grid-cols-2 min-[720px]:gap-x-8 min-[720px]:gap-y-4'
        )}
      >
        {orderAcademicToggleFields(toggleFields).map((field) => (
          <VisibilityFieldCard
            key={field.id}
            field={field}
            value=""
            selected={Boolean(fieldSelection[field.id])}
            onToggle={onToggleField}
          />
        ))}
      </div>

      <ul className="flex list-disc flex-col gap-2 pe-4 marker:text-app-filter-muted min-[720px]:pe-5">
        <li className="text-justify text-xs font-medium leading-6 text-[#171D19] min-[720px]:text-sm min-[720px]:leading-7 dark:text-app-filter-ink">
          {t('academicRecordsHint', {
            count: formatFaNumber(records.length),
          })}
        </li>
      </ul>

      <ul className="flex flex-col gap-3 min-[720px]:gap-4">
        {records.map((record) => {
          const selected = Boolean(recordSelection[record.id]);
          const state: VisibilityUiState = selected ? 'visible' : 'hidden';
          const caption = t(`captions.${state}`);

          return (
            <li key={record.id}>
              <div
                className={cn(
                  'flex flex-col gap-2 rounded-3xl border p-2',
                  selected
                    ? 'border-[#8DD5B2]'
                    : 'border-border dark:border-auth-input-border'
                )}
              >
                <AcademicRecordCard
                  record={toPanelAcademicRecord(record)}
                  className={cn(
                    'rounded-3xl border border-[#DBD8D1] bg-[#F8F8F0] p-4',
                    'min-[720px]:px-6 min-[720px]:py-6',
                    'dark:border-auth-input-border dark:bg-app-card'
                  )}
                />
                <VisibilityCheckbox
                  label={record.degree}
                  caption={caption}
                  state={state}
                  selected={selected}
                  locked={false}
                  className="px-1"
                  onToggle={() => onToggleRecord(record.id)}
                />
              </div>
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
