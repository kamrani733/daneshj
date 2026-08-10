'use client';

import {
  BadgeCheck,
  Check,
  CloudUpload,
  Eye,
  Pencil,
  Plus,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState, type ReactNode } from 'react';

import {
  mapVisibilityFields,
  useManageVisibilityQuery,
} from '@private-panel/api';
import {
  VISIBILITY_CATEGORIES,
  VISIBILITY_SECTIONS,
  type VisibilityAcademicRecord,
  type VisibilityCategoryId,
  type VisibilityField,
} from '@private-panel/data/visibility-config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { ViewField, resolveViewControl } from './view-field';

type FieldsSectionProps = {
  accessToken?: string | null;
};

type FieldsMode = 'view' | 'review';

/**
 * «فیلدهای اطلاعاتی» — view mode (empty / filled).
 * Filled: https://www.figma.com/design/hieOKdeoR9ZmVujscuIadt/...?node-id=2496-14747
 */
export function FieldsSection({ accessToken }: FieldsSectionProps) {
  const t = useTranslations('privatePanel.fields');
  const tVis = useTranslations('privatePanel.publicOps.manageVisibility');
  const visibilityQuery = useManageVisibilityQuery(accessToken);
  const [mode, setMode] = useState<FieldsMode>('view');
  const [category, setCategory] =
    useState<VisibilityCategoryId>('identity');

  const fields =
    visibilityQuery.data?.fields ?? mapVisibilityFields(null, null);
  const records = visibilityQuery.data?.records ?? [];

  const categoryFields = useMemo(
    () => fields.filter((field) => field.category === category),
    [fields, category]
  );

  const sections = VISIBILITY_SECTIONS[category];

  return (
    <div className="flex w-full flex-col gap-6">
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
                    <p className="text-sm font-medium leading-6 text-[#404943] dark:text-home-filter-muted">
                      {t('reviewPlaceholder')}
                    </p>
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
                            <FieldGrid fields={sectionFields} tVis={tVis} />
                          </FieldsetBlock>
                        );
                      })}

                      <div className="flex justify-start">
                        <Button
                          type="button"
                          className={cn(
                            'h-12 w-full max-w-[220px] gap-2 !rounded-2xl bg-[#008d63]',
                            'px-4 text-base font-medium text-white shadow-none',
                            'hover:bg-[#008d63]/90'
                          )}
                        >
                          <Pencil
                            className="size-6"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                          {t('editAction')}
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

      <LimitationsSection t={t} />
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
  return (
    <Tabs
      value={mode}
      onValueChange={(value) => onModeChange(value as FieldsMode)}
      dir="rtl"
      className="w-full max-w-[360px] self-end"
    >
      <TabsList
        className={cn(
          'flex h-12 w-full items-stretch justify-end gap-0',
          'rounded-none border-b border-[#dbd8d1] bg-transparent p-0',
          'dark:border-auth-input-border'
        )}
      >
        <TabsTrigger
          value="review"
          className={cn(
            'h-full flex-1 gap-2 rounded-none border-0 border-b-2 border-transparent',
            'text-sm font-medium text-[#404943] shadow-none',
            'data-[state=active]:border-b-[#008d63] data-[state=active]:bg-transparent',
            'data-[state=active]:font-bold data-[state=active]:text-[#171d19]',
            'data-[state=active]:shadow-none dark:text-home-filter-ink',
            'dark:data-[state=active]:border-b-primary-100 dark:data-[state=active]:text-primary-100'
          )}
        >
          <BadgeCheck className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="whitespace-nowrap">{t('modes.review')}</span>
        </TabsTrigger>
        <TabsTrigger
          value="view"
          className={cn(
            'h-full flex-1 gap-2 rounded-none border-0 border-b-2 border-transparent',
            'text-sm font-medium text-[#404943] shadow-none',
            'data-[state=active]:border-b-[#008d63] data-[state=active]:bg-transparent',
            'data-[state=active]:font-bold data-[state=active]:text-[#171d19]',
            'data-[state=active]:shadow-none dark:text-home-filter-ink',
            'dark:data-[state=active]:border-b-primary-100 dark:data-[state=active]:text-primary-100'
          )}
        >
          <Eye className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="whitespace-nowrap">{t('modes.view')}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function IntroBullets({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <ul className="flex flex-col items-end gap-4">
      {[0, 1, 2].map((index) => (
        <li
          key={index}
          className="flex w-full items-start justify-end gap-2.5"
        >
          <p className="text-justify text-sm font-medium leading-6 text-[#171d19] dark:text-home-filter-ink">
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
          <span
            aria-hidden
            className="mt-2 size-1.5 shrink-0 rounded-full bg-[#008d63]"
          />
        </li>
      ))}
    </ul>
  );
}

function IdentityCategoryBlocks({
  fields,
  t,
  tVis,
}: {
  fields: VisibilityField[];
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
          {t('photosHint')}{' '}
          <button
            type="button"
            className="text-warning underline-offset-2 hover:underline"
          >
            {t('photosTermsLink')}
          </button>
        </p>
        <div className="grid grid-cols-1 gap-8 min-[720px]:grid-cols-2 min-[720px]:gap-x-[100px] min-[834px]:gap-x-[158px]">
          {photos.map((field) => (
            <ViewField
              key={field.id}
              field={field}
              label={tVis(`fields.${field.labelKey}`)}
            />
          ))}
        </div>
      </FieldsetBlock>

      <FieldsetBlock title={tVis('sections.identity')}>
        <div className="grid grid-cols-1 gap-8 min-[720px]:grid-cols-2 min-[720px]:gap-x-[100px] min-[834px]:gap-x-[158px]">
          {textFields.map((field) => (
            <ViewField
              key={field.id}
              field={field}
              label={tVis(`fields.${field.labelKey}`)}
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
  t,
  tVis,
}: {
  fields: VisibilityField[];
  t: ReturnType<typeof useTranslations>;
  tVis: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="flex flex-col gap-8 min-[720px]:gap-12">
      <FieldsetBlock title={tVis('sections.provider')}>
        <FieldGrid fields={fields} tVis={tVis} />
      </FieldsetBlock>
      <FieldsetBlock title={t('documentsTitle')}>
        <div className="flex flex-col gap-6 min-[720px]:flex-row min-[720px]:items-stretch min-[720px]:justify-between">
          <ul className="flex flex-col gap-4 min-[720px]:max-w-[48%]">
            <BulletText>{t('providerDocumentsHint')}</BulletText>
          </ul>
          <UploadDropzone
            label={t('dropHere')}
            orLabel={t('dropOr')}
            actionLabel={t('uploadFile')}
          />
        </div>
      </FieldsetBlock>
    </div>
  );
}

function AcademicRecordsBlock({
  records,
  t,
  tVis,
}: {
  records: VisibilityAcademicRecord[];
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
          <h4 className="absolute -top-3 end-4 bg-[#f8f8f0] px-1 text-base font-bold text-[#404943] dark:bg-home-stat-card dark:text-primary-100 min-[720px]:end-8">
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

          <UploadDropzone
            label={t('dropHere')}
            orLabel={t('dropOr')}
            actionLabel={t('uploadFile')}
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
      <div className="flex flex-wrap items-center justify-end gap-2">
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
  tVis,
}: {
  fields: VisibilityField[];
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
            />
          ))}
        </div>
      ) : null}
      {textareas.map((field) => (
        <ViewField
          key={field.id}
          field={field}
          label={tVis(`fields.${field.labelKey}`)}
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
      <legend className="absolute -top-3 end-4 max-w-[calc(100%-2rem)] bg-[#f8f8f0] px-1 text-sm font-bold text-[#404943] min-[720px]:end-8 min-[720px]:text-base dark:bg-home-stat-card dark:text-primary-100">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function UploadDropzone({
  label,
  orLabel,
  actionLabel,
  wide = false,
}: {
  label: string;
  orLabel: string;
  actionLabel: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex min-h-[220px] w-full flex-col items-center justify-center gap-1 rounded-2xl',
        'border border-dashed border-[#bfc9c1] px-4 py-8',
        'bg-transparent dark:border-auth-input-border',
        wide
          ? 'min-[720px]:max-w-[462px]'
          : 'min-[720px]:min-w-[240px] min-[720px]:max-w-[320px]'
      )}
    >
      <CloudUpload
        className="size-12 text-[#404943] dark:text-home-filter-muted"
        strokeWidth={1.5}
        aria-hidden
      />
      <p className="text-center text-xs font-medium text-[#404943] dark:text-home-filter-muted">
        {label}
      </p>
      <p className="text-center text-xs font-medium text-[#404943] dark:text-home-filter-muted">
        {orLabel}
      </p>
      <Button
        type="button"
        variant="outline"
        className={cn(
          'mt-1 h-12 !rounded-xl border-0 bg-[#ffdbcf] px-3 text-sm font-medium text-[#72351f] shadow-none',
          'hover:bg-[#ffdbcf]/80 hover:text-[#72351f]'
        )}
      >
        {actionLabel}
      </Button>
    </div>
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
    <li className="flex w-full items-start justify-end gap-2.5">
      <p
        className={cn(
          'text-justify text-sm font-medium leading-6',
          tone === 'muted'
            ? 'text-[#404943] dark:text-home-filter-muted'
            : 'text-[#171d19] dark:text-home-filter-ink'
        )}
      >
        {children}
      </p>
      <span
        aria-hidden
        className="mt-2 size-1.5 shrink-0 rounded-full bg-[#008d63]"
      />
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
          <h3 className="absolute -top-3 end-4 bg-[#f8f8f0] px-1 text-base font-semibold text-[#ba1a1a] dark:bg-home-stat-card">
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
      <span className="absolute -top-2 end-2 bg-[#f8f8f0] px-1 text-xs font-bold text-[#404943] dark:bg-home-stat-card dark:text-home-filter-muted">
        {label}
      </span>
      <p className="text-sm font-medium text-[#404943] dark:text-home-filter-ink">
        {value}
      </p>
    </div>
  );
}
