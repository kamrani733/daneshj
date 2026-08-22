import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, type ReactNode } from 'react';

import {
  getActorApiErrorMessage,
  toAcademicRecordUserDto,
  toPanelAcademicRecord,
} from '@private-panel/api';
import {
  type VisibilityAcademicRecord,
  type VisibilityField,
} from '@private-panel/data/visibility-config';
import type { VisibilityValidationErrorKey } from '@private-panel/utils/visibility-validation';
import { AcademicRecordCard } from '@/components/panel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  AcademicRecordModal,
  type AcademicRecordFormValues,
} from './academic-record-modal';
import { DocumentsPanel } from './documents-panel';
import type { DocumentDraft } from '@private-panel/types/documents';
import { resolveViewControl, ViewField } from './view-field';

function fieldErrorMessage(
  fieldErrors: Record<string, VisibilityValidationErrorKey>,
  fieldId: string,
  tVis: ReturnType<typeof useTranslations>,
): string | null {
  const key = fieldErrors[fieldId];
  if (!key) return null;
  return tVis(`validation.${key}`);
}

export function IdentityCategoryBlocks({
  fields,
  editable,
  showPending,
  values,
  fieldErrors,
  onChange,
  onPhotoPick,
  t,
  tVis,
}: {
  fields: VisibilityField[];
  editable: boolean;
  showPending: boolean;
  values: Record<string, string>;
  fieldErrors: Record<string, VisibilityValidationErrorKey>;
  onChange: (id: string, value: string) => void;
  onPhotoPick: (id: string, previewUrl: string, file: File) => void;
  t: ReturnType<typeof useTranslations>;
  tVis: ReturnType<typeof useTranslations>;
}) {
  const photos = fields.filter((f) => resolveViewControl(f) === 'photo');
  const rest = fields.filter((f) => resolveViewControl(f) !== 'photo');
  const textFields = rest.filter((f) => f.kind !== 'textarea');
  const textareas = rest.filter((f) => f.kind === 'textarea');

  return (
    <>
      <FieldsetBlock title={t('photosTitle')}>
        <p className="text-justify text-sm font-medium leading-6 text-[#404943] dark:text-home-filter-muted">
          {t('photosHintBefore')}
          <button
            type="button"
            className="text-warning underline-offset-2 hover:underline"
          >
            {t('photosHintLink')}
          </button>
        </p>
        <div className="grid grid-cols-1 gap-8 min-[720px]:grid-cols-2 min-[720px]:gap-x-[100px] min-[834px]:gap-x-[158px]">
          {photos.map((field) => {
            const src = values[field.id] || field.imageSrc || field.value;
            return (
              <ViewField
                key={field.id}
                field={{ ...field, imageSrc: src, value: src }}
                label={tVis(`fields.${field.labelKey}`)}
                editable={editable && !field.locked}
                showPending={showPending}
                value={src}
                error={fieldErrorMessage(fieldErrors, field.id, tVis)}
                onChange={onChange}
                onPhotoPick={onPhotoPick}
              />
            );
          })}
        </div>
      </FieldsetBlock>

      <FieldsetBlock title={tVis('sections.identity')}>
        <div className="grid grid-cols-1 gap-8 min-[720px]:grid-cols-2 min-[720px]:gap-x-[100px] min-[834px]:gap-x-[158px]">
          {textFields.map((field) => (
            <ViewField
              key={field.id}
              field={field}
              label={tVis(`fields.${field.labelKey}`)}
              editable={editable && !field.locked}
              showPending={showPending}
              value={values[field.id] ?? field.value}
              values={values}
              error={fieldErrorMessage(fieldErrors, field.id, tVis)}
              onChange={onChange}
            />
          ))}
        </div>
        {textareas.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-8">
            {textareas.map((field) => (
              <ViewField
                key={field.id}
                field={field}
                label={tVis(`fields.${field.labelKey}`)}
                editable={editable && !field.locked}
                showPending={showPending}
                value={values[field.id] ?? field.value}
                values={values}
                error={fieldErrorMessage(fieldErrors, field.id, tVis)}
                onChange={onChange}
              />
            ))}
          </div>
        ) : null}
      </FieldsetBlock>
    </>
  );
}

export function ProviderBlocks({
  fields,
  editable,
  showPending,
  values,
  fieldErrors,
  onChange,
  documents,
  onDocumentsChange,
  onUploadFile,
  t,
  tVis,
}: {
  fields: VisibilityField[];
  editable: boolean;
  showPending: boolean;
  values: Record<string, string>;
  fieldErrors: Record<string, VisibilityValidationErrorKey>;
  onChange: (id: string, value: string) => void;
  documents: DocumentDraft[];
  onDocumentsChange: (documents: DocumentDraft[]) => void;
  onUploadFile?: (file: File) => Promise<string>;
  t: ReturnType<typeof useTranslations>;
  tVis: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="flex flex-col gap-8 min-[720px]:gap-12">
      <FieldsetBlock title={tVis('sections.provider')}>
        <FieldGrid
          fields={fields}
          editable={editable}
          showPending={showPending}
          values={values}
          fieldErrors={fieldErrors}
          onChange={onChange}
          tVis={tVis}
        />
      </FieldsetBlock>
      <FieldsetBlock title={t('documentsTitle')}>
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-4">
            <BulletText>{t('providerDocumentsHint')}</BulletText>
          </ul>
          <DocumentsPanel
            dropLabel={t('dropHere')}
            dropOrLabel={t('dropOr')}
            uploadLabel={t('uploadFile')}
            documents={documents}
            onDocumentsChange={onDocumentsChange}
            onUploadFile={onUploadFile}
          />
        </div>
      </FieldsetBlock>
    </div>
  );
}

export function AcademicRecordsBlock({
  records,
  documents,
  onDocumentsChange,
  onUploadFile,
  editable = false,
  onSubmitRecord,
  reviewMode = false,
  t,
  tVis,
}: {
  records: VisibilityAcademicRecord[];
  documents: DocumentDraft[];
  onDocumentsChange: (documents: DocumentDraft[]) => void;
  onUploadFile?: (file: File) => Promise<string>;
  editable?: boolean;
  onSubmitRecord: (
    records: ReturnType<typeof toAcademicRecordUserDto>[],
  ) => Promise<void>;
  reviewMode?: boolean;
  t: ReturnType<typeof useTranslations>;
  tVis: ReturnType<typeof useTranslations>;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<VisibilityAcademicRecord | null>(null);
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [recordsHidden, setRecordsHidden] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingRecord(null);
    setModalError(null);
    setModalOpen(true);
  };

  const openEdit = (record: VisibilityAcademicRecord) => {
    if (record.source !== 'submitted') return;
    setEditingRecord(record);
    setModalError(null);
    setModalOpen(true);
  };

  const handleDeleteRecord = async (record: VisibilityAcademicRecord) => {
    if (record.source !== 'submitted' || deletingId) return;
    setDeletingId(record.id);
    try {
      const nextSubmitted = records
        .filter((item) => item.source === 'submitted' && item.id !== record.id)
        .map((item) => toAcademicRecordUserDto(item));
      await onSubmitRecord(nextSubmitted);
    } catch (error) {
      setModalError(
        getActorApiErrorMessage(error, t('academicRecordDeleteFailed')),
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSave = async (values: AcademicRecordFormValues) => {
    setModalSaving(true);
    setModalError(null);
    try {
      const draft: VisibilityAcademicRecord = {
        id: editingRecord?.id ?? 'new',
        apiId: editingRecord?.apiId ?? null,
        source: 'submitted',
        academicGroup: values.academicGroup,
        fieldOfStudy: values.fieldOfStudy,
        university: values.university,
        faculty: values.faculty,
        degreeLevel: values.degreeLevel,
        studyStatus: values.studyStatus,
        degree: [values.degreeLevel, values.fieldOfStudy]
          .filter(Boolean)
          .join(' '),
        fieldGroup: values.academicGroup,
        description: values.description,
        endDate: values.endDate,
        roleLabel: '',
        statusLabel: 'اظهاری',
        initiallyVisible: false,
      };

      const submitted = records.filter(
        (record) => record.source === 'submitted',
      );
      const nextSubmitted = editingRecord
        ? submitted.map((record) =>
            record.id === editingRecord.id ? draft : record,
          )
        : [...submitted, draft];

      await onSubmitRecord(
        nextSubmitted.map((record) => toAcademicRecordUserDto(record)),
      );
      setModalOpen(false);
      setEditingRecord(null);
    } catch (error) {
      setModalError(
        getActorApiErrorMessage(error, t('academicRecordSaveFailed')),
      );
    } finally {
      setModalSaving(false);
    }
  };

  return (
    <FieldsetBlock title={tVis('sections.academicRecords')}>
      <p className="text-justify text-sm font-medium leading-6 text-[#404943] dark:text-home-filter-muted">
        {t('academicIntro')}
      </p>

      {records.length > 0 ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setRecordsHidden((prev) => !prev)}
            className={cn(
              'h-11 !rounded-xl border border-[#e06333] bg-transparent px-4',
              'text-sm font-medium text-[#e06333] shadow-none',
              'hover:bg-[#ffdbcf]/40 hover:text-[#e06333]',
              recordsHidden && 'bg-[#ffdbcf]/50',
            )}
          >
            {recordsHidden
              ? t('showAcademicRecords')
              : t('hideAcademicRecords')}
          </Button>
        </div>
      ) : null}

      {modalError && !modalOpen ? (
        <p role="alert" className="text-start text-sm font-medium text-error">
          {modalError}
        </p>
      ) : null}

      <div
        className={cn(
          'flex flex-col gap-4',
          records.length > 0 &&
            recordsHidden &&
            'pointer-events-none opacity-40',
        )}
      >
        {records.length > 0 ? (
          <ul
            className={cn(
              'overflow-hidden rounded-2xl border border-[#dbd8d1] bg-home-card',
              'dark:border-auth-input-border dark:bg-home-search-category',
            )}
          >
            {records.map((record, index) => (
              <li
                key={record.id}
                className={cn(
                  index > 0 &&
                    'border-t border-[#dbd8d1] dark:border-auth-input-border',
                )}
              >
                <AcademicRecordCard
                  record={toPanelAcademicRecord(record)}
                  className="bg-transparent p-4 min-[720px]:p-5"
                  actions={
                    editable && record.source === 'submitted' ? (
                      <>
                        <RecordIconButton
                          label={t('editRecord')}
                          disabled={deletingId === record.id}
                          hoverClassName="hover:border-[#e06333] hover:text-[#e06333]"
                          onClick={() => openEdit(record)}
                        >
                          <Pencil
                            className="size-4"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        </RecordIconButton>
                        <RecordIconButton
                          label={t('deleteRecord')}
                          disabled={deletingId === record.id}
                          hoverClassName="hover:border-[#ba1a1a] hover:text-[#ba1a1a]"
                          onClick={() => {
                            void handleDeleteRecord(record);
                          }}
                        >
                          {deletingId === record.id ? (
                            <Loader2
                              className="size-4 animate-spin"
                              aria-hidden
                            />
                          ) : (
                            <Trash2
                              className="size-4"
                              strokeWidth={1.75}
                              aria-hidden
                            />
                          )}
                        </RecordIconButton>
                      </>
                    ) : undefined
                  }
                />
              </li>
            ))}
          </ul>
        ) : null}

        {editable ? (
          <div className="flex justify-end">
            <Button type="button" onClick={openCreate}>
              <Plus className="size-5" strokeWidth={2} aria-hidden />
              {t('addRecord')}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-5">
        <h4 className="text-start text-base font-bold text-[#404943] dark:text-primary-100">
          {t('academicDocumentsTitle')}
        </h4>

        <ul className="flex flex-col gap-3">
          <BulletText tone="muted">{t('academicDocumentsHint')}</BulletText>
          <BulletText>
            {t('academicSampleBefore')}
            <button
              type="button"
              className="text-[#00639a] underline-offset-2 hover:underline dark:text-primary-100"
            >
              {t('academicSampleLink')}
            </button>
            {t('academicSampleAfter')}
          </BulletText>
          <BulletText tone="muted">{t('academicDocumentsPrivate')}</BulletText>
        </ul>

        <DocumentsPanel
          dropLabel={t('dropHere')}
          dropOrLabel={t('dropOr')}
          uploadLabel={t('uploadFile')}
          reviewMode={reviewMode}
          wide
          showDropzone={editable || reviewMode}
          documents={documents}
          onDocumentsChange={onDocumentsChange}
          onUploadFile={editable || reviewMode ? onUploadFile : undefined}
        />
      </div>

      <AcademicRecordModal
        open={modalOpen}
        record={editingRecord}
        saving={modalSaving}
        error={modalError}
        onOpenChange={(open) => {
          if (modalSaving) return;
          setModalOpen(open);
          if (!open) {
            setEditingRecord(null);
            setModalError(null);
          }
        }}
        onSave={(values) => {
          void handleModalSave(values);
        }}
      />
    </FieldsetBlock>
  );
}

function RecordIconButton({
  label,
  disabled,
  hoverClassName,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  hoverClassName: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-lg border',
        'border-[#c4c7c0] bg-transparent text-[#404943]',
        hoverClassName,
        'disabled:opacity-50 dark:border-auth-input-border dark:text-home-filter-muted',
      )}
    >
      {children}
    </button>
  );
}

export function FieldGrid({
  fields,
  editable,
  showPending,
  values,
  fieldErrors,
  onChange,
  tVis,
}: {
  fields: VisibilityField[];
  editable: boolean;
  showPending: boolean;
  values: Record<string, string>;
  fieldErrors: Record<string, VisibilityValidationErrorKey>;
  onChange: (id: string, value: string) => void;
  tVis: ReturnType<typeof useTranslations>;
}) {
  const textareas = fields.filter((f) => f.kind === 'textarea');
  const rest = fields.filter(
    (f) => f.kind !== 'textarea' && f.kind !== 'toggle',
  );

  return (
    <div className="flex flex-col gap-8">
      {rest.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 min-[720px]:grid-cols-2 min-[720px]:gap-x-[100px] min-[834px]:gap-x-[158px]">
          {rest.map((field) => (
            <ViewField
              key={field.id}
              field={field}
              label={tVis(`fields.${field.labelKey}`)}
              editable={editable && !field.locked}
              showPending={showPending}
              value={values[field.id] ?? field.value}
              values={values}
              error={fieldErrorMessage(fieldErrors, field.id, tVis)}
              onChange={onChange}
            />
          ))}
        </div>
      ) : null}
      {textareas.map((field) => (
        <ViewField
          key={field.id}
          field={field}
          label={tVis(`fields.${field.labelKey}`)}
          editable={editable && !field.locked}
          showPending={showPending}
          value={values[field.id] ?? field.value}
          values={values}
          error={fieldErrorMessage(fieldErrors, field.id, tVis)}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

export function FieldsetBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset
      className={cn(
        'relative flex w-full flex-col gap-8 rounded-3xl border border-[#dbd8d1]',
        'bg-[#f8f8f0] px-4 pb-8 pt-10',
        'min-[720px]:gap-12 min-[720px]:px-10 min-[720px]:pb-12 min-[720px]:pt-12',
        'min-[834px]:px-[88px]',
        'dark:border-auth-input-border dark:bg-home-stat-card',
      )}
    >
      <legend className="absolute -top-3 start-4 max-w-[calc(100%-2rem)] bg-[#f8f8f0] px-1 text-sm font-bold text-[#404943] min-[720px]:start-8 min-[720px]:text-base dark:bg-home-stat-card dark:text-primary-100">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function BulletText({
  children,
  tone = 'body',
}: {
  children: ReactNode;
  tone?: 'body' | 'muted';
}) {
  return (
    <li className="flex w-full items-start gap-2.5">
      <span
        aria-hidden
        className="mt-2 size-1.5 shrink-0 rounded-full bg-[#008d63]"
      />
      <p
        className={cn(
          'min-w-0 flex-1 text-justify text-sm font-medium leading-6',
          tone === 'muted'
            ? 'text-[#404943] dark:text-home-filter-muted'
            : 'text-[#171d19] dark:text-home-filter-ink',
        )}
      >
        {children}
      </p>
    </li>
  );
}
