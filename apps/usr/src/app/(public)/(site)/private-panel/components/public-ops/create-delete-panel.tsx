'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import fa from '@messages/fa.json';
import {
  ACTOR_TYPE_NAME,
  getActorApiErrorMessage,
  usePublicPanelStatusByOwnerQuery,
  useRequestPublicPanelChangeStatusMutation,
} from '@private-panel/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { OpsConfirmDialog } from './ops-confirm-dialog';

const COPY = fa.privatePanel.publicOps.createDelete;

type DialogStep = 'confirm' | 'success';

type CreateDeletePanelProps = {
  accessToken?: string | null;
  targetActorId?: number | null;
};

export function CreateDeletePanel({
  accessToken,
  targetActorId,
}: CreateDeletePanelProps) {
  const t = useTranslations('privatePanel.publicOps.createDelete');
  const statusQuery = usePublicPanelStatusByOwnerQuery({
    accessToken,
    actorId: targetActorId,
  });
  const requestMutation = useRequestPublicPanelChangeStatusMutation();

  const hasPanel = Boolean(statusQuery.data?.isPublicPanelActive);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>('confirm');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const paragraphs = hasPanel ? COPY.deleteParagraphs : COPY.createParagraphs;

  function openConfirm() {
    if (requestSubmitted || requestMutation.isPending) return;
    setErrorMessage(null);
    setStep('confirm');
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setStep('confirm');
    setErrorMessage(null);
  }

  async function handleConfirm() {
    if (requestMutation.isPending) return;
    setErrorMessage(null);
    try {
      await requestMutation.mutateAsync({
        accessToken,
        actorType: ACTOR_TYPE_NAME.user,
        actorId: targetActorId,
        action: hasPanel ? 'DELETE' : 'CREATE',
      });
      setRequestSubmitted(true);
      setStep('success');
    } catch (error) {
      setErrorMessage(
        getActorApiErrorMessage(
          error,
          hasPanel ? t('deleteConfirm') : t('createConfirm')
        )
      );
    }
  }

  return (
    <div className="flex w-full flex-col gap-4 min-[720px]:gap-6">
      <section
        className={cn(
          'flex flex-col gap-5 rounded-2xl border border-border bg-home-card p-4',
          'dark:bg-home-search-category',
          'min-[720px]:gap-6 min-[720px]:p-5 min-[834px]:p-6'
        )}
      >
        <ul className="flex list-disc flex-col gap-3 pe-5 text-justify text-sm font-medium leading-7 text-home-filter-muted marker:text-home-filter-muted dark:text-home-filter-ink">
          {paragraphs.map((paragraph) => (
            <li key={paragraph}>{paragraph}</li>
          ))}
        </ul>

        <Button
          type="button"
          onClick={openConfirm}
          disabled={
            requestSubmitted ||
            requestMutation.isPending ||
            statusQuery.isLoading ||
            !accessToken
          }
          className={cn(
            'h-11 w-full self-stretch !rounded-full border-0 px-5 text-sm font-medium text-white shadow-none',
            'min-[720px]:h-12 min-[720px]:w-auto min-[720px]:self-end min-[720px]:px-8',
            'disabled:pointer-events-none disabled:opacity-50',
            hasPanel
              ? 'bg-warning hover:bg-warning/90'
              : 'bg-primary hover:bg-primary/90'
          )}
        >
          {hasPanel ? t('requestDelete') : t('requestCreate')}
        </Button>
      </section>

      <OpsConfirmDialog
        open={dialogOpen}
        step={step}
        confirmTitle={hasPanel ? t('deleteConfirm') : t('createConfirm')}
        confirmAction={hasPanel ? t('deleteAction') : t('createAction')}
        cancelLabel={t('cancel')}
        successTitle={hasPanel ? t('deleteSuccess') : t('createSuccess')}
        closeLabel={t('close')}
        errorMessage={errorMessage}
        confirming={requestMutation.isPending}
        onConfirm={() => {
          void handleConfirm();
        }}
        onClose={closeDialog}
      />
    </div>
  );
}
