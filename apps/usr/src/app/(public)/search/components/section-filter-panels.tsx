'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { ChecklistFilterPanel } from '@search/components/checklist-filter-panel';
import { useSearchServiceTree } from '@search/hooks/use-search-queries';
import {
  PROVIDER_TYPE_IDS,
  USER_TYPE_IDS,
  isProviderTypeId,
  isUserTypeId,
  type ProviderTypeId,
  type UserTypeId,
} from '@search/types';

/** «سرویس‌ها» — services tree («دسته بندی های اصلی و فرعی»), 1 / 2 / 3 columns. */
export function ServiceFilterPanel({
  value,
  onApply,
}: {
  value: string[];
  onApply: (serviceCategories: string[]) => void;
}) {
  const t = useTranslations('search.filterGroups');
  const tree = useSearchServiceTree();

  return (
    <ChecklistFilterPanel
      groupLabel={t('serviceCategories')}
      options={tree.data ?? []}
      layout="tree"
      loading={tree.isPending}
      value={value}
      onApply={onApply}
    />
  );
}

/** «سرویس دهنده‌ها» — حقیقی (انفرادی) / حقوقی. */
export function ProviderFilterPanel({
  value,
  onApply,
}: {
  value: ProviderTypeId[];
  onApply: (providerTypes: ProviderTypeId[]) => void;
}) {
  const t = useTranslations('search');
  const options = useMemo(
    () =>
      PROVIDER_TYPE_IDS.map((id) => ({ id, label: t(`providerTypes.${id}`) })),
    [t],
  );

  return (
    <ChecklistFilterPanel
      groupLabel={t('filterGroups.providerType')}
      options={options}
      layout="compact"
      value={value}
      onApply={(ids) => onApply(ids.filter(isProviderTypeId))}
    />
  );
}

/** «کاربران» — membership types. */
export function UserFilterPanel({
  value,
  onApply,
}: {
  value: UserTypeId[];
  onApply: (userTypes: UserTypeId[]) => void;
}) {
  const t = useTranslations('search');
  const options = useMemo(
    () => USER_TYPE_IDS.map((id) => ({ id, label: t(`userTypes.${id}`) })),
    [t],
  );

  return (
    <ChecklistFilterPanel
      groupLabel={t('filterGroups.userType')}
      options={options}
      layout="compact"
      value={value}
      onApply={(ids) => onApply(ids.filter(isUserTypeId))}
    />
  );
}
