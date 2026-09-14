'use client';

import {
  VISIBILITY_CATEGORIES,
  type VisibilityCategoryId,
} from '@private-panel/data/visibility-config';
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
import { AppDialog } from '@/components/ui/app-dialog';
import {
  AdminEditIntroBullets,
  IntroBullets,
  ModeTabs,
  OwnerReviewIntroBullets,
  ReviewIntroBullets,
} from './fields-section-header';
import { FieldsLimitationsSection } from './fields-limitations-section';
import { ReviewPendingList } from './review-pending-list';
import { useFieldsSectionController } from '@private-panel/hooks/use-fields-section-controller';
import type { FieldsMode } from '@private-panel/utils/fields-section-utils';
import { useState } from 'react';

type FieldsSectionProps = {
  accessToken?: string | null;
  targetActorId?: number | null;
  username: string;
};

export function FieldsSection({
  accessToken,
  targetActorId,
  username,
}: FieldsSectionProps) {
  const vm = useFieldsSectionController({ accessToken, targetActorId });
  const [leaveReviewOpen, setLeaveReviewOpen] = useState(false);

  function requestModeChange(next: FieldsMode) {
    if (vm.mode === 'review' && next === 'view' && vm.hasPendingReview) {
      setLeaveReviewOpen(true);
      return;
    }
    vm.setMode(next);
  }

  function confirmLeaveReview() {
    vm.review.onCancel();
    vm.setMode('view');
    setLeaveReviewOpen(false);
  }

  return (
    <div
      dir="rtl"
      className={cn(
        'flex w-full flex-col gap-6 text-start',
        vm.mode === 'view' && vm.isDirty && 'pb-24 min-[834px]:pb-0',
      )}
    >
      <ModeTabs mode={vm.mode} onModeChange={requestModeChange} t={vm.t} />

      {vm.mode === 'review' ? (
        targetActorId ? (
          <ReviewIntroBullets t={vm.t} username={username} />
        ) : (
          <OwnerReviewIntroBullets t={vm.t} />
        )
      ) : targetActorId ? (
        <AdminEditIntroBullets t={vm.t} />
      ) : (
        <IntroBullets t={vm.t} />
      )}

      <Tabs
        value={vm.category}
        onValueChange={(value) =>
          vm.setCategory(value as VisibilityCategoryId)
        }
        dir="rtl"
        className="flex w-full flex-col"
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-3xl border-2 border-border',
            'bg-transparent dark:border-auth-input-border dark:bg-app-card',
            vm.isFieldsLoading && 'min-h-[320px]',
          )}
        >
          {vm.isFieldsLoading ? (
            <PanelLoadingOverlay
              message={vm.t('loading')}
              className="bg-app-search-fill/85 dark:bg-app-card/80"
            />
          ) : null}

          <CategoryTabs
            pendingCounts={vm.pendingCounts}
            tVis={vm.tVis}
          />

          {VISIBILITY_CATEGORIES.map((id) => (
            <TabsContent key={id} value={id} className="mt-0">
              {id !== vm.category ? null : (
                <div
                  className={cn(
                    'flex flex-col gap-8 px-4 py-6',
                    'min-[720px]:gap-12 min-[720px]:px-[42px] min-[720px]:py-12',
                    'min-[834px]:px-[68px]',
                  )}
                >
                  {vm.mode === 'review' ? (
                    <ReviewPendingList
                      requests={vm.review.requests}
                      decisions={vm.review.decisions}
                      reviewValues={vm.review.values}
                      onDecisionChange={vm.review.onDecisionChange}
                      onReviewValueChange={vm.review.onValueChange}
                      onReviewValueReset={vm.review.onValueReset}
                      isSaving={vm.isSaving}
                      formError={vm.formError}
                      onSave={vm.review.onSave}
                      onCancel={vm.review.onCancel}
                      t={vm.t}
                      tVis={vm.tVis}
                    />
                  ) : (
                    <FieldsEditView
                      accessToken={accessToken}
                      vm={vm}
                      showPending={Boolean(targetActorId)}
                    />
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {vm.mode === 'view' && vm.isDirty ? (
        <FieldsFloatingSaveBar
          disabled={!accessToken}
          saving={vm.isSaving}
          onCancel={vm.onCancel}
          onSave={() => {
            void vm.onSave();
          }}
        />
      ) : null}

      <FieldsLimitationsSection accessToken={accessToken} t={vm.t} />

      <AppDialog
        open={leaveReviewOpen}
        onOpenChange={setLeaveReviewOpen}
        variant="confirm"
        title={vm.t('reviewIncompleteTitle')}
        actionsStyle="text"
        primaryAction={{
          label: vm.t('reviewIncompleteYes'),
          tone: 'destructive',
          onClick: confirmLeaveReview,
        }}
        secondaryAction={{
          label: vm.t('reviewIncompleteNo'),
          tone: 'muted',
        }}
      />
    </div>
  );
}

type FieldsController = ReturnType<typeof useFieldsSectionController>;

function CategoryTabs({
  pendingCounts,
  tVis,
}: {
  pendingCounts: FieldsController['pendingCounts'];
  tVis: FieldsController['tVis'];
}) {
  return (
    <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <TabsList
        className={cn(
          'flex h-14 w-max min-w-full items-stretch justify-start gap-0',
          'rounded-none border-b border-app-carousel-inactive bg-transparent p-0',
          'min-[720px]:h-16 dark:border-auth-input-border',
        )}
      >
        {VISIBILITY_CATEGORIES.map((id) => (
          <TabsTrigger
            key={id}
            value={id}
            className={cn(
              'h-full shrink-0 rounded-none border-0 border-b-2 border-transparent px-3',
              'justify-center text-xs font-medium text-app-filter-muted shadow-none',
              'hover:text-content focus-visible:ring-primary/30',
              'data-[state=active]:border-b-primary data-[state=active]:bg-app-search-fill',
              'data-[state=active]:font-bold data-[state=active]:text-content',
              'data-[state=active]:shadow-none',
              'dark:text-app-filter-ink dark:data-[state=active]:bg-app-search-category',
              'dark:data-[state=active]:border-b-primary-100 dark:data-[state=active]:text-primary-100',
              'min-[720px]:px-4 min-[720px]:text-sm',
            )}
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              {tVis(`categories.${id}`)}
              {pendingCounts[id] ? (
                <span className="size-2 rounded-full bg-error" />
              ) : null}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}

function FieldsEditView({
  accessToken,
  vm,
  showPending,
}: {
  accessToken?: string | null;
  vm: FieldsController;
  showPending: boolean;
}) {
  return (
    <>
      {vm.sections.map((section) => {
        const sectionFields = vm.categoryFields.filter(
          (field) => field.section === section.key,
        );

        if (section.key === 'identity') {
          return (
            <IdentityCategoryBlocks
              key={section.key}
              fields={sectionFields}
              editable={vm.editable}
              showPending={showPending}
              values={vm.values}
              fieldErrors={vm.fieldErrors}
              onChange={vm.onFieldChange}
              onPhotoPick={vm.onPhotoPick}
              onSharePhotos={vm.onSharePhotos}
              onSharedPhotoPick={vm.onSharedPhotoPick}
              t={vm.t}
              tVis={vm.tVis}
            />
          );
        }

        if (section.key === 'academicRecords') {
          return (
            <AcademicRecordsBlock
              key={section.key}
              records={vm.records}
              documents={vm.academicDocuments}
              onDocumentsChange={vm.setAcademicDocuments}
              onUploadFile={vm.canUploadFiles ? vm.uploadDocumentFile : undefined}
              editable={vm.editable}
              onSubmitRecord={(payload) => vm.submitAcademicRecord(payload)}
              t={vm.t}
              tVis={vm.tVis}
            />
          );
        }

        if (section.key === 'provider') {
          return (
            <ProviderBlocks
              key={section.key}
              fields={sectionFields}
              editable={vm.editable}
              showPending={showPending}
              values={vm.values}
              fieldErrors={vm.fieldErrors}
              onChange={vm.onFieldChange}
              documents={vm.providerDocuments}
              onDocumentsChange={vm.setProviderDocuments}
              onUploadFile={vm.canUploadFiles ? vm.uploadDocumentFile : undefined}
              t={vm.t}
              tVis={vm.tVis}
            />
          );
        }

        if (sectionFields.length === 0) return null;

        return (
          <FieldsetBlock
            key={section.key}
            title={vm.tVis(`sections.${section.titleKey}`)}
          >
            <FieldGrid
              fields={sectionFields}
              editable={vm.editable}
              showPending={showPending}
              values={vm.values}
              fieldErrors={vm.fieldErrors}
              onChange={vm.onFieldChange}
              tVis={vm.tVis}
            />
          </FieldsetBlock>
        );
      })}

      {vm.formError ? (
        <p role="alert" className="text-sm font-medium text-error">
          {vm.formError}
        </p>
      ) : null}

      <div className="hidden flex-wrap items-center justify-end gap-3 min-[834px]:flex">
        {vm.isDirty ? (
          <Button
            type="button"
            variant="outline"
            disabled={vm.isSaving}
            onClick={vm.onCancel}
            className="ml-10 h-12 max-w-[160px] border-none !rounded-2xl px-4 text-base font-medium text-primary shadow-none dark:text-primary-100"
          >
            {vm.t('cancel')}
          </Button>
        ) : null}
        <Button
          type="button"
          disabled={!accessToken || vm.isSaving || !vm.isDirty}
          onClick={() => void vm.onSave()}
          className={cn(
            'h-12 w-full max-w-[220px] gap-2 !rounded-2xl bg-primary',
            'px-4 text-base font-medium text-white shadow-none',
            'hover:bg-primary/90 disabled:opacity-60',
            'dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-primary-100/90',
          )}
        >
          {vm.isSaving ? vm.t('saving') : vm.t('save')}
        </Button>
      </div>
    </>
  );
}
