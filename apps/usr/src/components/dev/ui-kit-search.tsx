'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { CompactMediaCard } from '@/components/cards';
import { Checkbox } from '@/components/ui/checkbox';
import { NoResultState } from '@/components/ui/no-result-state';
import { SearchField } from '@/components/ui/search-field';
import { SearchSelect } from '@/components/ui/search-select';

const SAMPLE_IMAGE = '/images/public-panel/catalog/portfolio-shop.jpg';
const SAMPLE_AVATAR = '/images/public-panel/avatar.png';

/** `/dev/ui-kit` demos — SearchField clear, SearchSelect, Checkbox, CompactMediaCard, NoResultState. */
export function UiKitSearch() {
  const t = useTranslations('uiKit');
  const [query, setQuery] = useState(t('selectOptionA'));
  const [service, setService] = useState<string | null>(null);
  const options = [
    { value: 'a', label: t('selectOptionA') },
    { value: 'b', label: t('selectOptionB') },
    { value: 'c', label: t('selectOptionC') },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-large border border-outline-variant bg-surface-container-lowest p-4">
      <h3 className="text-title-medium font-bold text-on-surface">
        {t('groupSearch')}
      </h3>

      <SearchField
        label={t('searchClearSample')}
        placeholder={t('searchClearSample')}
        size="xl"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClear={() => setQuery('')}
        clearLabel={t('searchClearLabel')}
        containerClassName="max-w-180"
      />

      <div className="grid grid-cols-1 gap-4 rounded-medium bg-surface-container-low p-4 min-[640px]:grid-cols-2">
        <SearchSelect
          label={t('selectLabel')}
          options={options}
          value={service}
          onValueChange={setService}
          clearLabel={t('selectClear')}
          emptyLabel={t('selectEmpty')}
        />
        <SearchSelect
          label={t('selectLabel')}
          options={options}
          value="a"
          onValueChange={() => undefined}
          clearLabel={t('selectClear')}
          emptyLabel={t('selectEmpty')}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-3 text-body-medium text-on-surface">
          <Checkbox defaultChecked />
          {t('checkboxChecked')}
        </label>
        <label className="flex items-center gap-3 text-body-medium text-on-surface">
          <Checkbox checked="indeterminate" />
          {t('checkboxIndeterminate')}
        </label>
        <label className="flex items-center gap-3 text-body-medium text-on-surface">
          <Checkbox />
          {t('checkboxUnchecked')}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 min-[640px]:grid-cols-2">
        <CompactMediaCard
          title={t('cardTitle')}
          subtitle={t('cardSubtitle')}
          imageSrc={SAMPLE_IMAGE}
        />
        <CompactMediaCard
          tone="accent"
          title={t('cardUserName')}
          subtitle={t('cardUsername')}
          imageSrc={SAMPLE_AVATAR}
        />
      </div>

      <NoResultState message={t('noResultSample')} />
    </div>
  );
}
