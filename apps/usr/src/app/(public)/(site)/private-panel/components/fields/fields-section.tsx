'use client';

import { Check, Loader2, Pencil, Plus, Stamp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  getActorApiErrorMessage,
  mapPendingFieldRequests,
  mapVisibilityFields,
  sanitizeValuesForPrivateSubmit,
  tabsAffectedByValues,
  toPrivateTabSubmitBody,
  useManageVisibilityQuery,
  useReviewPrivateChangesByOwnerMutation,
  useSubmitPrivateTabByOwnerMutation,
  type PendingFieldRequest,
  type PrivateOwnerTabName,
} from '@private-panel/api';
import {
  VISIBILITY_CATEGORIES,
  VISIBILITY_SECTIONS,
  type VisibilityAcademicRecord,
  type VisibilityCategoryId,
  type VisibilityField,
} from '@private-panel/data/visibility-config';
import {
  firstCategoryWithErrors,
  validateVisibilityValues,
  type VisibilityValidationErrorKey,
} from '@private-panel/data/visibility-validation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { DocumentsPanel } from './documents-panel';
import { ViewField, resolveViewControl } from './view-field';

type FieldsSectionProps = {
  accessToken?: string | null;
};

type FieldsMode = 'view' | 'review';

function valuesFromFields(fields: VisibilityField[]): Record<string, string> {
  return Object.fromEntries(
    fields.map((field) => [field.id, field.imageSrc || field.value || ''])
  );
}

export function FieldsSection({ accessToken }: FieldsSectionProps) {
  const t = useTranslations('privatePanel.fields');
  const tVis = useTranslations('privatePanel.publicOps.manageVisibility');
  const visibilityQuery = useManageVisibilityQuery(accessToken);
  const submitPrivateMutation = useSubmitPrivateTabByOwnerMutation();
  const reviewMutation = useReviewPrivateChangesByOwnerMutation();

  const [mode, setMode] = useState<FieldsMode>('view');
  const [category, setCategory] =
    useState<VisibilityCategoryId>('identity');
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const [savedValues, setSavedValues] = useState<Record<string, string>>({});
  const [hydratedKey, setHydratedKey] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, VisibilityValidationErrorKey>
  >({});
  const [reviewDecisions, setReviewDecisions] = useState<
    Record<number, 'approve' | 'reject'>
  >({});

  const fields =
    visibilityQuery.data?.fields ?? mapVisibilityFields(null, null);
  const records = visibilityQuery.data?.records ?? [];
  const privateData = visibilityQuery.data?.privateData;
  const pendingRequests = useMemo(
    () => mapPendingFieldRequests(privateData),
    [privateData]
  );

  useEffect(() => {
    if (!visibilityQuery.data) return;
    if (hydratedKey === visibilityQuery.dataUpdatedAt) return;

    const hasLocalEdits =
      hydratedKey !== null &&
      Object.keys(draftValues).some(
        (id) => draftValues[id] !== savedValues[id]
      );
    if (hasLocalEdits) {
      setHydratedKey(visibilityQuery.dataUpdatedAt);
      return;
    }

    const nextValues = valuesFromFields(visibilityQuery.data.fields);
    setDraftValues(nextValues);
    setSavedValues(nextValues);
    setFieldErrors({});
    setFormError(null);
    setHydratedKey(visibilityQuery.dataUpdatedAt);
  }, [
    visibilityQuery.data,
    visibilityQuery.dataUpdatedAt,
    hydratedKey,
    draftValues,
    savedValues,
  ]);

  const onFieldChange = (id: string, value: string) => {
    setDraftValues((prev) => ({ ...prev, [id]: value }));
    setFieldErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (formError) setFormError(null);
  };

  const isDirty = useMemo(
    () =>
      Object.keys(draftValues).some(
        (id) => (draftValues[id] ?? '') !== (savedValues[id] ?? '')
      ),
    [draftValues, savedValues]
  );

  const categoryFields = useMemo(
    () => fields.filter((field) => field.category === category),
    [fields, category]
  );

  const sections = VISIBILITY_SECTIONS[category];
  const editable = mode === 'view';

  async function handleSave() {
    if (!accessToken || isSaving) return;

    const nextFieldErrors = validateVisibilityValues(draftValues, savedValues);
    setFieldErrors(nextFieldErrors);
    setFormError(null);
    if (Object.keys(nextFieldErrors).length > 0) {
      setFormError(t('formHasErrors'));
      const nextCategory = firstCategoryWithErrors(nextFieldErrors);
      if (nextCategory) setCategory(nextCategory as VisibilityCategoryId);
      return;
    }

    const hasLocalBlob = Object.values(draftValues).some((value) =>
      value.startsWith('blob:')
    );
    const submitValues = sanitizeValuesForPrivateSubmit(draftValues);
    const privateTabs = tabsAffectedByValues(submitValues, savedValues);

    if (privateTabs.length === 0) {
      setFormError(hasLocalBlob ? t('localImageOnly') : t('nothingToSave'));
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all(
        privateTabs.map((tabName: PrivateOwnerTabName) =>
          submitPrivateMutation.mutateAsync({
            accessToken,
            tabName,
            body: toPrivateTabSubmitBody(
              submitValues,
              tabName,
              privateData,
              savedValues
            ),
          })
        )
      );
      setSavedValues(submitValues);
      setDraftValues((prev) => ({ ...prev, ...submitValues }));
      setFormError(null);
    } catch (error) {
      setFormError(getActorApiErrorMessage(error, t('saveFailed')));
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setDraftValues(savedValues);
    setFieldErrors({});
    setFormError(null);
  }

  async function handleReviewSave() {
    if (!accessToken || isSaving) return;
    const confirmed = Object.entries(reviewDecisions)
      .filter(([, decision]) => decision === 'approve')
      .map(([id]) => ({ request_id: Number(id) }));
    const rejected = Object.entries(reviewDecisions)
      .filter(([, decision]) => decision === 'reject')
      .map(([id]) => ({ request_id: Number(id) }));

    if (confirmed.length === 0 && rejected.length === 0) {
      setFormError(t('nothingToSave'));
      return;
    }

    setIsSaving(true);
    setFormError(null);
    try {
      await reviewMutation.mutateAsync({
        accessToken,
        confirmedRequests: confirmed,
        rejectedRequests: rejected,
      });
      setReviewDecisions({});
    } catch (error) {
      setFormError(getActorApiErrorMessage(error, t('reviewFailed')));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div dir="rtl" className="flex w-full flex-col gap-6 text-start">
      <ModeTabs mode={mode} onModeChange={setMode} t={t} />

      <IntroBullets t={t} />

      <Tabs
        value={category}
        onValueChange={(value) => setCategory(value as VisibilityCategoryId)}
        dir="rtl"
        className="flex w-full flex-col"
      >
        <div
          className={cn(
            'overflow-hidden rounded-3xl border-2 border-[#bfc9c1]',
            'bg-transparent dark:border-auth-input-border'
          )}
        >
          <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsList
              className={cn(
                'flex h-14 w-max min-w-full items-stretch justify-start gap-0',
                'rounded-none border-b border-[#dbd8d1] bg-transparent p-0',
                'min-[720px]:h-16 dark:border-auth-input-border'
              )}
            >
              {VISIBILITY_CATEGORIES.map((id) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className={cn(
                    'h-full shrink-0 rounded-none border-0 border-b-2 border-transparent px-3',
                    'justify-center text-xs font-medium text-[#404943] shadow-none',
                    'hover:text-[#171d19] focus-visible:ring-primary/30',
                    'data-[state=active]:border-b-[#008d63] data-[state=active]:bg-[#f8f8f0]',
                    'data-[state=active]:font-bold data-[state=active]:text-[#171d19]',
                    'data-[state=active]:shadow-none',
                    'dark:text-home-filter-ink dark:data-[state=active]:bg-home-stat-card',
                    'dark:data-[state=active]:border-b-primary-100 dark:data-[state=active]:text-primary-100',
                    'min-[720px]:px-4 min-[720px]:text-sm'
                  )}
                >
                  <span className="whitespace-nowrap">
                    {tVis(`categories.${id}`)}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {VISIBILITY_CATEGORIES.map((id) => (
            <TabsContent key={id} value={id} className="mt-0">
              {id !== category ? null : (
                <div
                  className={cn(
                    'flex flex-col gap-8 px-4 py-6',
                    'min-[720px]:gap-12 min-[720px]:px-[42px] min-[720px]:py-12',
                    'min-[834px]:px-[68px]'
                  )}
                >
                  {mode === 'review' ? (
                    <ReviewPendingList
                      requests={pendingRequests}
                      decisions={reviewDecisions}
                      onDecisionChange={(requestId, decision) =>
                        setReviewDecisions((prev) => ({
                          ...prev,
                          [requestId]: decision,
                        }))
                      }
                      isSaving={isSaving}
                      formError={formError}
                      onSave={handleReviewSave}
                      t={t}
                      tVis={tVis}
                    />
                  ) : (
                    <>
                      {sections.map((section) => {
                        const sectionFields = categoryFields.filter(
                          (field) => field.section === section.key
                        );

                        if (section.key === 'identity') {
                          return (
                            <IdentityCategoryBlocks
                              key={section.key}
                              fields={sectionFields}
                              editable={editable}
                              values={draftValues}
                              fieldErrors={fieldErrors}
                              onChange={onFieldChange}
                              t={t}
                              tVis={tVis}
                            />
                          );
                        }

                        if (section.key === 'academicRecords') {
                          return (
                            <AcademicRecordsBlock
                              key={section.key}
                              records={records}
                              t={t}
                              tVis={tVis}
                            />
                          );
                        }

                        if (section.key === 'provider') {
                          return (
                            <ProviderBlocks
                              key={section.key}
                              fields={sectionFields}
                              editable={editable}
                              values={draftValues}
                              fieldErrors={fieldErrors}
                              onChange={onFieldChange}
                              t={t}
                              tVis={tVis}
                            />
                          );
                        }

                        if (sectionFields.length === 0) return null;

                        return (
                          <FieldsetBlock
                            key={section.key}
                            title={tVis(`sections.${section.titleKey}`)}
                          >
                            <FieldGrid
                              fields={sectionFields}
                              editable={editable}
                              values={draftValues}
                              fieldErrors={fieldErrors}
                              onChange={onFieldChange}
                              tVis={tVis}
                            />
                          </FieldsetBlock>
                        );
                      })}

                      {formError ? (
                        <p role="alert" className="text-sm font-medium text-error">
                          {formError}
                        </p>
                      ) : null}

                      <div className="flex flex-wrap items-center justify-start gap-3">
                        <Button
                          type="button"
                          disabled={!accessToken || isSaving || !isDirty}
                          onClick={() => void handleSave()}
                          className={cn(
                            'h-12 w-full max-w-[220px] gap-2 !rounded-2xl bg-[#008d63]',
                            'px-4 text-base font-medium text-white shadow-none',
                            'hover:bg-[#008d63]/90 disabled:opacity-60'
                          )}
                        >
                          {isSaving ? (
                            <Loader2
                              className="size-5 animate-spin"
                              aria-hidden
                            />
                          ) : (
                            <Pencil
                              className="size-6"
                              strokeWidth={1.75}
                              aria-hidden
                            />
                          )}
                          {isSaving ? t('saving') : t('save')}
                        </Button>
                        {isDirty ? (
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isSaving}
                            onClick={handleCancel}
                            className="h-12 max-w-[160px] !rounded-2xl border-[#008d63] px-4 text-base font-medium text-[#008d63] shadow-none"
                          >
                            {t('cancel')}
                          </Button>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>

      <LimitationsSection t={t} />
    </div>
  );
}

function ReviewPendingList({
  requests,
  decisions,
  onDecisionChange,
  isSaving,
  formError,
  onSave,
  t,
  tVis,
}: {
  requests: PendingFieldRequest[];
  decisions: Record<number, 'approve' | 'reject'>;
  onDecisionChange: (
    requestId: number,
    decision: 'approve' | 'reject'
  ) => void;
  isSaving: boolean;
  formError: string | null;
  onSave: () => void;
  t: ReturnType<typeof useTranslations>;
  tVis: ReturnType<typeof useTranslations>;
}) {
  if (requests.length === 0) {
    return (
      <p className="text-sm font-medium leading-6 text-[#404943] dark:text-home-filter-muted">
        {t('reviewEmpty')}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-4">
        {requests.map((request) => (
          <li
            key={request.requestId}
            className="rounded-2xl border border-warning/60 bg-[#f8f8f0] p-4 dark:bg-home-stat-card"
          >
            <p className="mb-2 text-sm font-bold text-[#171d19] dark:text-home-filter-ink">
              {request.labelKey
                ? tVis(`fields.${request.labelKey}`)
                : request.apiField}
            </p>
            <div className="mb-3 flex flex-col gap-1 text-xs text-[#404943] dark:text-home-filter-muted">
              <p>
                {t('previousValue')}: {request.previousValue || t('emptyValue')}
              </p>
              <p>
                {t('newValue')}: {request.newValue || t('emptyValue')}
              </p>
            </div>
            <div className="flex items-center justify-start gap-5">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <span
                  className={cn(
                    decisions[request.requestId] === 'approve'
                      ? 'text-[#008d63]'
                      : 'text-[#404943]'
                  )}
                >
                  {t('documents.approve')}
                </span>
                <input
                  type="radio"
                  name={`review-${request.requestId}`}
                  checked={decisions[request.requestId] === 'approve'}
                  onChange={() =>
                    onDecisionChange(request.requestId, 'approve')
                  }
                />
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <span
                  className={cn(
                    decisions[request.requestId] === 'reject'
                      ? 'text-[#ba1a1a]'
                      : 'text-[#404943]'
                  )}
                >
                  {t('documents.reject')}
                </span>
                <input
                  type="radio"
                  name={`review-${request.requestId}`}
                  checked={decisions[request.requestId] === 'reject'}
                  onChange={() =>
                    onDecisionChange(request.requestId, 'reject')
                  }
                />
              </label>
            </div>
          </li>
        ))}
      </ul>

      {formError ? (
        <p role="alert" className="text-sm font-medium text-error">
          {formError}
        </p>
      ) : null}

      <Button
        type="button"
        disabled={isSaving}
        onClick={onSave}
        className="h-12 w-full max-w-[220px] gap-2 !rounded-2xl bg-[#008d63] text-white shadow-none hover:bg-[#008d63]/90"
      >
        {isSaving ? (
          <Loader2 className="size-5 animate-spin" aria-hidden />
        ) : (
          <Stamp className="size-5" strokeWidth={1.75} aria-hidden />
        )}
        {t('reviewSave')}
      </Button>
    </div>
  );
}

function ModeTabs({
  mode,
  onModeChange,
  t,
}: {
  mode: FieldsMode;
  onModeChange: (mode: FieldsMode) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const triggerClass = cn(
    'h-full flex-1 items-center justify-center gap-2 rounded-none border-0 border-b-2 border-transparent',
    'text-sm font-medium text-[#404943] shadow-none',
    'data-[state=active]:border-b-[#008d63] data-[state=active]:bg-transparent',
    'data-[state=active]:font-bold data-[state=active]:text-[#171d19]',
    'data-[state=active]:shadow-none dark:text-home-filter-ink',
    'dark:data-[state=active]:border-b-primary-100 dark:data-[state=active]:text-primary-100'
  );

  return (
    <Tabs
      value={mode}
      onValueChange={(value) => onModeChange(value as FieldsMode)}
      dir="rtl"
      className="w-full max-w-[360px] self-start"
    >
      <TabsList
        className={cn(
          'flex h-12 w-full items-stretch justify-center gap-0',
          'rounded-none border-b border-[#dbd8d1] bg-transparent p-0',
          'dark:border-auth-input-border'
        )}
      >
        <TabsTrigger value="view" className={triggerClass}>
          <Pencil className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="whitespace-nowrap text-center">{t('modes.view')}</span>
        </TabsTrigger>
        <TabsTrigger value="review" className={triggerClass}>
          <Stamp className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="whitespace-nowrap text-center">
            {t('modes.review')}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function IntroBullets({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <ul className="flex w-full flex-col gap-4">
      {[0, 1, 2].map((index) => (
        <li key={index} className="flex w-full items-start gap-2.5">
          <span
            aria-hidden
            className="mt-2 size-1.5 shrink-0 rounded-full bg-[#008d63]"
          />
          <p className="min-w-0 flex-1 text-justify text-sm font-medium leading-6 text-[#171d19] dark:text-home-filter-ink">
            {index === 1 ? (
              <>
                {t('intro.requiredBefore')}
                <span className="px-0.5 font-bold text-warning">*</span>
                {t('intro.requiredAfter')}
              </>
            ) : (
              t(`intro.p${index + 1}` as 'intro.p1' | 'intro.p3')
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}

function fieldErrorMessage(
  fieldErrors: Record<string, VisibilityValidationErrorKey>,
  fieldId: string,
  tVis: ReturnType<typeof useTranslations>
): string | null {
  const key = fieldErrors[fieldId];
  if (!key) return null;
  return tVis(`validation.${key}`);
}

function IdentityCategoryBlocks({
  fields,
  editable,
  values,
  fieldErrors,
  onChange,
  t,
  tVis,
}: {
  fields: VisibilityField[];
  editable: boolean;
  values: Record<string, string>;
  fieldErrors: Record<string, VisibilityValidationErrorKey>;
  onChange: (id: string, value: string) => void;
  t: ReturnType<typeof useTranslations>;
  tVis: ReturnType<typeof useTranslations>;
}) {
  const photos = fields.filter((f) => resolveViewControl(f) === 'photo');
  const rest = fields.filter((f) => resolveViewControl(f) !== 'photo');
  const textFields = rest.filter((f) => f.kind !== 'textarea');
  const textareas = rest.filter((f) => f.kind === 'textarea');

  const openSharedPhotoPicker = () => {
    const first = photos[0];
    if (!first) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      for (const photo of photos) onChange(photo.id, url);
    };
    input.click();
  };

  return (
    <>
      <FieldsetBlock title={t('photosTitle')}>
        <p className="text-justify text-sm font-medium leading-6 text-[#404943] dark:text-home-filter-muted">
          {t('photosHintBefore')}
          <button
            type="button"
            className="text-warning underline-offset-2 hover:underline"
            onClick={openSharedPhotoPicker}
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
                editable={editable}
                value={src}
                error={fieldErrorMessage(fieldErrors, field.id, tVis)}
                onChange={onChange}
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
              editable={editable}
              value={values[field.id] ?? field.value}
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
                editable={editable}
                value={values[field.id] ?? field.value}
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

function ProviderBlocks({
  fields,
  editable,
  values,
  fieldErrors,
  onChange,
  t,
  tVis,
}: {
  fields: VisibilityField[];
  editable: boolean;
  values: Record<string, string>;
  fieldErrors: Record<string, VisibilityValidationErrorKey>;
  onChange: (id: string, value: string) => void;
  t: ReturnType<typeof useTranslations>;
  tVis: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="flex flex-col gap-8 min-[720px]:gap-12">
      <FieldsetBlock title={tVis('sections.provider')}>
        <FieldGrid
          fields={fields}
          editable={editable}
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
          />
        </div>
      </FieldsetBlock>
    </div>
  );
}

function AcademicRecordsBlock({
  records,
  reviewMode = false,
  t,
  tVis,
}: {
  records: VisibilityAcademicRecord[];
  reviewMode?: boolean;
  t: ReturnType<typeof useTranslations>;
  tVis: ReturnType<typeof useTranslations>;
}) {
  const showDocumentUpload = records.length === 0;

  return (
    <FieldsetBlock title={tVis('sections.academicRecords')}>
      <p className="text-justify text-sm font-medium leading-6 text-[#404943] dark:text-home-filter-muted">
        {t('academicIntro')}
      </p>
      <div className="flex justify-start">
        <Button
          type="button"
          className={cn(
            'h-12 gap-2 !rounded-xl bg-[#008d63] px-4 text-sm font-medium text-white shadow-none',
            'hover:bg-[#008d63]/90'
          )}
        >
          <Plus className="size-5" strokeWidth={2} aria-hidden />
          {t('addRecord')}
        </Button>
      </div>

      {records.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {records.map((record) => (
            <li key={record.id}>
              <AcademicRecordCard record={record} tVis={tVis} />
            </li>
          ))}
        </ul>
      ) : null}

      {showDocumentUpload ? (
        <div
          className={cn(
            'relative mt-2 flex flex-col gap-6 rounded-3xl border border-[#dbd8d1]',
            'bg-[#f8f8f0] px-4 pb-6 pt-8',
            'min-[720px]:px-8 min-[720px]:pb-8',
            'dark:border-auth-input-border dark:bg-home-stat-card'
          )}
        >
          <h4 className="absolute -top-3 start-4 bg-[#f8f8f0] px-1 text-base font-bold text-[#404943] dark:bg-home-stat-card dark:text-primary-100 min-[720px]:start-8">
            {t('academicDocumentsTitle')}
          </h4>

          <ul className="flex flex-col gap-4">
            <BulletText tone="muted">{t('academicDocumentsHint')}</BulletText>
            <BulletText>
              {t('academicSampleBefore')}
              <button
                type="button"
                className="text-warning underline-offset-2 hover:underline"
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
          />
        </div>
      ) : null}
    </FieldsetBlock>
  );
}

function AcademicRecordCard({
  record,
  tVis,
}: {
  record: VisibilityAcademicRecord;
  tVis: ReturnType<typeof useTranslations>;
}) {
  const verified = record.statusLabel === 'تایید شده';

  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-[#dbd8d1] bg-transparent p-4',
        'min-[720px]:gap-3.5 min-[720px]:p-5',
        'dark:border-auth-input-border'
      )}
    >
      <div className="flex flex-wrap items-center justify-start gap-2">
        <h4 className="text-sm font-bold text-[#171d19] dark:text-home-filter-ink min-[720px]:text-base">
          {record.degree || '\u00a0'}
        </h4>
        {record.roleLabel ? (
          <Badge
            variant="outline"
            className="h-7 rounded-full border-[#008d63] px-2.5 text-xs font-medium text-[#008d63] dark:border-primary-100 dark:text-primary-100"
          >
            {record.roleLabel}
          </Badge>
        ) : null}
        <Badge
          variant="secondary"
          className={cn(
            'h-7 gap-1 rounded-full border-0 px-2.5 text-xs font-medium',
            verified
              ? 'bg-primary-subtle text-primary-700 dark:bg-primary/20 dark:text-primary-100'
              : 'bg-[#ffdbcf] text-[#72351f]'
          )}
        >
          {verified ? (
            <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
          ) : null}
          {record.statusLabel}
        </Badge>
      </div>

      <div className="flex flex-col gap-2 text-start text-sm leading-6 text-[#404943] min-[720px]:flex-row min-[720px]:justify-between min-[720px]:gap-8 dark:text-home-filter-muted">
        <div className="flex min-w-0 flex-col gap-1">
          {[record.university, record.faculty].filter(Boolean).length > 0 ? (
            <p>
              {[record.university, record.faculty].filter(Boolean).join('، ')}
            </p>
          ) : null}
          {record.fieldGroup ? (
            <p>
              {tVis('fields.recordFieldGroup')}: {record.fieldGroup}
            </p>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col gap-1 min-[720px]:max-w-[320px]">
          {record.description ? <p>{record.description}</p> : null}
          {record.endDate ? (
            <p>
              {tVis('fields.recordGraduationDate')}: {record.endDate}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function FieldGrid({
  fields,
  editable,
  values,
  fieldErrors,
  onChange,
  tVis,
}: {
  fields: VisibilityField[];
  editable: boolean;
  values: Record<string, string>;
  fieldErrors: Record<string, VisibilityValidationErrorKey>;
  onChange: (id: string, value: string) => void;
  tVis: ReturnType<typeof useTranslations>;
}) {
  const textareas = fields.filter((f) => f.kind === 'textarea');
  const rest = fields.filter((f) => f.kind !== 'textarea' && f.kind !== 'toggle');

  return (
    <div className="flex flex-col gap-8">
      {rest.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 min-[720px]:grid-cols-2 min-[720px]:gap-x-[100px] min-[834px]:gap-x-[158px]">
          {rest.map((field) => (
            <ViewField
              key={field.id}
              field={field}
              label={tVis(`fields.${field.labelKey}`)}
              editable={editable}
              value={values[field.id] ?? field.value}
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
          editable={editable}
          value={values[field.id] ?? field.value}
          error={fieldErrorMessage(fieldErrors, field.id, tVis)}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

function FieldsetBlock({
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
        'dark:border-auth-input-border dark:bg-home-stat-card'
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
            : 'text-[#171d19] dark:text-home-filter-ink'
        )}
      >
        {children}
      </p>
    </li>
  );
}

function LimitationsSection({
  t,
}: {
  t: ReturnType<typeof useTranslations>;
}) {
  const items = [1, 2] as const;

  return (
    <div className="flex flex-col gap-6">
      {items.map((n) => (
        <div
          key={n}
          className={cn(
            'relative rounded-3xl border border-[#dbd8d1] bg-[#f8f8f0] px-4 pb-6 pt-8',
            'min-[720px]:px-8 min-[720px]:pb-8',
            'dark:border-auth-input-border dark:bg-home-stat-card'
          )}
        >
          <h3 className="absolute -top-3 start-4 bg-[#f8f8f0] px-1 text-base font-semibold text-[#ba1a1a] dark:bg-home-stat-card">
            {t('limitations.title', { n })}
          </h3>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 min-[720px]:grid-cols-3">
              <ReadOnlyChip
                label={t('limitations.reasonLabel')}
                value={t('limitations.reasonValue')}
                wide
              />
              <ReadOnlyChip
                label={t('limitations.scopeLabel')}
                value={t('limitations.scopeValue')}
              />
              <ReadOnlyChip
                label={t('limitations.rangeLabel')}
                value={t('limitations.rangeValue')}
              />
            </div>
            <div className="flex justify-start">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'h-12 w-full max-w-[176px] !rounded-xl border border-[#e06333]',
                  'bg-transparent px-4 text-sm font-medium text-[#e06333] shadow-none',
                  'hover:bg-[#ffdbcf]/40 hover:text-[#e06333]'
                )}
              >
                {t('limitations.requestLift')}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReadOnlyChip({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative rounded border border-[#dbd8d1] bg-transparent px-3 pb-2 pt-3',
        'dark:border-auth-input-border',
        wide && 'min-[720px]:col-span-1'
      )}
    >
      <span className="absolute -top-2 start-2 bg-[#f8f8f0] px-1 text-xs font-bold text-[#404943] dark:bg-home-stat-card dark:text-home-filter-muted">
        {label}
      </span>
      <p className="text-start text-sm font-medium text-[#404943] dark:text-home-filter-ink">
        {value}
      </p>
    </div>
  );
}
