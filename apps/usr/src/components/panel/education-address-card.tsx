'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { BorderedSectionCard } from './bordered-section-card';
import type { PanelEducationAddress } from './types';

type EducationAddressCardProps = {
  address: PanelEducationAddress;
  title?: string;
  className?: string;
  titleBgClassName?: string;
};

export function EducationAddressCard({
  address,
  title,
  className,
  titleBgClassName = 'bg-app-scene',
}: EducationAddressCardProps) {
  const t = useTranslations('panel.educationAddress');

  return (
    <BorderedSectionCard
      title={title ?? t('title')}
      titleBgClassName={titleBgClassName}
      titleClassName="text-sm font-medium text-app-filter-muted dark:text-app-filter-ink"
      className={cn(
        'rounded-xl border-border bg-app-search-fill px-6 pb-5 pt-8 dark:bg-app-search-category',
        className
      )}
    >
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 min-[720px]:grid-cols-4">
        <AddressField label={t('country')} value={address.country} />
        <AddressField label={t('province')} value={address.province} />
        <AddressField label={t('city')} value={address.city} />
        <AddressField label={t('district')} value={address.district} />
      </dl>
    </BorderedSectionCard>
  );
}

function AddressField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <dt className="text-xs font-medium leading-5 text-neutral-600 dark:text-app-filter-muted">
        {label}
      </dt>
      <dd className="text-sm font-bold leading-5 text-app-filter-ink">
        {value || '\u00a0'}
      </dd>
    </div>
  );
}
