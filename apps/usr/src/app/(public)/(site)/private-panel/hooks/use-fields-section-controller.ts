'use client';

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
  type AcademicRecordUserDto,
  type PrivateOwnerTabName,
} from '@private-panel/api';
import {
  CATEGORY_TO_TAB,
  VISIBILITY_SECTIONS,
  type VisibilityCategoryId,
  type VisibilityField,
} from '@private-panel/data/visibility-config';
import {
  firstCategoryWithErrors,
  validateVisibilityValues,
  type VisibilityValidationErrorKey,
} from '@private-panel/utils/visibility-validation';

import type { DocumentDraft } from '@private-panel/types/documents';
import {
  documentsSignature,
  readyDocuments,
  resetDependentLocationValues,
  valuesFromFields,
  type FieldValues,
  type FieldsMode,
  type ReviewDecision,
} from '@private-panel/utils/fields-section-utils';

type UseFieldsSectionControllerPayload = {
  accessToken?: string | null;
  targetActorId?: number | null;
};

const ALWAYS_LOCKED_FIELD_IDS = new Set([
  'email',
  'mobile',
  'username',
  'membershipType',
  'membershipDate',
  'membershipExpiry',
  'levelChangeMethod',
  'serviceProviderStatus',
]);

const ADMIN_LOCKED_FIELD_IDS = new Set([
  'avatar',
  'electronicCardPhoto',
  'firstName',
  'lastName',
  'nationalId',
  'birthDate',
  'bio',
]);

export function useFieldsSectionController({
  accessToken,
  targetActorId,
}: UseFieldsSectionControllerPayload) {
  const t = useTranslations('privatePanel.fields');
  const tVis = useTranslations('privatePanel.publicOps.manageVisibility');
  const visibilityQuery = useManageVisibilityQuery(accessToken, targetActorId);
  const submitPrivateMutation = useSubmitPrivateTabByOwnerMutation();
  const reviewMutation = useReviewPrivateChangesByOwnerMutation();
  const privateSubmitter = targetActorId ? 'admin' : 'owner';

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
    Record<string, ReviewDecision>
  >({});
  const [reviewValues, setReviewValues] = useState<Record<string, string>>({});
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

  const fields = (
    visibilityQuery.data?.fields ?? mapVisibilityFields(null, null)
  ).map((field) =>
    ALWAYS_LOCKED_FIELD_IDS.has(field.id) ||
    (Boolean(targetActorId) && ADMIN_LOCKED_FIELD_IDS.has(field.id))
      ? { ...field, locked: true, lockedCaptionKey: 'locked' as const }
      : field,
  );
  const records = visibilityQuery.data?.records ?? [];
  const privateData = visibilityQuery.data?.privateData;
  const pendingRequests = useMemo(
    () =>
      mapPendingFieldRequests(privateData, {
        viewer: targetActorId ? 'Admin' : 'Owner',
      }),
    [privateData, targetActorId],
  );
  const pendingCounts = useMemo(
    () =>
      pendingRequests.reduce(
        (acc, request) => {
          acc[request.category] = (acc[request.category] ?? 0) + 1;
          return acc;
        },
        {} as Partial<Record<VisibilityCategoryId, number>>,
      ),
    [pendingRequests],
  );
  const categoryPendingRequests = useMemo(
    () => pendingRequests.filter((request) => request.category === category),
    [pendingRequests, category],
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
            actorId: targetActorId,
            tabName,
            body: toPrivateTabSubmitBody(
              submitValues,
              tabName,
              privateData,
              savedValues,
              {
                submitter: privateSubmitter,
                ...(tabName === 'educational_information' && academicDocsDirty
                  ? {
                      academicDocuments: academicReady.map((doc) => ({
                        filePath: doc.filePath,
                        description: doc.name,
                      })),
                    }
                  : {}),
              },
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
    const editedRequests = pendingRequests.filter(
      (request) =>
        request.fieldId &&
        (reviewValues[request.requestKey] ?? request.newValue) !==
          request.newValue,
    );
    const editedRequestKeys = new Set(
      editedRequests.map((request) => request.requestKey),
    );
    const pendingRequestByKey = new Map(
      pendingRequests.map((request) => [
        request.requestKey,
        request,
      ]),
    );
    const confirmed = Object.entries(reviewDecisions)
      .filter(
        ([key, decision]) =>
          decision === 'approve' && !editedRequestKeys.has(key),
      )
      .flatMap(([key]) => {
        const request = pendingRequestByKey.get(key);
        if (!request) return [];
        return [
          {
            request_id: request.requestId,
            request_type: request.requestType ?? 1,
          },
        ];
      });
    confirmed.push(
      ...editedRequests.map((request) => ({
        request_id: request.requestId,
        request_type: request.requestType ?? 1,
      })),
    );
    const rejected = Object.entries(reviewDecisions)
      .filter(
        ([key, decision]) =>
          decision === 'reject' && !editedRequestKeys.has(key),
      )
      .flatMap(([key]) => {
        const request = pendingRequestByKey.get(key);
        if (!request) return [];
        return [
          {
            request_id: request.requestId,
            request_type: request.requestType ?? 1,
          },
        ];
      });

    if (confirmed.length === 0 && rejected.length === 0) {
      setFormError(t('nothingToSave'));
      return;
    }

    setIsSaving(true);
    setFormError(null);
    try {
      await reviewMutation.mutateAsync({
        accessToken,
        actorId: targetActorId,
        confirmedRequests: confirmed,
        rejectedRequests: rejected,
      });

      if (editedRequests.length > 0) {
        const valuesForSubmit = { ...savedValues };
        for (const request of editedRequests) {
          if (request.fieldId) {
            valuesForSubmit[request.fieldId] =
              reviewValues[request.requestKey] ?? request.newValue;
          }
        }
        const privateTabs = new Set(
          tabsAffectedByValues(valuesForSubmit, savedValues),
        );
        for (const request of editedRequests) {
          const tabName = request.tabName ?? CATEGORY_TO_TAB[request.category];
          if (tabName && tabName !== 'user_information') {
            privateTabs.add(tabName as PrivateOwnerTabName);
          }
        }

        await Promise.all(
          [...privateTabs].map((tabName: PrivateOwnerTabName) =>
            submitPrivateMutation.mutateAsync({
              accessToken,
              actorId: targetActorId,
              tabName,
              body: toPrivateTabSubmitBody(
                sanitizeValuesForPrivateSubmit(valuesForSubmit),
                tabName,
                privateData,
                savedValues,
                { submitter: privateSubmitter },
              ),
            }),
          ),
        );
      }

      setReviewDecisions({});
      setReviewValues({});
      await refreshFieldsFromServer();
    } catch (error) {
      setFormError(getActorApiErrorMessage(error, t('reviewFailed')));
    } finally {
      setIsSaving(false);
    }
  }

  function handleReviewCancel() {
    setReviewDecisions({});
    setReviewValues({});
    setFormError(null);
  }

  async function submitAcademicRecord(payload: AcademicRecordUserDto[]) {
    await submitPrivateMutation.mutateAsync({
      accessToken,
      actorId: targetActorId,
      tabName: 'educational_information',
      body: toPrivateTabSubmitBody(
        draftValues,
        'educational_information',
        privateData,
        savedValues,
        { academicRecords: payload, submitter: privateSubmitter },
      ),
    });
    await refreshFieldsFromServer();
  }

  return {
    t,
    tVis,
    mode,
    setMode,
    category,
    setCategory,
    pendingCounts,
    sections: VISIBILITY_SECTIONS[category],
    categoryFields,
    isFieldsLoading,
    editable: mode === 'view',
    values: draftValues,
    fieldErrors,
    records,
    academicDocuments,
    setAcademicDocuments,
    providerDocuments,
    setProviderDocuments,
    canUploadFiles: isPrivateFileUploadConfigured(),
    uploadDocumentFile,
    isDirty,
    isSaving,
    formError,
    onFieldChange,
    onPhotoPick,
    onSave: handleSave,
    onCancel: handleCancel,
    submitAcademicRecord,
    review: {
      requests: categoryPendingRequests,
      decisions: reviewDecisions,
      values: reviewValues,
      onDecisionChange: (requestKey: string, decision: ReviewDecision) =>
        setReviewDecisions((prev) => ({
          ...prev,
          [requestKey]: decision,
        })),
      onValueChange: (
        request: (typeof categoryPendingRequests)[number],
        value: string,
      ) => {
        setReviewValues((prev) => ({
          ...prev,
          [request.requestKey]: value,
        }));
        setReviewDecisions((prev) => ({
          ...prev,
          [request.requestKey]: 'approve',
        }));
        if (formError) setFormError(null);
      },
      onValueReset: (request: (typeof categoryPendingRequests)[number]) => {
        setReviewValues((prev) => {
          const next = { ...prev };
          delete next[request.requestKey];
          return next;
        });
        setReviewDecisions((prev) => {
          const next = { ...prev };
          delete next[request.requestKey];
          return next;
        });
        if (formError) setFormError(null);
      },
      onSave: handleReviewSave,
      onCancel: handleReviewCancel,
    },
  };
}
