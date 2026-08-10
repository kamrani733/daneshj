'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import fa from '@messages/fa.json';
import type {
  VisibilityAcademicRecord,
  VisibilityField,
} from '@private-panel/data/manage-visibility-mock';
import { Badge } from '@/components/ui/badge';
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

/** Academic-records block: field toggles + selectable record cards. */
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
            onValueChange={() => undefined}
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
              <article
                className={cn(
                  'flex flex-col gap-2.5 rounded-xl border bg-[#f8f8f0] p-3 dark:bg-home-search-category',
                  'min-[720px]:gap-3 min-[720px]:p-4',
                  state === 'visible' && 'border-[#dae6da]',
                  state === 'pendingRemoval' && 'border-warning/50',
                  state === 'hidden' && 'border-[#dbdbd3] dark:border-border'
                )}
              >
                <div className="flex flex-wrap items-center gap-1.5 min-[720px]:gap-2">
                  <h4 className="text-sm font-bold text-content dark:text-home-filter-ink min-[720px]:text-base">
                    {record.degree}
                  </h4>
                  <Badge
                    variant="outline"
                    className="h-6 rounded-full border-primary px-2 text-[10px] font-medium text-primary min-[720px]:h-7 min-[720px]:px-2.5 min-[720px]:text-xs dark:border-primary-100 dark:text-primary-100"
                  >
                    {record.roleLabel}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="h-6 gap-1 rounded-full border-0 bg-primary-subtle px-2 text-[10px] font-medium text-primary-700 min-[720px]:h-7 min-[720px]:px-2.5 min-[720px]:text-xs dark:bg-primary/20 dark:text-primary-100"
                  >
                    <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
                    {record.statusLabel}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2 text-start text-xs leading-6 text-home-filter-muted min-[720px]:flex-row min-[720px]:justify-between min-[720px]:gap-8 min-[720px]:text-sm dark:text-home-filter-ink">
                  <div className="flex min-w-0 flex-col gap-1">
                    <p>
                      {record.university}، {record.faculty}
                    </p>
                    <p>
                      {t('fields.recordFieldGroup')}: {record.fieldGroup}
                    </p>
                  </div>
                  <div className="flex min-w-0 flex-col gap-1 min-[720px]:max-w-[320px]">
                    <p>{record.description}</p>
                    <p>
                      {t('fields.recordGraduationDate')}: {record.endDate}
                    </p>
                  </div>
                </div>

                <VisibilityCheckbox
                  label={record.degree}
                  caption={caption}
                  state={state}
                  selected={selected}
                  locked={false}
                  onToggle={() => onToggleRecord(record.id)}
                />
              </article>
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
