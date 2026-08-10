'use client';

import { AppDialog } from '@/components/ui/app-dialog';

type ConfirmStepProps = {
  open: boolean;
  step: 'confirm' | 'success';
  confirmTitle: string;
  confirmAction: string;
  cancelLabel: string;
  successTitle: string;
  closeLabel: string;
  errorMessage?: string | null;
  confirming?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

/** Two-step confirm → success via shared AppDialog. */
export function OpsConfirmDialog({
  open,
  step,
  confirmTitle,
  confirmAction,
  cancelLabel,
  successTitle,
  closeLabel,
  errorMessage,
  confirming = false,
  onConfirm,
  onClose,
}: ConfirmStepProps) {
  const isConfirm = step === 'confirm';
  const title = isConfirm
    ? errorMessage?.trim() || confirmTitle
    : successTitle;

  return (
    <AppDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      variant="confirm"
      title={title}
      primaryAction={
        isConfirm
          ? {
              label: confirmAction,
              onClick: confirming ? undefined : onConfirm,
            }
          : { label: closeLabel, onClick: onClose }
      }
      secondaryAction={
        isConfirm ? { label: cancelLabel } : undefined
      }
    />
  );
}
