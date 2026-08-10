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
  onConfirm,
  onClose,
}: ConfirmStepProps) {
  const isConfirm = step === 'confirm';

  return (
    <AppDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      variant="confirm"
      title={isConfirm ? confirmTitle : successTitle}
      primaryAction={
        isConfirm
          ? { label: confirmAction, onClick: onConfirm }
          : { label: closeLabel, onClick: onClose }
      }
      secondaryAction={
        isConfirm ? { label: cancelLabel } : undefined
      }
    />
  );
}
