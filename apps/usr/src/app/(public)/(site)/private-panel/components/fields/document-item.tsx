'use client';

import { FileImage, FileText, Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

export type DocumentKind = 'pdf' | 'image' | 'other';

export type DocumentReviewDecision = 'approve' | 'reject' | null;

export type DocumentItemState = 'uploading' | 'error' | 'done' | 'review';

export type DocumentItemModel = {
  id: string;
  name: string;
  kind: DocumentKind;
  state: DocumentItemState;
  progress?: number;
  errorKey?: 'maxSize';
  decision?: DocumentReviewDecision;
};

type DocumentItemProps = {
  item: DocumentItemModel;
  onCancel?: (id: string) => void;
  onRemove?: (id: string) => void;
  onDecisionChange?: (id: string, decision: DocumentReviewDecision) => void;
  className?: string;
};

function FileKindIcon({ kind }: { kind: DocumentKind }) {
  if (kind === 'pdf') {
    return (
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded bg-[#fce8e6] text-[10px] font-bold text-[#ba1a1a]"
        aria-hidden
      >
        PDF
      </span>
    );
  }
  if (kind === 'image') {
    return (
      <FileImage
        className="size-8 shrink-0 text-[#e06333]"
        strokeWidth={1.5}
        aria-hidden
      />
    );
  }
  return (
    <FileText
      className="size-8 shrink-0 text-[#404943]"
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
            'flex h-12 items-center justify-start gap-2 rounded-xl border border-[#bfc9c1]',
            'bg-transparent px-3 dark:border-auth-input-border'
          )}
        >
          <FileKindIcon kind={item.kind} />
          <span className="truncate text-sm font-medium text-[#171d19] dark:text-home-filter-ink">
            {item.name}
          </span>
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
          'bg-transparent dark:border-auth-input-border',
          isError ? 'border-[#ba1a1a]' : 'border-[#bfc9c1]'
        )}
      >
        <div className="flex min-w-0 max-w-[45%] items-center gap-2">
          <FileKindIcon kind={item.kind} />
          <span className="truncate text-sm font-medium text-[#171d19] dark:text-home-filter-ink">
            {item.name}
          </span>
        </div>

        {showProgress ? (
          <div className="min-w-0 flex-1 px-1">
            <div className="h-3 w-full overflow-hidden rounded-full bg-[#ffdbcf]">
              <div
                className="h-full rounded-full bg-[#008d63] transition-[width] duration-300"
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
            item.state === 'done' ? onRemove?.(item.id) : onCancel?.(item.id)
          }
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full border',
            isError
              ? 'border-[#ba1a1a] text-[#ba1a1a]'
              : 'border-[#707973] text-[#404943] dark:border-auth-input-border dark:text-home-filter-muted'
          )}
          aria-label={item.state === 'done' ? t('remove') : t('cancel')}
        >
          {item.state === 'done' ? (
            <Trash2 className="size-4" strokeWidth={1.75} />
          ) : (
            <X className="size-4" strokeWidth={2} />
          )}
        </button>
      </div>

      {isError ? (
        <p className="text-start text-xs font-medium text-[#ba1a1a]">
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
              ? 'text-[#ba1a1a]'
              : 'text-[#008d63]'
            : 'text-[#404943]'
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          'flex size-5 items-center justify-center rounded-full border-2',
          checked
            ? isReject
              ? 'border-[#ba1a1a]'
              : 'border-[#008d63]'
            : 'border-[#707973]'
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
              isReject ? 'bg-[#ba1a1a]' : 'bg-[#008d63]'
            )}
          />
        ) : null}
      </span>
    </label>
  );
}
