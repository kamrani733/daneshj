import { ChevronDown, ChevronUp, FileText, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { PendingFieldRequest } from '@private-panel/api';
import { EmptyState } from '@/components/panel';
import { Button } from '@/components/ui/button';
import {
  OutlinedDisplayField,
  OutlinedTextareaField,
  OutlinedTextField,
} from '@/components/ui/outlined-field';
import { cn } from '@/lib/utils';

import type { ReviewDecision } from '@private-panel/utils/fields-section-utils';

function fileNameFromPath(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  try {
    const url = new URL(trimmed);
    return decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() ?? trimmed);
  } catch {
    return decodeURIComponent(trimmed.split('/').filter(Boolean).pop() ?? trimmed);
  }
}

function isImagePath(value: string) {
  return /\.(avif|gif|jpe?g|png|webp)$/i.test(value.split('?')[0] ?? '');
}

function isPdfPath(value: string) {
  return /\.pdf$/i.test(value.split('?')[0] ?? '');
}

function ReviewFilePreview({ value }: { value: string }) {
  const name = fileNameFromPath(value);
  const isPdf = isPdfPath(value);

  return (
    <div className="flex h-12 min-w-0 items-center gap-2 rounded-lg border border-[#bfc9c1] bg-home-card px-3 dark:border-auth-input-border dark:bg-home-search-category">
      {isPdf ? (
        <span className="flex h-7 min-w-8 shrink-0 items-center justify-center rounded bg-[#fce8e6] px-1 text-[10px] font-bold text-[#ba1a1a]">
          PDF
        </span>
      ) : (
        <FileText
          className="size-7 shrink-0 text-[#404943] dark:text-home-filter-muted"
          strokeWidth={1.5}
          aria-hidden
        />
      )}
      <span className="truncate text-sm font-medium text-content dark:text-home-filter-ink">
        {name || value || '\u00a0'}
      </span>
    </div>
  );
}

function ReviewPhotoPreview({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-[#bfc9c1] bg-home-card p-3 dark:border-auth-input-border dark:bg-home-search-category">
      {value && isImagePath(value) ? (
        <img
          src={value}
          alt={label}
          className="size-32 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="max-w-full truncate text-sm font-medium text-[#707973]">
          {value || '\u00a0'}
        </span>
      )}
    </div>
  );
}

export function ReviewPendingList({
  requests,
  decisions,
  reviewValues,
  onDecisionChange,
  onReviewValueChange,
  onReviewValueReset,
  isSaving,
  formError,
  onSave,
  onCancel,
  t,
  tVis,
}: {
  requests: PendingFieldRequest[];
  decisions: Record<string, ReviewDecision>;
  reviewValues: Record<string, string>;
  onDecisionChange: (requestKey: string, decision: ReviewDecision) => void;
  onReviewValueChange: (request: PendingFieldRequest, value: string) => void;
  onReviewValueReset: (request: PendingFieldRequest) => void;
  isSaving: boolean;
  formError: string | null;
  onSave: () => void;
  onCancel: () => void;
  t: ReturnType<typeof useTranslations>;
  tVis: ReturnType<typeof useTranslations>;
}) {
  const [expandedRecords, setExpandedRecords] = useState<Record<string, boolean>>(
    {},
  );

  if (requests.length === 0) {
    return (
      <EmptyState
        message={t('reviewEmpty')}
        imageSrc="/images/private-panel/Emptystate1.svg"
        className="min-h-[360px] rounded-none bg-transparent dark:bg-transparent"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-4">
        {requests.map((request) => {
          const label = request.labelKey
            ? tVis(`fields.${request.labelKey}`)
            : request.apiField;
          const draftValue = reviewValues[request.requestKey] ?? request.newValue;
          const edited = draftValue !== request.newValue;
          const decision = edited
            ? 'approve'
            : decisions[request.requestKey];
          const recordKey = request.academicRecord?.key;
          const recordExpanded = recordKey
            ? Boolean(expandedRecords[recordKey])
            : false;
          const isCreateRecord = request.requestType === 2;

          return (
            <li
              key={request.requestKey}
              className={cn(
                'mx-auto w-full max-w-[1000px] rounded-xl border border-[#dbd8d1] bg-[#f8f8f0]',
                'px-4 pb-6 pt-4 dark:border-auth-input-border dark:bg-home-stat-card',
                'min-[720px]:rounded-2xl min-[720px]:px-6 min-[720px]:pb-7 min-[720px]:pt-5',
              )}
            >
              {isCreateRecord && request.academicRecord ? (
                <div className="flex flex-col gap-4">
                  {request.academicRecord.fields.map((field) => {
                    const fieldLabel = field.labelKey
                      ? tVis(`fields.${field.labelKey}`)
                      : field.apiField;

                    return (
                      <div
                        key={field.apiField}
                        className="grid grid-cols-1 gap-y-5 min-[720px]:grid-cols-2 min-[720px]:gap-x-[100px] min-[834px]:gap-x-[158px]"
                      >
                        <div className="flex flex-col gap-3">
                          <p className="text-start text-xs font-bold text-[#404943] dark:text-home-filter-muted">
                            {t('previousValue')}
                          </p>
                          <OutlinedDisplayField
                            label={fieldLabel}
                            value={field.previousValue || t('emptyValue')}
                            surfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                            labelSurfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <p className="text-start text-xs font-bold text-[#404943] dark:text-home-filter-muted">
                            {t('newValue')} ({t('reviewPendingLabel')})
                          </p>
                          <OutlinedDisplayField
                            label={fieldLabel}
                            value={field.value || t('emptyValue')}
                            tone="warning"
                            surfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                            labelSurfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  className={cn(
                    'grid grid-cols-1 gap-y-5',
                    request.kind === 'textarea'
                      ? 'gap-5'
                      : 'gap-x-[100px] min-[720px]:grid-cols-2 min-[834px]:gap-x-[158px]',
                  )}
                >
                  <div className="flex flex-col gap-3">
                    <p className="text-start text-xs font-bold text-[#404943] dark:text-home-filter-muted">
                      {t('previousValue')}
                    </p>
                    {request.kind === 'photo' ? (
                      <ReviewPhotoPreview
                        value={request.previousValue}
                        label={label}
                      />
                    ) : request.renderAsFile ? (
                      <ReviewFilePreview value={request.previousValue} />
                    ) : (
                      <OutlinedDisplayField
                        label={label}
                        value={request.previousValue || t('emptyValue')}
                        multiline={request.kind === 'textarea'}
                        surfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                        labelSurfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                        endAdornment={
                          request.kind === 'textarea' ? undefined : (
                            <ChevronDown
                              className="size-5 text-[#404943] dark:text-home-filter-muted"
                              strokeWidth={1.75}
                              aria-hidden
                            />
                          )
                        }
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-start text-xs font-bold text-[#404943] dark:text-home-filter-muted">
                      {t('newValue')} ({t('reviewPendingLabel')})
                    </p>
                    {request.kind === 'photo' ? (
                      <div className="flex flex-col gap-3">
                        <ReviewPhotoPreview value={draftValue} label={label} />
                        <OutlinedTextField
                          label={label}
                          value={draftValue}
                          tone="warning"
                          surfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                          labelSurfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                          onValueChange={(value) =>
                            onReviewValueChange(request, value)
                          }
                        />
                      </div>
                    ) : request.renderAsFile ? (
                      <ReviewFilePreview value={draftValue} />
                    ) : request.kind === 'textarea' ? (
                      <OutlinedTextareaField
                        label={label}
                        value={draftValue}
                        tone="warning"
                        surfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                        labelSurfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                        onValueChange={(value) =>
                          onReviewValueChange(request, value)
                        }
                      />
                    ) : (
                      <OutlinedTextField
                        label={label}
                        value={draftValue}
                        tone="warning"
                        surfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                        labelSurfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                        onValueChange={(value) =>
                          onReviewValueChange(request, value)
                        }
                      />
                    )}
                  </div>
                </div>
              )}

              {edited ? (
                <div className="mt-3 flex flex-col items-start gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onReviewValueReset(request)}
                    className="h-8 gap-1 px-0 text-xs font-medium text-primary shadow-none hover:bg-transparent hover:text-primary/80"
                  >
                    <RefreshCw className="size-4" strokeWidth={1.75} aria-hidden />
                    {t('reviewReset')}
                  </Button>
                  <p className="text-start text-xs font-medium text-[#404943] dark:text-home-filter-muted">
                    {t('reviewRejectDisabled')}
                  </p>
                </div>
              ) : null}

              {!isCreateRecord && request.academicRecord && recordKey ? (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedRecords((prev) => ({
                        ...prev,
                        [recordKey]: !prev[recordKey],
                      }))
                    }
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80"
                  >
                    {recordExpanded ? (
                      <ChevronUp className="size-4" aria-hidden />
                    ) : (
                      <ChevronDown className="size-4" aria-hidden />
                    )}
                    {recordExpanded
                      ? t('hideAllRecordFields')
                      : t('showAllRecordFields')}
                  </button>
                  {recordExpanded ? (
                    <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl border border-[#dbd8d1] bg-transparent p-4 dark:border-auth-input-border min-[720px]:grid-cols-2">
                      {request.academicRecord.fields.map((field) => (
                        <OutlinedDisplayField
                          key={field.apiField}
                          label={
                            field.labelKey
                              ? tVis(`fields.${field.labelKey}`)
                              : field.apiField
                          }
                          value={field.value || t('emptyValue')}
                          tone={field.pending ? 'warning' : 'default'}
                          surfaceClassName="bg-transparent"
                          labelSurfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-5 flex items-center justify-end gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <span
                    className={cn(
                      decision === 'approve'
                        ? 'text-[#008d63]'
                        : 'text-[#404943]',
                    )}
                  >
                    {t('documents.approve')}
                  </span>
                  <input
                    type="radio"
                    name={`review-${request.requestKey}`}
                    checked={decision === 'approve'}
                    className="size-5 accent-[#008d63]"
                    onChange={() =>
                      onDecisionChange(request.requestKey, 'approve')
                    }
                  />
                </label>
                <label
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium',
                    edited ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                  )}
                >
                  <span
                    className={cn(
                      decision === 'reject'
                        ? 'text-[#ba1a1a]'
                        : 'text-[#404943]',
                    )}
                  >
                    {t('documents.reject')}
                  </span>
                  <input
                    type="radio"
                    name={`review-${request.requestKey}`}
                    disabled={edited}
                    checked={decision === 'reject'}
                    className="size-5 accent-[#ba1a1a]"
                    onChange={() => onDecisionChange(request.requestKey, 'reject')}
                  />
                </label>
              </div>
            </li>
          );
        })}
      </ul>

      {formError ? (
        <p role="alert" className="text-sm font-medium text-error">
          {formError}
        </p>
      ) : null}

      <div className="flex w-full flex-col-reverse gap-3 min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-end min-[720px]:gap-[88px]">
        <Button
          type="button"
          variant="ghost"
          disabled={isSaving}
          onClick={onCancel}
          className="h-12 w-full px-4 text-base font-bold text-primary shadow-none hover:bg-transparent hover:text-primary/80 min-[720px]:w-auto"
        >
          {t('cancel')}
        </Button>
        <Button
          type="button"
          loading={isSaving}
          disabled={isSaving}
          onClick={onSave}
          className="h-14 w-full !rounded-2xl bg-primary px-8 text-base font-bold text-white shadow-none hover:bg-primary/90 min-[720px]:w-[160px]"
        >
          {t('save')}
        </Button>
      </div>
    </div>
  );
}
