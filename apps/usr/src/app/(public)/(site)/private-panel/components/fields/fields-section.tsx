'use client';

import { Loader2, Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import {
  getActorApiErrorMessage,
  isPrivateFileUploadConfigured,
  mapPendingFieldRequests,
  mapVisibilityFields,
  sanitizeValuesForPrivateSubmit,
  tabsAffectedByValues,
  toPrivateTabSubmitBody,
  uploadPrivatePanelFile,
  useManageVisibilityQuery,
  useReviewPrivateChangesByOwnerMutation,
  useSubmitPrivateTabByOwnerMutation,
  type PrivateOwnerTabName,
} from '@private-panel/api';
import {
  VISIBILITY_CATEGORIES,
  VISIBILITY_SECTIONS,
  type VisibilityCategoryId,
  type VisibilityField,
} from '@private-panel/data/visibility-config';
import {
  firstCategoryWithErrors,
  validateVisibilityValues,
  type VisibilityValidationErrorKey,
} from '@private-panel/data/visibility-validation';
import { PanelLoadingOverlay } from '@/components/panel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import {
  AcademicRecordsBlock,
  FieldGrid,
  FieldsetBlock,
  IdentityCategoryBlocks,
  ProviderBlocks,
} from './fields-section-blocks';
import { FieldsFloatingSaveBar } from './fields-floating-save-bar';
import { IntroBullets, ModeTabs } from './fields-section-header';
import { FieldsLimitationsSection } from './fields-limitations-section';
import {
  documentsSignature,
  readyDocuments,
  resetDependentLocationValues,
  valuesFromFields,
  type FieldsMode,
  type FieldValues,
  type ReviewDecision,
} from './fields-section-utils';
import { ReviewPendingList } from './review-pending-list';
import type { DocumentDraft } from './documents-panel';

type FieldsSectionProps = {
  accessToken?: string | null;
};

export function FieldsSection({ accessToken }: FieldsSectionProps) {
  const t = useTranslations('privatePanel.fields');
  const tVis = useTranslations('privatePanel.publicOps.manageVisibility');
  const visibilityQuery = useManageVisibilityQuery(accessToken);
  const submitPrivateMutation = useSubmitPrivateTabByOwnerMutation();
  const reviewMutation = useReviewPrivateChangesByOwnerMutation();

  const [mode, setMode] = useState<FieldsMode>('view');
  const [category, setCategory] = useState<VisibilityCategoryId>('identity');
  const [draftValues, setDraftValues] = useState<FieldValues>({});
  const [savedValues, setSavedValues] = useState<FieldValues>({});
  const [hydratedKey, setHydratedKey] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, VisibilityValidationErrorKey>
  >({});
  const [reviewDecisions, setReviewDecisions] = useState<
    Record<number, ReviewDecision>
  >({});
  const [academicDocuments, setAcademicDocuments] = useState<DocumentDraft[]>(
    [],
  );
  const [savedAcademicDocuments, setSavedAcademicDocuments] = useState<
    DocumentDraft[]
  >([]);
  const [providerDocuments, setProviderDocuments] = useState<DocumentDraft[]>(
    [],
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
    [privateData],
  );

  const applyServerFields = (
    nextFields: VisibilityField[],
    dataUpdatedAt: number,
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
        (id) => draftValues[id] !== savedValues[id],
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
      return resetDependentLocationValues({ ...prev, [id]: value }, id);
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
      (id) => (draftValues[id] ?? '') !== (savedValues[id] ?? ''),
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
        ((doc.state === 'done' || doc.state === 'review') && !doc.filePath),
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
    [fields, category],
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

    const pendingPhotoEntries = Object.entries(draftValues).flatMap(
      ([id, previewUrl]) => {
        const file = pendingPhotoFiles[id];
        if (!previewUrl.startsWith('blob:') || !file) return [];
        return [{ file, id, previewUrl }];
      },
    );
    const orphanBlob = Object.entries(draftValues).some(
      ([id, value]) => value.startsWith('blob:') && !pendingPhotoFiles[id],
    );
    if (orphanBlob) {
      setFormError(t('localImageOnly'));
      return;
    }

    let nextAcademicDocuments = academicDocuments;
    let nextProviderDocuments = providerDocuments;
    let valuesForSubmit = { ...draftValues };

    const needsDocumentUpload = [
      ...academicDocuments,
      ...providerDocuments,
    ].some(
      (doc) =>
        (doc.state === 'done' || doc.state === 'review') &&
        !doc.filePath &&
        Boolean(doc.file),
    );
    const needsPhotoUpload = pendingPhotoEntries.length > 0;

    if (needsPhotoUpload || needsDocumentUpload) {
      if (!isPrivateFileUploadConfigured()) {
        setFormError(
          needsPhotoUpload ? t('localImageOnly') : t('localDocumentOnly'),
        );
        return;
      }

      setIsSaving(true);
      try {
        if (needsPhotoUpload) {
          const uploaded = await Promise.all(
            pendingPhotoEntries.map(async ({ file, id, previewUrl }) => {
              const filePath = await uploadPrivatePanelFile({
                accessToken,
                file,
              });
              if (previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
              }
              return [id, filePath] as const;
            }),
          );
          valuesForSubmit = {
            ...valuesForSubmit,
            ...Object.fromEntries(uploaded),
          };
          setDraftValues((prev) => ({
            ...prev,
            ...Object.fromEntries(uploaded),
          }));
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
            }),
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
            }),
          );
          setAcademicDocuments(nextAcademicDocuments);
          setProviderDocuments(nextProviderDocuments);
        }
      } catch (error) {
        setFormError(
          getActorApiErrorMessage(
            error,
            needsPhotoUpload ? t('imageUploadFailed') : t('localDocumentOnly'),
          ),
        );
        setIsSaving(false);
        return;
      }
    }

    const submitValues = sanitizeValuesForPrivateSubmit(valuesForSubmit);
    const privateTabs = new Set(
      tabsAffectedByValues(submitValues, savedValues),
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
                      filePath: doc.filePath,
                      description: doc.name,
                    })),
                  }
                : undefined,
            ),
          }),
        ),
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
        mode === 'view' && isDirty && 'pb-24 min-[834px]:pb-0',
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
            'relative overflow-hidden rounded-3xl border-2 border-border',
            'bg-transparent dark:border-auth-input-border',
            isFieldsLoading && 'min-h-[320px]',
          )}
        >
          {isFieldsLoading ? (
            <PanelLoadingOverlay
              message={t('loading')}
              className="bg-home-search-fill/85 dark:bg-home-card/80"
            />
          ) : null}
          <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsList
              className={cn(
                'flex h-14 w-max min-w-full items-stretch justify-start gap-0',
                'rounded-none border-b border-home-carousel-inactive bg-transparent p-0',
                'min-[720px]:h-16 dark:border-auth-input-border',
              )}
            >
              {VISIBILITY_CATEGORIES.map((id) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className={cn(
                    'h-full shrink-0 rounded-none border-0 border-b-2 border-transparent px-3',
                    'justify-center text-xs font-medium text-home-filter-muted shadow-none',
                    'hover:text-content focus-visible:ring-primary/30',
                    'data-[state=active]:border-b-primary data-[state=active]:bg-home-search-fill',
                    'data-[state=active]:font-bold data-[state=active]:text-content',
                    'data-[state=active]:shadow-none',
                    'dark:text-home-filter-ink dark:data-[state=active]:bg-home-stat-card',
                    'dark:data-[state=active]:border-b-primary-100 dark:data-[state=active]:text-primary-100',
                    'min-[720px]:px-4 min-[720px]:text-sm',
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
                    'min-[834px]:px-[68px]',
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
                          (field) => field.section === section.key,
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
                                    },
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
                        <p
                          role="alert"
                          className="text-sm font-medium text-error"
                        >
                          {formError}
                        </p>
                      ) : null}

                      <div className="hidden flex-wrap items-center justify-end gap-3 min-[834px]:flex">
                        {isDirty ? (
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isSaving}
                            onClick={handleCancel}
                            className="h-12 max-w-[160px] border-none ml-10 !rounded-2xl px-4 text-base font-medium text-primary shadow-none"
                          >
                            {t('cancel')}
                          </Button>
                        ) : null}
                        <Button
                          type="button"
                          disabled={!accessToken || isSaving || !isDirty}
                          onClick={() => void handleSave()}
                          className={cn(
                            'h-12 w-full max-w-[220px] gap-2 !rounded-2xl bg-primary',
                            'px-4 text-base font-medium text-white shadow-none',
                            'hover:bg-primary/90 disabled:opacity-60',
                          )}
                        >
                          {isSaving ? t('saving') : t('save')}
                        </Button>
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

      <FieldsLimitationsSection accessToken={accessToken} t={t} />
    </div>
  );
}
