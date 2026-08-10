'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import fa from '@messages/fa.json';
import {
  MOCK_HAS_PUBLIC_PANEL,
  MOCK_PUBLIC_PANEL_RESTRICTIONS,
} from '@private-panel/data/public-ops-mock';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { OpsConfirmDialog } from './ops-confirm-dialog';
import { RestrictionCard } from './restriction-card';

const COPY = fa.privatePanel.publicOps.createDelete;

type DialogStep = 'confirm' | 'success';

/** Create or delete public panel — confirm → success; API later in handlers. */
export function CreateDeletePanel() {
  const t = useTranslations('privatePanel.publicOps.createDelete');
  const hasPanel = MOCK_HAS_PUBLIC_PANEL;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>('confirm');

  const paragraphs = hasPanel ? COPY.deleteParagraphs : COPY.createParagraphs;

  function openConfirm() {
    setStep('confirm');
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setStep('confirm');
  }

  function handleConfirm() {
    // TODO: call create / delete request API, then:
    setStep('success');
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <section
        className={cn(
          'flex flex-col gap-6 rounded-2xl border border-border bg-home-card p-5',
          'dark:bg-home-search-category',
          'min-[834px]:p-6'
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
          className={cn(
            'h-12 w-full self-end !rounded-full border-0 px-8 text-sm font-medium text-white shadow-none',
            'min-[720px]:w-auto',
            hasPanel
              ? 'bg-warning hover:bg-warning/90'
              : 'bg-primary hover:bg-primary/90'
          )}
        >
          {hasPanel ? t('requestDelete') : t('requestCreate')}
        </Button>
      </section>

      <div className="flex flex-col gap-4">
        {MOCK_PUBLIC_PANEL_RESTRICTIONS.map((restriction) => (
          <RestrictionCard key={restriction.id} restriction={restriction} />
        ))}
      </div>

      <OpsConfirmDialog
        open={dialogOpen}
        step={step}
        confirmTitle={hasPanel ? t('deleteConfirm') : t('createConfirm')}
        confirmAction={hasPanel ? t('deleteAction') : t('createAction')}
        cancelLabel={t('cancel')}
        successTitle={hasPanel ? t('deleteSuccess') : t('createSuccess')}
        closeLabel={t('close')}
        onConfirm={handleConfirm}
        onClose={closeDialog}
      />
    </div>
  );
}
