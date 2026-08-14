'use client';

import { Loader2, Pencil, Plus, Stamp, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  getActorApiErrorMessage,
  isPrivateFileUploadConfigured,
  mapPendingFieldRequests,
  mapVisibilityFields,
  sanitizeValuesForPrivateSubmit,
  tabsAffectedByValues,
  toAcademicRecordUserDto,
  toPanelAcademicRecord,
  toPrivateTabSubmitBody,
  uploadPrivatePanelFile,
  useActorInfoQuery,
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
import { AcademicRecordCard, PanelLoadingOverlay } from '@/components/panel';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import {
  AcademicRecordModal,
  type AcademicRecordFormValues,
} from './academic-record-modal';
import {
  DocumentsPanel,
  type DocumentDraft,
} from './documents-panel';
import { FieldsFloatingSaveBar } from './fields-floating-save-bar';
import { resolveViewControl, ViewField } from './view-field';

function readyDocuments(docs: DocumentDraft[]): DocumentDraft[] {
  return docs.filter(
    (doc) =>
      (doc.state === 'done' || doc.state === 'review') && Boolean(doc.filePath)
  );
}

function documentsSignature(docs: DocumentDraft[]): string {
  return readyDocuments(docs)
    .map((doc) => `${doc.id}:${doc.filePath}`)
    .sort()
    .join('|');
}

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
  const [academicDocuments, setAcademicDocuments] = useState<DocumentDraft[]>(
    []
  );
  const [savedAcademicDocuments, setSavedAcademicDocuments] = useState<
    DocumentDraft[]
  >([]);
  const [providerDocuments, setProviderDocuments] = useState<DocumentDraft[]>(
    []
  );
  const [savedProviderDocuments, setSavedProviderDocuments] = useState<
    DocumentDraft[]
  >([]);
  const [pendingPhotoFiles, setPendingPhotoFiles] = useState<
    Record<string, File>
  >({});

  const fields =
    visibilityQuery.data?.fields ?? mapVisibilityFields(null, null);
  const records = visibilityQuery.data?.records ?? [];
  const privateData = visibilityQuery.data?.privateData;
  const pendingRequests = useMemo(
    () => mapPendingFieldRequests(privateData),
    [privateData]
  );

  const applyServerFields = (
    nextFields: VisibilityField[],
    dataUpdatedAt: number
  ) => {
    const nextValues = valuesFromFields(nextFields);
    setDraftValues(nextValues);
    setSavedValues(nextValues);
    setPendingPhotoFiles({});
    setFieldErrors({});
    setFormError(null);
    setHydratedKey(dataUpdatedAt);
  };

  const refreshFieldsFromServer = async () => {
    const refreshed = await visibilityQuery.refetch();
    if (refreshed.data) {
      applyServerFields(refreshed.data.fields, refreshed.dataUpdatedAt);
    }
    return refreshed;
  };

  const uploadDocumentFile = async (file: File) => {
    if (!accessToken || !isPrivateFileUploadConfigured()) {
      throw new Error('FILE_UPLOAD_UNAVAILABLE');
    }
    return uploadPrivatePanelFile({ accessToken, file });
  };

  useEffect(() => {
    if (!visibilityQuery.data) return;
    if (hydratedKey === visibilityQuery.dataUpdatedAt) return;

    const hasLocalEdits =
      hydratedKey !== null &&
      (Object.keys(draftValues).some(
        (id) => draftValues[id] !== savedValues[id]
      ) ||
        Object.keys(pendingPhotoFiles).length > 0 ||
        documentsSignature(academicDocuments) !==
          documentsSignature(savedAcademicDocuments) ||
        documentsSignature(providerDocuments) !==
          documentsSignature(savedProviderDocuments));
    if (hasLocalEdits) {
      setHydratedKey(visibilityQuery.dataUpdatedAt);
      return;
    }

    const nextValues = valuesFromFields(visibilityQuery.data.fields);
    setDraftValues(nextValues);
    setSavedValues(nextValues);
    setPendingPhotoFiles({});
    setFieldErrors({});
    setFormError(null);
    setHydratedKey(visibilityQuery.dataUpdatedAt);
  }, [
    visibilityQuery.data,
    visibilityQuery.dataUpdatedAt,
    hydratedKey,
    draftValues,
    savedValues,
    pendingPhotoFiles,
    academicDocuments,
    savedAcademicDocuments,
    providerDocuments,
    savedProviderDocuments,
  ]);

  const onFieldChange = (id: string, value: string) => {
    setDraftValues((prev) => {
      const next = { ...prev, [id]: value };
      if (id === 'country') {
        next.province = '';
        next.city = '';
        next.district = '';
      } else if (id === 'province') {
        next.city = '';
        next.district = '';
      } else if (id === 'city') {
        next.district = '';
      } else if (id === 'eduCountry') {
        next.eduProvince = '';
        next.eduCity = '';
        next.eduDistrict = '';
      } else if (id === 'eduProvince') {
        next.eduCity = '';
        next.eduDistrict = '';
      } else if (id === 'eduCity') {
        next.eduDistrict = '';
      }
      return next;
    });
    setFieldErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (formError) setFormError(null);
  };

  const onPhotoPick = (id: string, previewUrl: string, file: File) => {
    setDraftValues((prev) => {
      const previous = prev[id];
      if (previous?.startsWith('blob:')) {
        URL.revokeObjectURL(previous);
      }
      return { ...prev, [id]: previewUrl };
    });
    setPendingPhotoFiles((prev) => ({ ...prev, [id]: file }));
    setFieldErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (formError) setFormError(null);
  };

  const isDirty = useMemo(() => {
    const fieldsDirty = Object.keys(draftValues).some(
      (id) => (draftValues[id] ?? '') !== (savedValues[id] ?? '')
    );
    const academicDirty =
      documentsSignature(academicDocuments) !==
      documentsSignature(savedAcademicDocuments);
    const providerDirty =
      documentsSignature(providerDocuments) !==
      documentsSignature(savedProviderDocuments);
    const hasPendingDocs = [...academicDocuments, ...providerDocuments].some(
      (doc) =>
        doc.state === 'uploading' ||
        ((doc.state === 'done' || doc.state === 'review') && !doc.filePath)
    );
    return fieldsDirty || academicDirty || providerDirty || hasPendingDocs;
  }, [
    draftValues,
    savedValues,
    academicDocuments,
    savedAcademicDocuments,
    providerDocuments,
    savedProviderDocuments,
  ]);

  const isFieldsLoading =
    Boolean(accessToken) &&
    !visibilityQuery.isError &&
    (isSaving ||
      submitPrivateMutation.isPending ||
      reviewMutation.isPending ||
      visibilityQuery.isPending ||
      visibilityQuery.isPlaceholderData ||
      hydratedKey === null ||
      (visibilityQuery.isFetching && !isDirty));

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

    if (
      academicDocuments.some((doc) => doc.state === 'uploading') ||
      providerDocuments.some((doc) => doc.state === 'uploading')
    ) {
      setFormError(t('documentsUploading'));
      return;
    }

    const pendingPhotoEntries = Object.entries(draftValues).filter(
      ([id, value]) => value.startsWith('blob:') && Boolean(pendingPhotoFiles[id])
    );
    const orphanBlob = Object.entries(draftValues).some(
      ([id, value]) => value.startsWith('blob:') && !pendingPhotoFiles[id]
    );
    if (orphanBlob) {
      setFormError(t('localImageOnly'));
      return;
    }

    let nextAcademicDocuments = academicDocuments;
    let nextProviderDocuments = providerDocuments;
    let valuesForSubmit = { ...draftValues };

    const needsDocumentUpload = [...academicDocuments, ...providerDocuments].some(
      (doc) =>
        (doc.state === 'done' || doc.state === 'review') &&
        !doc.filePath &&
        Boolean(doc.file)
    );
    const needsPhotoUpload = pendingPhotoEntries.length > 0;

    if (needsPhotoUpload || needsDocumentUpload) {
      if (!isPrivateFileUploadConfigured()) {
        setFormError(
          needsPhotoUpload ? t('localImageOnly') : t('localDocumentOnly')
        );
        return;
      }

      setIsSaving(true);
      try {
        if (needsPhotoUpload) {
          const uploaded = await Promise.all(
            pendingPhotoEntries.map(async ([id, previewUrl]) => {
              const file = pendingPhotoFiles[id]!;
              const filePath = await uploadPrivatePanelFile({
                accessToken,
                file,
              });
              if (previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
              }
              return [id, filePath] as const;
            })
          );
          valuesForSubmit = {
            ...valuesForSubmit,
            ...Object.fromEntries(uploaded),
          };
          setDraftValues((prev) => ({ ...prev, ...Object.fromEntries(uploaded) }));
          setPendingPhotoFiles({});
        }

        if (needsDocumentUpload) {
          nextAcademicDocuments = await Promise.all(
            academicDocuments.map(async (doc) => {
              if (doc.filePath || !doc.file) return doc;
              if (doc.state !== 'done' && doc.state !== 'review') return doc;
              const filePath = await uploadPrivatePanelFile({
                accessToken,
                file: doc.file,
              });
              return { ...doc, filePath };
            })
          );
          nextProviderDocuments = await Promise.all(
            providerDocuments.map(async (doc) => {
              if (doc.filePath || !doc.file) return doc;
              if (doc.state !== 'done' && doc.state !== 'review') return doc;
              const filePath = await uploadPrivatePanelFile({
                accessToken,
                file: doc.file,
              });
              return { ...doc, filePath };
            })
          );
          setAcademicDocuments(nextAcademicDocuments);
          setProviderDocuments(nextProviderDocuments);
        }
      } catch (error) {
        setFormError(
          getActorApiErrorMessage(
            error,
            needsPhotoUpload ? t('imageUploadFailed') : t('localDocumentOnly')
          )
        );
        setIsSaving(false);
        return;
      }
    }

    const submitValues = sanitizeValuesForPrivateSubmit(valuesForSubmit);
    const privateTabs = new Set(
      tabsAffectedByValues(submitValues, savedValues)
    );
    const academicReady = readyDocuments(nextAcademicDocuments);
    const academicDocsDirty =
      documentsSignature(nextAcademicDocuments) !==
      documentsSignature(savedAcademicDocuments);
    if (academicDocsDirty && academicReady.length > 0) {
      privateTabs.add('educational_information');
    }

    if (privateTabs.size === 0) {
      if (
        documentsSignature(nextProviderDocuments) !==
        documentsSignature(savedProviderDocuments)
      ) {
        setFormError(t('localDocumentOnly'));
        setIsSaving(false);
        return;
      }
      setFormError(t('nothingToSave'));
      setIsSaving(false);
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all(
        [...privateTabs].map((tabName: PrivateOwnerTabName) =>
          submitPrivateMutation.mutateAsync({
            accessToken,
            tabName,
            body: toPrivateTabSubmitBody(
              submitValues,
              tabName,
              privateData,
              savedValues,
              tabName === 'educational_information' && academicDocsDirty
                ? {
                    academicDocuments: academicReady.map((doc) => ({
                      filePath: doc.filePath!,
                      description: doc.name,
                    })),
                  }
                : undefined
            ),
          })
        )
      );
      setPendingPhotoFiles({});
      if (academicDocsDirty) {
        setSavedAcademicDocuments(academicReady);
        setAcademicDocuments(academicReady);
      }
      setSavedProviderDocuments(nextProviderDocuments);
      setFormError(null);
      await refreshFieldsFromServer();
    } catch (error) {
      setFormError(getActorApiErrorMessage(error, t('saveFailed')));
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setDraftValues((prev) => {
      for (const [id, value] of Object.entries(prev)) {
        if (value.startsWith('blob:') && value !== savedValues[id]) {
          URL.revokeObjectURL(value);
        }
      }
      return savedValues;
    });
    setPendingPhotoFiles({});
    setAcademicDocuments(savedAcademicDocuments);
    setProviderDocuments(savedProviderDocuments);
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
      await refreshFieldsFromServer();
    } catch (error) {
      setFormError(getActorApiErrorMessage(error, t('reviewFailed')));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      dir="rtl"
      className={cn(
        'flex w-full flex-col gap-6 text-start',
        mode === 'view' && isDirty && 'pb-24 min-[834px]:pb-0'
      )}
    >
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
            'relative overflow-hidden rounded-3xl border-2 border-[#bfc9c1]',
            'bg-transparent dark:border-auth-input-border',
            isFieldsLoading && 'min-h-[320px]'
          )}
        >
          {isFieldsLoading ? (
            <PanelLoadingOverlay
              message={t('loading')}
              className="bg-[#f8f8f0]/85 dark:bg-home-card/80"
            />
          ) : null}
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
                              onPhotoPick={onPhotoPick}
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
                              documents={academicDocuments}
                              onDocumentsChange={setAcademicDocuments}
                              onUploadFile={
                                isPrivateFileUploadConfigured()
                                  ? uploadDocumentFile
                                  : undefined
                              }
                              editable={editable}
                              accessToken={accessToken}
                              privateData={privateData}
                              onSubmitRecord={async (payload) => {
                                await submitPrivateMutation.mutateAsync({
                                  accessToken,
                                  tabName: 'educational_information',
                                  body: toPrivateTabSubmitBody(
                                    draftValues,
                                    'educational_information',
                                    privateData,
                                    savedValues,
                                    {
                                      academicRecords: payload,
                                    }
                                  ),
                                });
                                await refreshFieldsFromServer();
                              }}
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
                              documents={providerDocuments}
                              onDocumentsChange={setProviderDocuments}
                              onUploadFile={
                                isPrivateFileUploadConfigured()
                                  ? uploadDocumentFile
                                  : undefined
                              }
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

                      <div className="hidden flex-wrap items-center justify-start gap-3 min-[834px]:flex">
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

      {mode === 'view' && isDirty ? (
        <FieldsFloatingSaveBar
          disabled={!accessToken}
          saving={isSaving}
          onCancel={handleCancel}
          onSave={() => {
            void handleSave();
          }}
        />
      ) : null}

      <LimitationsSection accessToken={accessToken} t={t} />
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
  onPhotoPick,
  t,
  tVis,
}: {
  fields: VisibilityField[];
  editable: boolean;
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

function ProviderBlocks({
  fields,
  editable,
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

function AcademicRecordsBlock({
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
  accessToken?: string | null;
  privateData?: unknown;
  onSubmitRecord: (
    records: ReturnType<typeof toAcademicRecordUserDto>[]
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
        .filter(
          (item) => item.source === 'submitted' && item.id !== record.id
        )
        .map((item) => toAcademicRecordUserDto(item));
      await onSubmitRecord(nextSubmitted);
    } catch (error) {
      setModalError(
        getActorApiErrorMessage(error, t('academicRecordDeleteFailed'))
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

      const submitted = records.filter((record) => record.source === 'submitted');
      const nextSubmitted = editingRecord
        ? submitted.map((record) =>
            record.id === editingRecord.id ? draft : record
          )
        : [...submitted, draft];

      await onSubmitRecord(
        nextSubmitted.map((record) => toAcademicRecordUserDto(record))
      );
      setModalOpen(false);
      setEditingRecord(null);
    } catch (error) {
      setModalError(
        getActorApiErrorMessage(error, t('academicRecordSaveFailed'))
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
              recordsHidden && 'bg-[#ffdbcf]/50'
            )}
          >
            {recordsHidden ? t('showAcademicRecords') : t('hideAcademicRecords')}
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
            'pointer-events-none opacity-40'
        )}
      >
        {records.length > 0 ? (
          <ul
            className={cn(
              'overflow-hidden rounded-2xl border border-[#dbd8d1] bg-home-card',
              'dark:border-auth-input-border dark:bg-home-search-category'
            )}
          >
            {records.map((record, index) => (
              <li
                key={record.id}
                className={cn(
                  index > 0 && 'border-t border-[#dbd8d1] dark:border-auth-input-border'
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
                          <Pencil className="size-4" strokeWidth={1.75} aria-hidden />
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
                            <Loader2 className="size-4 animate-spin" aria-hidden />
                          ) : (
                            <Trash2 className="size-4" strokeWidth={1.75} aria-hidden />
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
            <Button
              type="button"
              onClick={openCreate}
              className={cn(
                'h-11 gap-2 !rounded-xl bg-[#e7e8e0] px-4 text-sm font-medium text-[#404943] shadow-none',
                'hover:bg-[#dbd8d1] dark:bg-home-stat-card dark:text-home-filter-ink dark:hover:bg-home-card'
              )}
            >
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
        'disabled:opacity-50 dark:border-auth-input-border dark:text-home-filter-muted'
      )}
    >
      {children}
    </button>
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
              editable={editable && !field.locked}
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
          value={values[field.id] ?? field.value}
          values={values}
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
  accessToken,
  t,
}: {
  accessToken?: string | null;
  t: ReturnType<typeof useTranslations>;
}) {
  const actorInfoQuery = useActorInfoQuery({ accessToken });
  const isBlocked = Boolean(actorInfoQuery.data?.blockStatus);

  if (!accessToken || actorInfoQuery.isLoading || !isBlocked) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className={cn(
          'relative rounded-3xl border border-[#dbd8d1] bg-[#f8f8f0] px-4 pb-6 pt-8',
          'min-[720px]:px-8 min-[720px]:pb-8',
          'dark:border-auth-input-border dark:bg-home-stat-card'
        )}
      >
        <h3 className="absolute -top-3 start-4 bg-[#f8f8f0] px-1 text-base font-semibold text-[#ba1a1a] dark:bg-home-stat-card">
          {t('limitations.blockedTitle')}
        </h3>

        <div className="flex flex-col gap-6">
          <p className="text-justify text-sm font-medium leading-6 text-[#404943] dark:text-home-filter-muted">
            {t('limitations.blockedBody')}
          </p>
          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              disabled
              className={cn(
                'h-12 w-full max-w-[176px] !rounded-xl border border-[#e06333]',
                'bg-transparent px-4 text-sm font-medium text-[#e06333] shadow-none',
                'disabled:opacity-50'
              )}
            >
              {t('limitations.requestLift')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
