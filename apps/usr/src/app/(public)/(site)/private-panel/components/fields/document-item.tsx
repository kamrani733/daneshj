'use client';

import { FileText, Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import type {
  DocumentItemModel,
  DocumentKind,
  DocumentReviewDecision,
} from '@private-panel/types/documents';

type DocumentItemProps = {
  item: DocumentItemModel;
  onCancel?: (id: string) => void;
  onRemove?: (id: string) => void;
  onDecisionChange?: (id: string, decision: DocumentReviewDecision) => void;
  className?: string;
};

function FileKindIcon({ kind, name }: { kind: DocumentKind; name?: string }) {
  const isJpeg = /\.jpe?g$/i.test(name ?? '');
  if (kind === 'pdf') {
    return (
      <span
        className="flex h-7 min-w-8 shrink-0 items-center justify-center rounded bg-error-50 px-1 text-[10px] font-bold text-error"
        aria-hidden
      >
        PDF
      </span>
    );
  }
  if (kind === 'image' || isJpeg) {
    return (
      <span
        className="flex h-7 min-w-9 shrink-0 items-center justify-center rounded bg-error-50 px-1 text-[10px] font-bold text-error"
        aria-hidden
      >
        JPEG
      </span>
    );
  }
  return (
    <FileText
      className="size-8 shrink-0 text-app-filter-muted"
      strokeWidth={1.5}
      aria-hidden
    />
  );
}

export function DocumentItem({
  item,
  onCancel,
  onRemove,
  onDecisionChange,
  className,
}: DocumentItemProps) {
  const t = useTranslations('privatePanel.fields.documents');
  const isError = item.state === 'error';
  const showProgress = item.state === 'uploading' || item.state === 'error';
  const progress = Math.max(0, Math.min(100, item.progress ?? 0));

  if (item.state === 'review') {
    return (
      <div
        dir="rtl"
        className={cn('flex w-full flex-col items-stretch gap-2', className)}
      >
        <div
          className={cn(
            'flex h-14 items-center gap-3 rounded-xl border border-border',
            'bg-app-card px-3 dark:border-auth-input-border dark:bg-app-search-category'
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <FileKindIcon kind={item.kind} name={item.name} />
            <span className="truncate text-sm font-medium text-content dark:text-app-filter-ink">
              {item.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onRemove?.(item.id)}
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-lg border',
              'border-neutral-300 bg-transparent text-app-filter-muted',
              'dark:border-auth-input-border dark:text-app-filter-muted'
            )}
            aria-label={t('remove')}
          >
            <Trash2 className="size-4" strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex items-center justify-start gap-5 px-1">
          <DecisionRadio
            name={`doc-review-${item.id}`}
            label={t('approve')}
            checked={item.decision === 'approve'}
            tone="approve"
            onChange={() => onDecisionChange?.(item.id, 'approve')}
          />
          <DecisionRadio
            name={`doc-review-${item.id}`}
            label={t('reject')}
            checked={item.decision === 'reject'}
            tone="reject"
            onChange={() => onDecisionChange?.(item.id, 'reject')}
          />
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className={cn('flex w-full flex-col gap-1', className)}>
      <div
        className={cn(
          'flex h-14 items-center gap-3 rounded-xl border px-3',
          'bg-app-card dark:border-auth-input-border dark:bg-app-search-category',
            isError ? 'border-error' : 'border-border'
        )}
      >
        <div className="flex min-w-0 max-w-[45%] items-center gap-2">
          <FileKindIcon kind={item.kind} name={item.name} />
          <span className="truncate text-sm font-medium text-content dark:text-app-filter-ink">
            {item.name}
          </span>
        </div>

        {showProgress ? (
          <div className="min-w-0 flex-1 px-1">
            <div className="h-3 w-full overflow-hidden rounded-full bg-warning-50 dark:bg-warning/25">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300 dark:bg-primary-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1" />
        )}

        <button
          type="button"
          onClick={() =>
            item.state === 'uploading'
              ? onCancel?.(item.id)
              : onRemove?.(item.id)
          }
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg border bg-transparent',
            isError
              ? 'border-error text-error'
              : 'border-neutral-300 text-app-filter-muted dark:border-auth-input-border dark:text-app-filter-muted'
          )}
          aria-label={
            item.state === 'uploading' ? t('cancel') : t('remove')
          }
        >
          {item.state === 'uploading' ? (
            <X className="size-4" strokeWidth={2} />
          ) : (
            <Trash2 className="size-4" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {isError ? (
        <p className="text-start text-xs font-medium text-error">
          {t(item.errorKey ?? 'maxSize')}
        </p>
      ) : null}
    </div>
  );
}

function DecisionRadio({
  name,
  label,
  checked,
  tone,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  tone: 'approve' | 'reject';
  onChange: () => void;
}) {
  const isReject = tone === 'reject';

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <span
        className={cn(
          'text-sm font-medium',
          checked
            ? isReject
              ? 'text-error'
              : 'text-primary dark:text-primary-100'
            : 'text-app-filter-muted'
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          'flex size-5 items-center justify-center rounded-full border-2',
          checked
            ? isReject
              ? 'border-error'
              : 'border-primary dark:border-primary-100'
            : 'border-neutral-600 dark:border-app-filter-muted'
        )}
      >
        <input
          type="radio"
          name={name}
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        {checked ? (
          <span
            className={cn(
              'size-2.5 rounded-full',
              isReject ? 'bg-error' : 'bg-primary dark:bg-primary-100'
            )}
          />
        ) : null}
      </span>
    </label>
  );
}
