'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import fa from '@messages/fa.json';
import {
  MOCK_ACADEMIC_RECORDS,
  MOCK_VISIBILITY_FIELDS,
  VISIBILITY_CATEGORIES,
  VISIBILITY_SECTIONS,
  type VisibilityCategoryId,
  type VisibilityField,
} from '@private-panel/data/manage-visibility-mock';
import { MOCK_PUBLIC_PANEL_RESTRICTIONS } from '@private-panel/data/public-ops-mock';
import { AppDialog } from '@/components/ui/app-dialog';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

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

import {
  academicRecordSelectionSeed,
  EducationRecordsSection,
} from './education-records-section';
import { RestrictionCard } from './restriction-card';
import { VisibilityFieldCard } from './visibility-field';

const INTRO_PARAGRAPHS =
  fa.privatePanel.publicOps.manageVisibility.introParagraphs;

function initialSelection(): Record<string, boolean> {
  return Object.fromEntries(
    MOCK_VISIBILITY_FIELDS.map((field) => [
      field.id,
      field.locked
        ? false
        : (field.selectedInitially ?? field.initiallyVisible),
    ])
  );
}

function initialValues(): Record<string, string> {
  return Object.fromEntries(
    MOCK_VISIBILITY_FIELDS.map((field) => [field.id, field.value])
  );
}

function partitionFields(fields: VisibilityField[]) {
  return {
    photos: fields.filter((f) => f.kind === 'photo'),
    texts: fields.filter((f) => f.kind === 'text'),
    textareas: fields.filter((f) => f.kind === 'textarea'),
    toggles: fields.filter((f) => f.kind === 'toggle'),
  };
}

/** Manage which private-panel fields appear on the public panel. */
export function ManageVisibilityPanel() {
  const t = useTranslations('privatePanel.publicOps.manageVisibility');
  const [category, setCategory] =
    useState<VisibilityCategoryId>('identity');
  const [selection, setSelection] = useState(initialSelection);
  const [values, setValues] = useState(initialValues);
  const [savedSelection, setSavedSelection] = useState(initialSelection);
  const [savedValues, setSavedValues] = useState(initialValues);
  const [recordSelection, setRecordSelection] = useState(() =>
    academicRecordSelectionSeed(MOCK_ACADEMIC_RECORDS)
  );
  const [savedRecordSelection, setSavedRecordSelection] = useState(() =>
    academicRecordSelectionSeed(MOCK_ACADEMIC_RECORDS)
  );
  const [discardOpen, setDiscardOpen] = useState(false);

  const isDirty = useMemo(() => {
    const fieldsDirty = MOCK_VISIBILITY_FIELDS.some(
      (field) =>
        selection[field.id] !== savedSelection[field.id] ||
        values[field.id] !== savedValues[field.id]
    );
    const recordsDirty = MOCK_ACADEMIC_RECORDS.some(
      (record) =>
        recordSelection[record.id] !== savedRecordSelection[record.id]
    );
    return fieldsDirty || recordsDirty;
  }, [
    selection,
    savedSelection,
    values,
    savedValues,
    recordSelection,
    savedRecordSelection,
  ]);

  const sections = VISIBILITY_SECTIONS[category];
  const categoryFields = MOCK_VISIBILITY_FIELDS.filter(
    (field) => field.category === category
  );

  function toggleField(id: string) {
    const field = MOCK_VISIBILITY_FIELDS.find((item) => item.id === id);
    if (!field || field.locked) return;
    setSelection((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleRecord(id: string) {
    setRecordSelection((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleValueChange(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  function handleSave() {
    // TODO: persist values + visibility via API
    setSavedSelection(selection);
    setSavedValues(values);
    setSavedRecordSelection(recordSelection);
  }

  function requestCancel() {
    if (!isDirty) return;
    setDiscardOpen(true);
  }

  function confirmDiscard() {
    setSelection(savedSelection);
    setValues(savedValues);
    setRecordSelection(savedRecordSelection);
    setDiscardOpen(false);
  }

  function renderFieldGrid(fields: VisibilityField[]) {
    const { photos, texts, textareas, toggles } = partitionFields(fields);
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
                value={values[field.id] ?? ''}
                selected={Boolean(selection[field.id])}
                onToggle={toggleField}
                onValueChange={handleValueChange}
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
                value={values[field.id] ?? ''}
                selected={Boolean(selection[field.id])}
                onToggle={toggleField}
                onValueChange={handleValueChange}
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
                value={values[field.id] ?? ''}
                selected={Boolean(selection[field.id])}
                onToggle={toggleField}
                onValueChange={handleValueChange}
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
                onValueChange={handleValueChange}
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
                        'bg-transparent px-2.5 pb-3 pt-1.5',
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
                          records={MOCK_ACADEMIC_RECORDS}
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

                <div className="flex w-full flex-col-reverse gap-2 pt-1 min-[720px]:flex-row min-[720px]:flex-wrap min-[720px]:items-center min-[720px]:justify-end min-[720px]:gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={!isDirty}
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
                    disabled={!isDirty}
                    onClick={handleSave}
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

      <div className="flex flex-col gap-3 min-[720px]:gap-4">
        {MOCK_PUBLIC_PANEL_RESTRICTIONS.map((restriction) => (
          <RestrictionCard key={restriction.id} restriction={restriction} />
        ))}
      </div>

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
