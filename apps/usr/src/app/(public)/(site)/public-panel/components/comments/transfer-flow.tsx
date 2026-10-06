'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import type { PanelComment } from '@public-panel/types/ui';
import { AppDialog } from '@/components/ui/app-dialog';
import { QuotedCommentBlock } from '@public-panel/components/comments/quoted-comment-block';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

export const TRANSFER_LIMIT = 5;
const NOTE_MAX_LENGTH = 1500;

type TransferStep = 'form' | 'confirm' | 'limit' | 'exit' | 'success';

type CommentTransferFlowProps = {
  comment: PanelComment;
  transferredCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmTransfer: (note: string) => void;
  initialNote?: string;
  mode?: 'transfer' | 'edit';
};

/** Transfer-to-public-panel dialogs (انتقال icon / More menu). */
export function CommentTransferFlow({
  comment,
  transferredCount,
  open,
  onOpenChange,
  onConfirmTransfer,
  initialNote = '',
  mode = 'transfer',
}: CommentTransferFlowProps) {
  const t = useTranslations('publicPanel.comments.transferFlow');
  const tChar = useTranslations('publicPanel.comments');
  const [step, setStep] = useState<TransferStep>('form');
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    if (!open) return;
    setNote(initialNote);
    if (mode === 'edit') {
      setStep('form');
      return;
    }
    setStep(transferredCount >= TRANSFER_LIMIT ? 'limit' : 'form');
  }, [open, transferredCount, initialNote, mode]);

  function closeAll() {
    setNote('');
    onOpenChange(false);
  }

  return (
    <>
      <AppDialog
        open={open && step === 'form'}
        onOpenChange={(next) => {
          if (!next) {
            if (note.trim()) setStep('exit');
            else closeAll();
          }
        }}
        variant="content"
        title={t('submit')}
        description={t('notePlaceholder')}
        className="max-h-[90vh] max-w-[560px] overflow-y-auto sm:max-w-[560px]"
      >
        <header className="flex items-center gap-3">
          <Avatar className="size-11 shrink-0 ring-2 ring-primary dark:ring-primary-100">
            <AvatarFallback className="bg-primary text-sm font-bold text-white dark:bg-primary-100 dark:text-primary-900">
              صا
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5 text-start">
            <span className="text-sm font-bold text-app-filter-ink">
              {t('ownerName')}
            </span>
            <span className="text-xs text-neutral-600 dark:text-app-filter-muted">
              @{t('ownerHandle')}
            </span>
            <span className="text-xs text-neutral-600 dark:text-app-filter-muted">
              ۱۴۰۳/۱۲/۰۵
            </span>
            <span className="text-xs text-neutral-600 dark:text-app-filter-muted">
              ۱۴:۳۲
            </span>
          </div>
        </header>

        <div className="mt-4 flex flex-col gap-3">
          <label className="relative block">
            <textarea
              value={note}
              maxLength={NOTE_MAX_LENGTH}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t('notePlaceholder')}
              rows={3}
              className={cn(
                'w-full resize-none rounded-xl border bg-app-stat-card px-3 py-3 text-start text-sm leading-6 text-app-filter-ink',
                'placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                'dark:bg-app-search-category dark:text-app-filter-ink dark:placeholder:text-app-filter-muted',
                note.trim()
                  ? 'border-primary pb-8 dark:border-primary-100'
                  : 'border-border'
              )}
            />
            {note.trim() ? (
              <span className="pointer-events-none absolute bottom-3 end-3 text-[11px] text-neutral-600 dark:text-app-filter-muted">
                {tChar('charCount', {
                  count: formatFaNumber(note.length),
                  max: formatFaNumber(NOTE_MAX_LENGTH),
                })}
              </span>
            ) : null}
          </label>

          <QuotedCommentBlock comment={comment} />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-xs text-neutral-600 dark:text-app-filter-muted">
            {tChar('charCount', {
              count: formatFaNumber(note.length),
              max: formatFaNumber(NOTE_MAX_LENGTH),
            })}
          </span>
          <div dir="ltr" className="flex items-center gap-3">
            <Button
              type="button"
              className="h-10 rounded-lg px-4 dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-primary-100/90"
              onClick={() => {
                if (mode === 'edit') {
                  onConfirmTransfer(note.trim());
                  closeAll();
                  return;
                }
                setStep('confirm');
              }}
            >
              {t('submit')}
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto px-0 text-sm font-medium text-primary dark:text-primary-100"
              onClick={() => {
                if (note.trim()) setStep('exit');
                else closeAll();
              }}
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      </AppDialog>

      <AppDialog
        open={open && step === 'confirm'}
        onOpenChange={(next) => {
          if (!next) setStep('form');
        }}
        variant="confirm"
        title={t('confirmTitle', { limit: formatFaNumber(TRANSFER_LIMIT) })}
        primaryAction={{
          label: t('confirm'),
          onClick: () => {
            onConfirmTransfer(note.trim());
            setStep('success');
          },
        }}
        secondaryAction={{
          label: t('cancel'),
          onClick: () => setStep('form'),
        }}
      />

      <AppDialog
        open={open && step === 'limit'}
        onOpenChange={(next) => {
          if (!next) closeAll();
        }}
        variant="confirm"
        title={t('limitTitle')}
        primaryAction={{
          label: t('goToPanel'),
          href: '/public-panel',
          onClick: closeAll,
        }}
        secondaryAction={{ label: t('cancel'), onClick: closeAll }}
      />

      <AppDialog
        open={open && step === 'exit'}
        onOpenChange={(next) => {
          if (!next) setStep('form');
        }}
        variant="confirm"
        title={t('exitTitle')}
        actionsStyle="text"
        primaryAction={{ label: t('yes'), onClick: closeAll }}
        secondaryAction={{
          label: t('no'),
          onClick: () => setStep('form'),
        }}
      />

      <AppDialog
        open={open && step === 'success'}
        onOpenChange={(next) => {
          if (!next) closeAll();
        }}
        variant="confirm"
        title={t('successTitle')}
        actionsStyle="text"
        primaryAction={{ label: t('close'), onClick: closeAll }}
      />
    </>
  );
}
