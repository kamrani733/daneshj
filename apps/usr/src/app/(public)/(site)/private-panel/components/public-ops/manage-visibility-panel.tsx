'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import fa from '@messages/fa.json';
import {
  getActorApiErrorMessage,
  mapVisibilityFields,
  tabsAffectedBySelection,
  toPublicVisibilitySubmitBody,
  useManageVisibilityQuery,
  useSubmitPublicTabByOwnerMutation,
} from '@private-panel/api';
import {
  academicRecordSelectionSeed,
  VISIBILITY_CATEGORIES,
  VISIBILITY_SECTIONS,
  type VisibilityCategoryId,
  type VisibilityField,
} from '@private-panel/data/visibility-config';
import { AppDialog } from '@/components/ui/app-dialog';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import {
  EducationRecordsSection,
} from './education-records-section';
import { VisibilityFieldCard } from './visibility-field';

const INTRO_PARAGRAPHS =
  fa.privatePanel.publicOps.manageVisibility.introParagraphs;

function DiscardWarningIcon() {
  return (
    <span
      aria-hidden
      className="flex size-8 items-center justify-center rounded-full bg-[#ab2d25] text-base font-bold leading-none text-white"
    >
      !
    </span>
  );
}

function selectionFromFields(fields: VisibilityField[]): Record<string, boolean> {
  return Object.fromEntries(
    fields.map((field) => [
      field.id,
      field.locked
        ? false
        : (field.selectedInitially ?? field.initiallyVisible),
    ])
  );
}

function valuesFromFields(fields: VisibilityField[]): Record<string, string> {
  return Object.fromEntries(fields.map((field) => [field.id, field.value]));
}

function partitionFields(fields: VisibilityField[]) {
  return {
    photos: fields.filter((f) => f.kind === 'photo'),
    texts: fields.filter((f) => f.kind === 'text'),
    textareas: fields.filter((f) => f.kind === 'textarea'),
    toggles: fields.filter((f) => f.kind === 'toggle'),
  };
}

type ManageVisibilityPanelProps = {
  accessToken?: string | null;
  targetActorId?: number | null;
};

export function ManageVisibilityPanel({
  accessToken,
  targetActorId,
}: ManageVisibilityPanelProps) {
  const t = useTranslations('privatePanel.publicOps.manageVisibility');
  const visibilityQuery = useManageVisibilityQuery(accessToken, targetActorId);
  const submitPublicMutation = useSubmitPublicTabByOwnerMutation();
  const [isSaving, setIsSaving] = useState(false);

  const fields =
    visibilityQuery.data?.fields ?? mapVisibilityFields(null, null);
  const records = visibilityQuery.data?.records ?? [];

  const [category, setCategory] =
    useState<VisibilityCategoryId>('identity');
  const [selection, setSelection] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [savedSelection, setSavedSelection] = useState<Record<string, boolean>>(
    {}
  );
  const [recordSelection, setRecordSelection] = useState<Record<string, boolean>>(
    {}
  );
  const [savedRecordSelection, setSavedRecordSelection] = useState<
    Record<string, boolean>
  >({});
  const [discardOpen, setDiscardOpen] = useState(false);
  const [hydratedKey, setHydratedKey] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!visibilityQuery.data) return;
    if (hydratedKey === visibilityQuery.dataUpdatedAt) return;

    const hasLocalEdits =
      hydratedKey !== null &&
      (Object.keys(selection).some(
        (id) => selection[id] !== savedSelection[id]
      ) ||
        Object.keys(recordSelection).some(
          (id) => recordSelection[id] !== savedRecordSelection[id]
        ));
    if (hasLocalEdits) {
      setHydratedKey(visibilityQuery.dataUpdatedAt);
      return;
    }

    const nextFields = visibilityQuery.data.fields;
    const nextRecords = visibilityQuery.data.records;
    const nextSelection = selectionFromFields(nextFields);
    const nextValues = valuesFromFields(nextFields);
    const nextRecordsSelection = academicRecordSelectionSeed(nextRecords);
    setSelection(nextSelection);
    setSavedSelection(nextSelection);
    setValues(nextValues);
    setRecordSelection(nextRecordsSelection);
    setSavedRecordSelection(nextRecordsSelection);
    setHydratedKey(visibilityQuery.dataUpdatedAt);
  }, [
    visibilityQuery.data,
    visibilityQuery.dataUpdatedAt,
    hydratedKey,
    selection,
    savedSelection,
    recordSelection,
    savedRecordSelection,
  ]);

  const isDirty = useMemo(() => {
    const fieldsDirty = fields.some(
      (field) => selection[field.id] !== savedSelection[field.id]
    );
    const recordsDirty = records.some(
      (record) =>
        recordSelection[record.id] !== savedRecordSelection[record.id]
    );
    return fieldsDirty || recordsDirty;
  }, [
    fields,
    records,
    selection,
    savedSelection,
    recordSelection,
    savedRecordSelection,
  ]);

  const sections = VISIBILITY_SECTIONS[category];
  const categoryFields = fields.filter((field) => field.category === category);

  function toggleField(id: string) {
    const field = fields.find((item) => item.id === id);
    if (!field || field.locked) return;
    setSelection((prev) => ({ ...prev, [id]: !prev[id] }));
    if (formError) setFormError(null);
  }

  function toggleRecord(id: string) {
    setRecordSelection((prev) => ({ ...prev, [id]: !prev[id] }));
    if (formError) setFormError(null);
  }

  async function handleSave() {
    if (!accessToken || isSaving) return;

    setFormError(null);
    if (targetActorId) {
      setFormError(t('validation.nothingToSave'));
      return;
    }

    const publicTabs = tabsAffectedBySelection(selection, savedSelection);

    if (publicTabs.length === 0) {
      setSavedSelection(selection);
      setSavedRecordSelection(recordSelection);
      setFormError(t('validation.nothingToSave'));
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all(
        publicTabs.map((tabName) =>
          submitPublicMutation.mutateAsync({
            accessToken,
            tabName,
            body: toPublicVisibilitySubmitBody(selection, tabName),
          })
        )
      );
      setSavedSelection(selection);
      setSavedRecordSelection(recordSelection);
      setFormError(null);
    } catch (error) {
      setFormError(getActorApiErrorMessage(error, t('saveFailed')));
    } finally {
      setIsSaving(false);
    }
  }

  function requestCancel() {
    if (!isDirty) return;
    setDiscardOpen(true);
  }

  function confirmDiscard() {
    setSelection(savedSelection);
    setRecordSelection(savedRecordSelection);
    setFormError(null);
    setDiscardOpen(false);
  }

  function renderFieldGrid(sectionFields: VisibilityField[]) {
    const { photos, texts, textareas, toggles } = partitionFields(sectionFields);
    const fieldGridClass =
      'grid grid-cols-1 gap-3 min-[720px]:grid-cols-2 min-[720px]:gap-4 min-[834px]:gap-5';

    return (
      <div className="flex flex-col gap-3 min-[720px]:gap-5">
        {photos.length > 0 ? (
          <div className={fieldGridClass}>
            {photos.map((field) => (
              <VisibilityFieldCard
                key={field.id}
                field={field}
                value={values[field.id] ?? field.value}
                selected={Boolean(selection[field.id])}
                onToggle={toggleField}
              />
            ))}
          </div>
        ) : null}

        {texts.length > 0 ? (
          <div className={fieldGridClass}>
            {texts.map((field) => (
              <VisibilityFieldCard
                key={field.id}
                field={field}
                value={values[field.id] ?? field.value}
                selected={Boolean(selection[field.id])}
                onToggle={toggleField}
              />
            ))}
          </div>
        ) : null}

        {textareas.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 min-[720px]:gap-4">
            {textareas.map((field) => (
              <VisibilityFieldCard
                key={field.id}
                field={field}
                value={values[field.id] ?? field.value}
                selected={Boolean(selection[field.id])}
                onToggle={toggleField}
              />
            ))}
          </div>
        ) : null}

        {toggles.length > 0 ? (
          <div className={fieldGridClass}>
            {toggles.map((field) => (
              <VisibilityFieldCard
                key={field.id}
                field={field}
                value=""
                selected={Boolean(selection[field.id])}
                onToggle={toggleField}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 min-[720px]:gap-6">
      <ul className="flex list-disc flex-col gap-2 pe-4 text-justify text-xs font-medium leading-6 text-home-filter-muted marker:text-home-filter-muted min-[720px]:gap-3 min-[720px]:pe-5 min-[720px]:text-sm min-[720px]:leading-7 dark:text-home-filter-ink">
        {INTRO_PARAGRAPHS.map((paragraph) => (
          <li key={paragraph}>{paragraph}</li>
        ))}
      </ul>

      <Tabs
        value={category}
        onValueChange={(value) => setCategory(value as VisibilityCategoryId)}
        dir="rtl"
        className={cn(
          'flex w-full flex-col gap-3 rounded-xl border border-border bg-white p-3',
          'dark:bg-home-stat-card',
          'min-[720px]:gap-5 min-[720px]:rounded-2xl min-[720px]:p-5',
          'min-[834px]:p-6'
        )}
      >
        <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList
            className={cn(
              'flex h-auto w-max min-w-full items-stretch justify-start gap-3',
              'rounded-none border-b border-border bg-transparent p-0',
              'min-[720px]:w-full min-[720px]:gap-5'
            )}
          >
            {VISIBILITY_CATEGORIES.map((id) => (
              <TabsTrigger
                key={id}
                value={id}
                className={cn(
                  'h-auto shrink-0 rounded-none border-0 border-b-2 border-transparent px-0 pb-2',
                  'justify-center text-[11px] font-medium text-home-filter-muted shadow-none',
                  'hover:text-primary focus-visible:ring-primary/30',
                  'data-[state=active]:border-b-primary data-[state=active]:bg-transparent',
                  'data-[state=active]:text-primary data-[state=active]:shadow-none',
                  'dark:text-home-filter-ink dark:data-[state=active]:border-b-primary-100',
                  'dark:data-[state=active]:text-primary-100',
                  'min-[720px]:pb-2.5 min-[720px]:text-sm'
                )}
              >
                <span className="whitespace-nowrap">
                  {t(`categories.${id}`)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {VISIBILITY_CATEGORIES.map((id) => (
          <TabsContent key={id} value={id} className="mt-0">
            {id !== category ? null : categoryFields.length === 0 ? (
              <p className="py-8 text-center text-sm text-home-filter-muted min-[720px]:py-10">
                {t('emptyCategory')}
              </p>
            ) : (
              <div className="flex flex-col gap-3 min-[720px]:gap-5">
                {sections.map((section) => {
                  const sectionFields = categoryFields.filter(
                    (field) => field.section === section.key
                  );
                  if (
                    section.key !== 'academicRecords' &&
                    sectionFields.length === 0
                  ) {
                    return null;
                  }

                  return (
                    <fieldset
                      key={section.key}
                      className={cn(
                        'flex w-full flex-col gap-3 rounded-xl border border-border',
                        'bg-[#f8f8f0] px-2.5 pb-3 pt-1.5',
                        'min-[720px]:gap-5 min-[720px]:rounded-[20px] min-[720px]:px-5 min-[720px]:pb-5 min-[720px]:pt-2',
                        'min-[834px]:rounded-3xl'
                      )}
                    >
                      <legend className="ms-1 max-w-[calc(100%-0.5rem)] bg-white px-1.5 text-xs font-medium text-primary min-[720px]:ms-2 min-[720px]:px-2 min-[720px]:text-sm dark:bg-home-stat-card dark:text-primary-100">
                        {t(`sections.${section.titleKey}`)}
                      </legend>
                      {section.key === 'academicRecords' ? (
                        <EducationRecordsSection
                          toggleFields={sectionFields}
                          records={records}
                          fieldSelection={selection}
                          recordSelection={recordSelection}
                          onToggleField={toggleField}
                          onToggleRecord={toggleRecord}
                        />
                      ) : (
                        renderFieldGrid(sectionFields)
                      )}
                    </fieldset>
                  );
                })}

                {formError ? (
                  <p
                    role="alert"
                    className="text-start text-xs font-medium text-error min-[720px]:text-sm"
                  >
                    {formError}
                  </p>
                ) : null}

                <div className="flex w-full flex-col-reverse gap-2 pt-1 min-[720px]:flex-row min-[720px]:flex-wrap min-[720px]:items-center min-[720px]:justify-end min-[720px]:gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={!isDirty || isSaving}
                    onClick={requestCancel}
                    className={cn(
                      'h-11 w-full px-4 text-sm font-medium text-primary shadow-none',
                      'hover:bg-transparent hover:text-primary',
                      'disabled:opacity-40',
                      'dark:text-primary-100',
                      'min-[720px]:w-auto'
                    )}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="button"
                    loading={isSaving}
                    disabled={!isDirty || !accessToken || Boolean(targetActorId)}
                    onClick={() => {
                      void handleSave();
                    }}
                    className={cn(
                      'h-11 w-full !rounded-xl bg-primary px-6 text-sm font-medium text-white shadow-none',
                      'hover:bg-primary/90 disabled:opacity-40',
                      'min-[720px]:w-auto min-[720px]:px-8'
                    )}
                  >
                    {t('save')}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <AppDialog
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        variant="confirm"
        title={t('discardConfirm')}
        icon={<DiscardWarningIcon />}
        actionsStyle="text"
        primaryAction={{
          label: t('discardYes'),
          tone: 'destructive',
          onClick: confirmDiscard,
        }}
        secondaryAction={{
          label: t('discardNo'),
          tone: 'muted',
        }}
      />
    </div>
  );
}
