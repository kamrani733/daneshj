import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { PendingFieldRequest } from '@private-panel/api';
import { Button } from '@/components/ui/button';
import {
  OutlinedDisplayField,
  OutlinedTextareaField,
  OutlinedTextField,
} from '@/components/ui/outlined-field';
import { cn } from '@/lib/utils';

import type { ReviewDecision } from '@private-panel/utils/fields-section-utils';

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
  decisions: Record<number, ReviewDecision>;
  reviewValues: Record<number, string>;
  onDecisionChange: (requestId: number, decision: ReviewDecision) => void;
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
      <p className="text-sm font-medium leading-6 text-[#404943] dark:text-home-filter-muted">
        {t('reviewEmpty')}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-4">
        {requests.map((request) => {
          const label = request.labelKey
            ? tVis(`fields.${request.labelKey}`)
            : request.apiField;
          const draftValue = reviewValues[request.requestId] ?? request.newValue;
          const edited = draftValue !== request.newValue;
          const decision = edited
            ? 'approve'
            : decisions[request.requestId];
          const recordKey = request.academicRecord?.key;
          const recordExpanded = recordKey
            ? Boolean(expandedRecords[recordKey])
            : false;

          return (
            <li
              key={request.requestId}
              className={cn(
                'rounded-xl border border-[#dbd8d1] bg-[#f8f8f0]',
                'px-4 pb-6 pt-4 dark:border-auth-input-border dark:bg-home-stat-card',
                'min-[720px]:rounded-2xl min-[720px]:px-6 min-[720px]:pb-7 min-[720px]:pt-4',
              )}
            >
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
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-start text-xs font-bold text-[#404943] dark:text-home-filter-muted">
                    {t('newValue')} ({t('reviewPendingLabel')})
                  </p>
                  {request.kind === 'textarea' ? (
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

              {edited ? (
                <div className="mt-3 flex flex-col items-start gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onReviewValueReset(request)}
                    className="h-8 px-0 text-xs font-medium text-primary shadow-none hover:bg-transparent hover:text-primary/80"
                  >
                    {t('reviewReset')}
                  </Button>
                  <p className="text-start text-xs font-medium text-[#404943] dark:text-home-filter-muted">
                    {t('reviewRejectDisabled')}
                  </p>
                </div>
              ) : null}

              {request.academicRecord && recordKey ? (
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
                    name={`review-${request.requestId}`}
                    checked={decision === 'approve'}
                    className="size-5 accent-[#008d63]"
                    onChange={() =>
                      onDecisionChange(request.requestId, 'approve')
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
                    name={`review-${request.requestId}`}
                    disabled={edited}
                    checked={decision === 'reject'}
                    className="size-5 accent-[#ba1a1a]"
                    onChange={() => onDecisionChange(request.requestId, 'reject')}
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
