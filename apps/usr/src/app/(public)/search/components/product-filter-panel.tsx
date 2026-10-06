'use client';

import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { SearchSelect } from '@/components/ui/search-select';
import { Spinner } from '@/components/ui/spinner';

import { CategoryFilterList } from '@search/components/category-filter-list';
import { FilterActions } from '@search/components/filter-actions';
import {
  useSearchCategoryOptions,
  useSearchServiceTree,
} from '@search/hooks/use-search-queries';
import type { SearchProductFilter } from '@search/types';
import { leafOptions } from '@search/utils/category-tree';

type ProductFilterPanelProps = {
  /** Applied service (from the URL). */
  service: string | null;
  /** Applied leaf category ids (from the URL; stable while the URL is unchanged). */
  categories: string[];
  onApply: (filter: SearchProductFilter) => void;
};

const EMPTY_FILTER: SearchProductFilter = { service: null, categories: [] };

/**
 * Figma «محصولات» filter: service picker + hint (one row from tablet up), then the categories of
 * the picked service (1 / 2 / 3 columns). Changes stay in a draft until «اعمال فیلتر».
 */
export function ProductFilterPanel({
  service,
  categories: appliedCategories,
  onApply,
}: ProductFilterPanelProps) {
  const t = useTranslations('search.productFilter');
  const [draft, setDraft] = useState<SearchProductFilter>({
    service,
    categories: appliedCategories,
  });
  const serviceTree = useSearchServiceTree();
  const categories = useSearchCategoryOptions(draft.service);

  const appliedKey = `${service ?? ''}|${appliedCategories.join(',')}`;
  const [syncedKey, setSyncedKey] = useState(appliedKey);

  // This filter changed in the URL (apply, clear, back button) → reset the draft. Keyed by
  // content so other URL changes (query, other sections) keep unsaved selections.
  if (appliedKey !== syncedKey) {
    setSyncedKey(appliedKey);
    setDraft({ service, categories: appliedCategories });
  }

  const serviceOptions = useMemo(
    () =>
      leafOptions(serviceTree.data ?? []).map((option) => ({
        value: option.id,
        label: option.label,
      })),
    [serviceTree.data],
  );

  return (
    <div className="flex flex-col gap-6 px-4 pb-6 pt-5">
      <div className="grid grid-cols-1 items-center gap-x-6 gap-y-3 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3">
        <SearchSelect
          label={t('serviceLabel')}
          options={serviceOptions}
          value={draft.service}
          onValueChange={(next) => setDraft({ service: next, categories: [] })}
          clearLabel={t('clearService')}
          emptyLabel={t('noServiceMatch')}
          loading={serviceTree.isPending}
        />
        <p className="flex items-center gap-2 text-primary min-[1024px]:col-span-2">
          <Info className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="text-label-large">
            {draft.service ? t('hintServiceChange') : t('hintPickService')}
          </span>
        </p>
      </div>

      {draft.service && categories.isPending ? (
        <div className="flex h-12 items-center">
          <Spinner className="size-5 text-primary" />
        </div>
      ) : null}
      {draft.service && categories.data && categories.data.length > 0 ? (
        <CategoryFilterList
          options={categories.data}
          value={draft.categories}
          onChange={(next) =>
            setDraft((current) => ({ ...current, categories: next }))
          }
        />
      ) : null}

      <FilterActions
        onClear={() => {
          setDraft(EMPTY_FILTER);
          onApply(EMPTY_FILTER);
        }}
        onApply={() => onApply(draft)}
      />
    </div>
  );
}
