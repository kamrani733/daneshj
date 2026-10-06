'use client';

import { useState } from 'react';

import { Spinner } from '@/components/ui/spinner';

import { CategoryFilterList } from '@search/components/category-filter-list';
import { FilterActions } from '@search/components/filter-actions';
import { FilterGroup } from '@search/components/filter-group';
import type { SearchCategoryOption } from '@search/types';

type ChecklistFilterPanelProps = {
  /** Collapsible group title. */
  groupLabel: string;
  options: SearchCategoryOption[];
  layout: 'tree' | 'compact';
  /** Applied selection (from the URL; stable while the URL is unchanged). */
  value: string[];
  onApply: (value: string[]) => void;
  loading?: boolean;
};

/**
 * Filter panel of سرویس‌ها, سرویس دهنده‌ها and کاربران: one collapsible checklist + actions.
 * Selection stays in a draft until «اعمال فیلتر».
 */
export function ChecklistFilterPanel({
  groupLabel,
  options,
  layout,
  value,
  onApply,
  loading = false,
}: ChecklistFilterPanelProps) {
  const [draft, setDraft] = useState<string[]>(value);
  const appliedKey = value.join(',');
  const [syncedKey, setSyncedKey] = useState(appliedKey);

  // This filter changed in the URL (apply, clear, back button) → reset the draft. Keyed by
  // content so other URL changes (query, other sections) keep unsaved selections.
  if (appliedKey !== syncedKey) {
    setSyncedKey(appliedKey);
    setDraft(value);
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-6 pt-1">
      <FilterGroup label={groupLabel}>
        {loading ? (
          <div className="flex h-12 items-center">
            <Spinner className="size-5 text-primary" />
          </div>
        ) : (
          <CategoryFilterList
            options={options}
            value={draft}
            onChange={setDraft}
            layout={layout}
          />
        )}
      </FilterGroup>
      <FilterActions
        onClear={() => {
          setDraft([]);
          onApply([]);
        }}
        onApply={() => onApply(draft)}
      />
    </div>
  );
}
