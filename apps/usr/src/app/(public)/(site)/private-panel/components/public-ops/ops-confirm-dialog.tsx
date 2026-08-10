'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ConfirmStepProps = {
  open: boolean;
  step: 'confirm' | 'success';
  confirmTitle: string;
  confirmAction: string;
  cancelLabel: string;
  successTitle: string;
  closeLabel: string;
  onConfirm: () => void;
  onClose: () => void;
};

/** Two-step confirm → success dialog (API hooked later in onConfirm). */
export function OpsConfirmDialog({
  open,
  step,
  confirmTitle,
  confirmAction,
  cancelLabel,
  successTitle,
  closeLabel,
  onConfirm,
  onClose,
}: ConfirmStepProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <AlertDialogContent
        dir="rtl"
        className={cn(
          'max-w-sm gap-6 rounded-2xl border-0 bg-home-search-fill p-6 text-right',
          'shadow-home-elevation-2 ring-0 dark:bg-home-stat-card'
        )}
      >
        {step === 'confirm' ? (
          <>
            <AlertDialogHeader className="place-items-start text-right sm:text-right">
              <AlertDialogTitle className="text-sm font-medium leading-7 text-home-filter-ink">
                {confirmTitle}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-0 flex-row justify-start gap-3 border-0 bg-transparent p-0 sm:justify-start">
              <AlertDialogCancel
                variant="ghost"
                className="h-auto border-0 bg-transparent px-2 py-2 text-sm font-medium text-primary shadow-none hover:bg-transparent hover:text-primary"
              >
                {cancelLabel}
              </AlertDialogCancel>
              <AlertDialogAction
                className="h-10 rounded-full bg-primary px-6 text-sm font-medium text-white hover:bg-primary/90"
                onClick={(event) => {
                  event.preventDefault();
                  onConfirm();
                }}
              >
                {confirmAction}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader className="place-items-start text-right sm:text-right">
              <AlertDialogTitle className="text-sm font-medium leading-7 text-home-filter-ink">
                {successTitle}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-0 flex-row justify-end border-0 bg-transparent p-0 sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                className="h-auto border-0 bg-transparent px-2 py-2 text-sm font-medium text-primary shadow-none hover:bg-transparent hover:text-primary"
                onClick={onClose}
              >
                {closeLabel}
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
