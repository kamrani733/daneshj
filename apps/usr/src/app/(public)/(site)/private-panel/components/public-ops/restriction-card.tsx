'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { PublicPanelRestriction } from '@private-panel/data/public-ops-types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type RestrictionCardProps = {
  restriction: PublicPanelRestriction;
};

/** Fieldset-style restriction card — title on the red border. */
export function RestrictionCard({ restriction }: RestrictionCardProps) {
  const t = useTranslations('privatePanel.publicOps.restriction');
  const [requested, setRequested] = useState(false);

  return (
    <fieldset
      className={cn(
        'flex w-full flex-col gap-4 rounded-[20px] border border-error',
        'bg-home-card px-4 pb-4 pt-3 dark:bg-home-search-category',
        'min-[720px]:gap-6 min-[720px]:rounded-[28px] min-[720px]:px-8 min-[720px]:pb-6 min-[720px]:pt-4',
        'min-[834px]:px-12 min-[834px]:pb-7 min-[834px]:pt-5'
      )}
    >
      <legend className="ms-2 px-2 text-sm font-bold text-error min-[720px]:ms-4 min-[834px]:ms-6">
        {t(`titles.${restriction.titleKey}`)}
      </legend>

      <dl
        className={cn(
          'grid grid-cols-1 gap-4',
          'min-[720px]:grid-cols-3 min-[720px]:gap-8'
        )}
      >
        <div className="flex min-w-0 flex-col gap-1 text-start">
          <dt className="text-sm font-medium text-error">
            {t('periodLabel')}
          </dt>
          <dd className="text-sm font-medium leading-6 text-content dark:text-home-filter-ink">
            {restriction.period}
          </dd>
        </div>
        <div className="flex min-w-0 flex-col gap-1 text-start">
          <dt className="text-sm font-medium text-error">
            {t('scopeLabel')}
          </dt>
          <dd className="text-sm font-medium leading-6 text-content dark:text-home-filter-ink">
            {restriction.scope}
          </dd>
        </div>
        <div className="flex min-w-0 flex-col gap-1 text-start">
          <dt className="text-sm font-medium text-error">
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
        disabled={requested}
        onClick={() => {
          // TODO: call lift-restriction request API
          setRequested(true);
        }}
        className={cn(
          'h-11 w-full self-stretch !rounded-xl border-error bg-transparent px-5',
          'text-sm font-medium text-error shadow-none',
          'hover:bg-error-50 hover:text-error',
          'disabled:pointer-events-none disabled:opacity-50',
          'dark:border-error dark:text-error dark:hover:bg-error/10',
          'min-[720px]:w-auto min-[720px]:self-end min-[720px]:px-6'
        )}
      >
        {t('requestLift')}
      </Button>
    </fieldset>
  );
}
