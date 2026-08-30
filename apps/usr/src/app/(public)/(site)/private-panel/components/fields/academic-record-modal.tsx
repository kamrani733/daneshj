'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import {
  ACADEMIC_GROUP_OPTIONS,
  DEGREE_LEVEL_OPTIONS,
  STUDY_STATUS_OPTIONS,
} from '@private-panel/data/field-options';
import type { VisibilityAcademicRecord } from '@private-panel/data/visibility-config';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  OutlinedDateField,
  OutlinedSelectField,
  OutlinedTextField,
} from '@/components/ui/outlined-field';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export type AcademicRecordFormValues = {
  academicGroup: string;
  fieldOfStudy: string;
  university: string;
  faculty: string;
  degreeLevel: string;
  studyStatus: string;
  description: string;
  endDate: string;
};

const EMPTY_FORM: AcademicRecordFormValues = {
  academicGroup: '',
  fieldOfStudy: '',
  university: '',
  faculty: '',
  degreeLevel: '',
  studyStatus: '',
  description: '',
  endDate: '',
};

const DIALOG_LABEL_SURFACE = 'bg-[#f9f8f3] dark:bg-app-card';

type AcademicRecordModalProps = {
  open: boolean;
  record: VisibilityAcademicRecord | null;
  saving?: boolean;
  error?: string | null;
  onOpenChange: (open: boolean) => void;
  onSave: (values: AcademicRecordFormValues) => void;
};

export function academicRecordToFormValues(
  record: VisibilityAcademicRecord | null
): AcademicRecordFormValues {
  if (!record) return { ...EMPTY_FORM };
  return {
    academicGroup: record.academicGroup,
    fieldOfStudy: record.fieldOfStudy,
    university: record.university,
    faculty: record.faculty,
    degreeLevel: record.degreeLevel,
    studyStatus: record.studyStatus,
    description: record.description,
    endDate: record.endDate.slice(0, 10),
  };
}

export function AcademicRecordModal({
  open,
  record,
  saving = false,
  error = null,
  onOpenChange,
  onSave,
}: AcademicRecordModalProps) {
  const t = useTranslations('privatePanel.fields.academicModal');
  const [values, setValues] = useState<AcademicRecordFormValues>(EMPTY_FORM);

  useEffect(() => {
    if (!open) return;
    setValues(academicRecordToFormValues(record));
  }, [open, record]);

  const setField = <K extends keyof AcademicRecordFormValues>(
    key: K,
    value: AcademicRecordFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        showCloseButton={false}
        className={cn(
          'max-h-[min(90vh,900px)] w-[min(720px,calc(100%-2rem))] overflow-y-auto',
          'gap-6 rounded-[28px] border-0 bg-[#f9f8f3] p-6 shadow-app-elevation-2',
          'sm:max-w-[720px] dark:border dark:border-auth-input-border dark:bg-app-card'
        )}
      >
        <DialogTitle className="text-start text-base font-bold text-[#171d19] dark:text-primary-100">
          {t('title')}
        </DialogTitle>

        <div className="grid grid-cols-1 gap-5 min-[640px]:grid-cols-2">
          <OutlinedSelectField
            label={t('academicGroup')}
            value={values.academicGroup}
            options={ACADEMIC_GROUP_OPTIONS}
            disabled={saving}
            labelSurfaceClassName={DIALOG_LABEL_SURFACE}
            onValueChange={(value) => setField('academicGroup', value)}
          />
          <OutlinedTextField
            label={t('fieldOfStudy')}
            value={values.fieldOfStudy}
            maxLength={50}
            disabled={saving}
            labelSurfaceClassName={DIALOG_LABEL_SURFACE}
            onValueChange={(value) => setField('fieldOfStudy', value)}
          />
          <OutlinedTextField
            label={t('university')}
            value={values.university}
            maxLength={50}
            disabled={saving}
            labelSurfaceClassName={DIALOG_LABEL_SURFACE}
            onValueChange={(value) => setField('university', value)}
          />
          <OutlinedTextField
            label={t('faculty')}
            value={values.faculty}
            maxLength={50}
            disabled={saving}
            labelSurfaceClassName={DIALOG_LABEL_SURFACE}
            onValueChange={(value) => setField('faculty', value)}
          />
          <OutlinedSelectField
            label={t('degreeLevel')}
            value={values.degreeLevel}
            options={DEGREE_LEVEL_OPTIONS}
            disabled={saving}
            labelSurfaceClassName={DIALOG_LABEL_SURFACE}
            onValueChange={(value) => setField('degreeLevel', value)}
          />
          <OutlinedSelectField
            label={t('studyStatus')}
            value={values.studyStatus}
            options={STUDY_STATUS_OPTIONS}
            disabled={saving}
            labelSurfaceClassName={DIALOG_LABEL_SURFACE}
            onValueChange={(value) => setField('studyStatus', value)}
          />
          <div className="min-[640px]:col-span-2">
            <OutlinedTextField
              label={t('description')}
              value={values.description}
              maxLength={250}
              disabled={saving}
              labelSurfaceClassName={DIALOG_LABEL_SURFACE}
              onValueChange={(value) => setField('description', value)}
            />
          </div>
          <OutlinedDateField
            label={t('graduationDate')}
            value={values.endDate}
            disabled={saving}
            labelSurfaceClassName={DIALOG_LABEL_SURFACE}
            onValueChange={(value) => setField('endDate', value)}
          />
        </div>

        {error ? (
          <p className="text-start text-sm font-medium text-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-start gap-6 pt-1">
          <Button
            type="button"
            disabled={saving}
            onClick={() => onSave(values)}
            className={cn(
              'h-12 min-w-[120px] !rounded-full bg-[#008d63] px-8 text-sm font-medium text-white shadow-none',
              'hover:bg-[#008d63]/90 disabled:opacity-60'
            )}
          >
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="size-4" />
                {t('saving')}
              </span>
            ) : (
              t('save')
            )}
          </Button>
          <button
            type="button"
            disabled={saving}
            onClick={() => onOpenChange(false)}
            className="text-sm font-medium text-[#008d63] hover:underline disabled:opacity-60 dark:text-primary-100"
          >
            {t('cancel')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
