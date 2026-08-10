'use client';

import { useTranslations } from 'next-intl';

import type { PublicPanelRestriction } from '@private-panel/data/public-ops-mock';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type RestrictionCardProps = {
  restriction: PublicPanelRestriction;
};

/** Fieldset-style restriction card — title on the red border. */
export function RestrictionCard({ restriction }: RestrictionCardProps) {
  const t = useTranslations('privatePanel.publicOps.restriction');

  return (
    <fieldset
      className={cn(
        'flex w-full flex-col gap-5 rounded-xl border border-error px-5 pb-5 pt-2',
        'bg-home-card dark:bg-home-search-category',
        'min-[834px]:gap-6 min-[834px]:px-6 min-[834px]:pb-6'
      )}
    >
      <legend className="px-2 text-sm font-bold text-error">
        {t(`titles.${restriction.titleKey}`)}
      </legend>

      <dl
        className={cn(
          'grid grid-cols-1 gap-4',
          'min-[720px]:grid-cols-3 min-[720px]:gap-6'
        )}
      >
        <div className="flex flex-col gap-1.5 text-start">
          <dt className="text-sm font-medium text-home-filter-muted">
            {t('periodLabel')}
          </dt>
          <dd className="text-sm font-medium leading-6 text-content dark:text-home-filter-ink">
            {restriction.period}
          </dd>
        </div>
        <div className="flex flex-col gap-1.5 text-start">
          <dt className="text-sm font-medium text-home-filter-muted">
            {t('scopeLabel')}
          </dt>
          <dd className="text-sm font-medium leading-6 text-content dark:text-home-filter-ink">
            {restriction.scope}
          </dd>
        </div>
        <div className="flex flex-col gap-1.5 text-start">
          <dt className="text-sm font-medium text-home-filter-muted">
            {t('reasonLabel')}
          </dt>
          <dd className="text-sm font-medium leading-6 text-content dark:text-home-filter-ink">
            {restriction.reason}
          </dd>
        </div>
      </dl>

      <Button
        type="button"
        variant="outline"
        className={cn(
          'h-11 w-full self-end rounded-full border-error bg-transparent px-6',
          'text-sm font-medium text-error shadow-none',
          'hover:bg-error-50 hover:text-error',
          'dark:border-error dark:text-error dark:hover:bg-error/10',
          'min-[720px]:w-auto'
        )}
      >
        {t('requestLift')}
      </Button>
    </fieldset>
  );
}
