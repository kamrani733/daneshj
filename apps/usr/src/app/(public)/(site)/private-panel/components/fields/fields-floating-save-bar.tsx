'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FieldsFloatingSaveBarProps = {
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
  disabled?: boolean;
};

export function FieldsFloatingSaveBar({
  onCancel,
  onSave,
  saving = false,
  disabled = false,
}: FieldsFloatingSaveBarProps) {
  const t = useTranslations('privatePanel.fields');

  return (
    <div
      role="region"
      aria-label={t('floatingActions')}
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center',
        'px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2',
        'min-[834px]:hidden'
      )}
    >
      <div
        className={cn(
          'pointer-events-auto flex w-full max-w-[920px] items-center gap-3',
          'rounded-full bg-app-search-category px-4 py-2.5 shadow-app-elevation-2',
          'dark:border dark:border-auth-input-border dark:bg-app-search-category'
        )}
      >
        <p className="min-w-0 flex-1 text-start text-xs font-medium leading-5 text-content min-[720px]:text-sm dark:text-app-filter-ink">
          {t('dirtyHint')}
        </p>
        <button
          type="button"
          disabled={saving}
          onClick={onCancel}
          className="shrink-0 px-1 text-sm font-medium text-primary dark:text-primary-100 hover:underline disabled:opacity-60 dark:text-primary-100"
        >
          {t('cancel')}
        </button>
        <Button
          type="button"
          disabled={disabled || saving}
          onClick={onSave}
          className={cn(
            'h-10 shrink-0 !rounded-xl bg-primary px-5 text-sm font-medium text-white shadow-none',
            'hover:bg-primary/90 disabled:opacity-60',
            'dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-primary-100/90'
          )}
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            t('saveShort')
          )}
        </Button>
      </div>
    </div>
  );
}
