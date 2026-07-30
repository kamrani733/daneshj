'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

type SettingsFloatingActionsProps = {
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
};

/**
 * Figma Floating container — cream pill at bottom; Save + Cancel on the start edge.
 * Shown only when settings are dirty.
 */
export function SettingsFloatingActions({
  onCancel,
  onSave,
  saving = false,
}: SettingsFloatingActionsProps) {
  const t = useTranslations('notifications.settings');

  return (
    <div
      role="region"
      aria-label={t('floatingActions')}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2"
    >
      <div className="pointer-events-auto flex w-full max-w-[1364px] items-center justify-end gap-3 rounded-2xl bg-home-search-category px-4 py-3 shadow-home-elevation-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={saving}
          className="h-10 rounded-lg px-4 text-sm font-medium text-primary hover:bg-black/5 hover:text-primary dark:text-primary-100 dark:hover:bg-white/5"
        >
          {t('cancel')}
        </Button>
        <Button
          type="button"
          onClick={onSave}
          loading={saving}
          className="h-10 min-w-[96px] rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t('save')}
        </Button>
      </div>
    </div>
  );
}
