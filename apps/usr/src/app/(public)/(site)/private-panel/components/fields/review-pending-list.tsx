import { ChevronDown, ChevronUp, Loader2, Stamp } from 'lucide-react';
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

import type { ReviewDecision } from './fields-section-utils';

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
              className="rounded-2xl border border-[#dbd8d1] bg-[#f8f8f0] p-4 dark:border-auth-input-border dark:bg-home-stat-card min-[720px]:p-6"
            >
              <div className="grid grid-cols-1 gap-5 min-[720px]:grid-cols-2 min-[720px]:gap-8">
                <OutlinedDisplayField
                  label={t('previousValue')}
                  value={request.previousValue || t('emptyValue')}
                  multiline={request.kind === 'textarea'}
                  surfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                  labelSurfaceClassName="bg-[#f8f8f0] dark:bg-home-stat-card"
                />
                {request.kind === 'textarea' ? (
                  <OutlinedTextareaField
                    label={`${t('newValue')} (${t('reviewPendingLabel')})`}
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
                    label={`${t('newValue')} (${t('reviewPendingLabel')})`}
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

              <p className="mt-2 text-start text-xs font-medium text-[#404943] dark:text-home-filter-muted">
                {label}
              </p>

              {edited ? (
                <div className="mt-3 flex flex-col items-start gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onReviewValueReset(request)}
                    className="h-9 px-0 text-sm font-medium text-primary shadow-none hover:bg-transparent hover:text-primary/80"
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

              <div className="mt-4 flex items-center justify-start gap-5">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
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
                    onChange={() =>
                      onDecisionChange(request.requestId, 'approve')
                    }
                  />
                </label>
                <label
                  className={cn(
                    'flex items-center gap-2 text-sm',
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
