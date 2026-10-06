'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

type FilterActionsProps = {
  onClear: () => void;
  onApply: () => void;
};

/** Figma filter footer — «پاک کردن» (soft) then «اعمال فیلتر» (filled), at the end of the panel. */
export function FilterActions({ onClear, onApply }: FilterActionsProps) {
  const t = useTranslations('search.filter');

  return (
    <div className="flex items-center justify-end gap-2">
      <Button type="button" variant="soft" size="pillSm" onClick={onClear}>
        {t('clear')}
      </Button>
      <Button type="button" size="pillSm" onClick={onApply}>
        {t('apply')}
      </Button>
    </div>
  );
}
