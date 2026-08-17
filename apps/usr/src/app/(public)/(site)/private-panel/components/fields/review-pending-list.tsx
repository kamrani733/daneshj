import { Loader2, Stamp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { PendingFieldRequest } from '@private-panel/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { ReviewDecision } from './fields-section-utils';

export function ReviewPendingList({
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
  decisions: Record<number, ReviewDecision>;
  onDecisionChange: (requestId: number, decision: ReviewDecision) => void;
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
                      : 'text-[#404943]',
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
                      : 'text-[#404943]',
                  )}
                >
                  {t('documents.reject')}
                </span>
                <input
                  type="radio"
                  name={`review-${request.requestId}`}
                  checked={decisions[request.requestId] === 'reject'}
                  onChange={() => onDecisionChange(request.requestId, 'reject')}
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
