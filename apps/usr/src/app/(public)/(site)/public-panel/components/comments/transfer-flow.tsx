'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import type { PanelComment } from '@public-panel/data/public-panel-ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
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

/** Transfer-to-public-panel dialogs opened from comment More menu. */
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
      <Dialog
        open={open && step === 'form'}
        onOpenChange={(next) => {
          if (!next) {
            if (note.trim()) setStep('exit');
            else closeAll();
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          dir="rtl"
          className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl border-0 bg-[#F8F8F0] p-5 shadow-home-elevation-2 sm:max-w-[560px]"
        >
          <DialogTitle className="sr-only">{t('submit')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('notePlaceholder')}
          </DialogDescription>

          <header className="flex items-center gap-3">
            <Avatar className="size-11 shrink-0 ring-2 ring-[#008D63]">
              <AvatarFallback className="bg-[#008D63] text-sm font-bold text-white">
                صا
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5 text-start">
              <span className="text-sm font-bold text-[#171D19]">
                {t('ownerName')}
              </span>
              <span className="text-xs text-[#707973]">@{t('ownerHandle')}</span>
              <span className="text-xs text-[#707973]">۱۴۰۳/۱۲/۰۵</span>
              <span className="text-xs text-[#707973]">۱۴:۳۲</span>
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
                  'w-full resize-none rounded-xl border bg-white px-3 py-3 text-start text-sm leading-6 text-[#171D19]',
                  'placeholder:text-[#707973] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                  note.trim() ? 'border-primary pb-8' : 'border-[#BFC9C1]'
                )}
              />
              {note.trim() ? (
                <span className="pointer-events-none absolute bottom-3 end-3 text-[11px] text-[#707973]">
                  {tChar('charCount', {
                    count: formatFaNumber(note.length),
                    max: formatFaNumber(NOTE_MAX_LENGTH),
                  })}
                </span>
              ) : null}
            </label>

            <QuotedComment comment={comment} />
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-xs text-[#707973]">
              {tChar('charCount', {
                count: formatFaNumber(note.length),
                max: formatFaNumber(NOTE_MAX_LENGTH),
              })}
            </span>
            <div dir="ltr" className="flex items-center gap-3">
              <Button
                type="button"
                className="h-10 rounded-lg px-4"
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
                className="h-auto px-0 text-sm font-medium text-primary"
                onClick={() => {
                  if (note.trim()) setStep('exit');
                  else closeAll();
                }}
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CommentConfirmDialog
        open={open && step === 'confirm'}
        title={t('confirmTitle', { limit: formatFaNumber(TRANSFER_LIMIT) })}
        primaryLabel={t('confirm')}
        secondaryLabel={t('cancel')}
        onPrimary={() => {
          onConfirmTransfer(note.trim());
          setStep('success');
        }}
        onSecondary={() => setStep('form')}
      />

      <CommentConfirmDialog
        open={open && step === 'limit'}
        title={t('limitTitle')}
        primaryLabel={t('goToPanel')}
        secondaryLabel={t('cancel')}
        primaryAsLink="/public-panel"
        onPrimary={closeAll}
        onSecondary={closeAll}
      />

      <CommentConfirmDialog
        open={open && step === 'exit'}
        title={t('exitTitle')}
        primaryLabel={t('yes')}
        secondaryLabel={t('no')}
        textActions
        actionsDir="rtl"
        onPrimary={closeAll}
        onSecondary={() => setStep('form')}
      />

      <CommentConfirmDialog
        open={open && step === 'success'}
        title={t('successTitle')}
        primaryLabel={t('close')}
        textActions
        singleAction
        onPrimary={closeAll}
      />
    </>
  );
}

function QuotedComment({ comment }: { comment: PanelComment }) {
  const name = comment.originalAuthorName ?? comment.authorName;
  const handle = comment.originalAuthorHandle ?? comment.authorHandle;

  return (
    <div className="rounded-xl border border-[#008D63] bg-[rgba(0,141,99,0.1)] p-4">
      <div className="flex items-center gap-2.5">
        <Avatar className="size-10 shrink-0">
          {comment.authorAvatar && !comment.originalAuthorName ? (
            <AvatarImage src={comment.authorAvatar} alt={name} />
          ) : null}
          <AvatarFallback className="bg-[#707973] text-xs font-bold text-white">
            {name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-bold text-[#171D19]">
          {name} @{handle}
        </span>
      </div>
      <p className="mt-3 text-start text-sm leading-[1.5] text-[#171D19]">
        {comment.body}
      </p>
    </div>
  );
}

export function CommentConfirmDialog({
  open,
  title,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryAsLink,
  textActions,
  singleAction,
  actionsDir = 'ltr',
}: {
  open: boolean;
  title: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  primaryAsLink?: string;
  textActions?: boolean;
  singleAction?: boolean;
  actionsDir?: 'ltr' | 'rtl';
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) (onSecondary ?? onPrimary)();
      }}
    >
      <DialogContent
        showCloseButton={false}
        dir="rtl"
        className="w-full max-w-[420px] gap-6 rounded-2xl border-0 bg-[#F8F8F0] p-5 shadow-home-elevation-2 sm:max-w-[420px]"
      >
        <DialogTitle className="text-start text-sm font-medium leading-6 text-[#171D19]">
          {title}
        </DialogTitle>
        <DialogDescription className="sr-only">{title}</DialogDescription>

        <div dir={actionsDir} className="flex items-center gap-3">
          {primaryAsLink ? (
            <Button asChild className="h-10 rounded-full px-5">
              <Link href={primaryAsLink} onClick={onPrimary}>
                {primaryLabel}
              </Link>
            </Button>
          ) : textActions ? (
            <Button
              type="button"
              variant="link"
              className="h-auto px-0 text-sm font-medium text-primary"
              onClick={onPrimary}
            >
              {primaryLabel}
            </Button>
          ) : (
            <Button
              type="button"
              className="h-10 rounded-lg px-5"
              onClick={onPrimary}
            >
              {primaryLabel}
            </Button>
          )}
          {!singleAction && secondaryLabel && onSecondary ? (
            <Button
              type="button"
              variant="link"
              className="h-auto px-0 text-sm font-medium text-primary"
              onClick={onSecondary}
            >
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
