'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { SearchSelect } from '@/components/ui/search-select';
import { cn } from '@/lib/utils';

import { useComparisonFieldOptions, withDependentsCleared } from '@operational-panel/hooks/use-comparison-field-options';
import type { ComparisonField, ComparisonFilters, ComparisonGroupId } from '@operational-panel/types/charts';

/** Figma column order (start → end); stacks to fewer columns on smaller screens. */
const FIELD_COLUMNS: ComparisonField[][] = [
  ['gender', 'userType', 'liveCountry', 'liveProvince', 'liveCity'],
  ['eduCountry', 'eduProvince', 'eduCity', 'university'],
  ['studyStatus', 'degree', 'academicGroup', 'major'],
];

type ComparisonFilterPanelProps = {
  group: ComparisonGroupId;
  filters: ComparisonFilters;
  onApply: (filters: ComparisonFilters) => void;
};

/** «تنظیم فیلترها — گروه A/B»: 13 selects, «اعمال فیلتر» enabled once something changed. */
export function ComparisonFilterPanel({ group, filters, onApply }: ComparisonFilterPanelProps) {
  const t = useTranslations('operationalPanel.charts.comparison');
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState<ComparisonFilters>(filters);
  const options = useComparisonFieldOptions(draft);
  const bodyId = useId();

  useEffect(() => setDraft(filters), [filters, group]);

  const changed = JSON.stringify(draft) !== JSON.stringify(filters);
  const setField = (field: ComparisonField, value: string | null) =>
    setDraft((current) => {
      const next = withDependentsCleared(current, field);
      if (value) next[field] = value;
      else delete next[field];
      return next;
    });

  return (
    <div className="flex flex-col gap-4 rounded-medium py-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center justify-between gap-3 border-b border-outline-variant px-1 pb-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden className={cn('size-2 rounded-full', group === 'a' ? 'bg-primary' : 'bg-secondary')} />
          <span className="text-title-small font-bold text-on-surface">{t('panelTitle', { group: t(`groups.${group}`) })}</span>
        </span>
        <ChevronDown className={cn('size-6 text-on-surface-variant transition-transform', open && 'rotate-180')} aria-hidden />
      </button>

      {open ? (
        <div id={bodyId} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-x-3 gap-y-4 min-[600px]:grid-cols-2 min-[1000px]:grid-cols-3">
            {FIELD_COLUMNS.map((column, columnIndex) => (
              <div key={columnIndex} className="contents min-[1000px]:flex min-[1000px]:flex-col min-[1000px]:gap-4">
                {column.map((field) => (
                  <SearchSelect
                    key={field}
                    label={t(`fields.${field}`)}
                    options={options[field]}
                    value={draft[field] ?? null}
                    onValueChange={(value) => setField(field, value)}
                    clearLabel={t('clearField', { field: t(`fields.${field}`) })}
                    emptyLabel={t('noOptions')}
                    disabled={options[field].length === 0}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="link" onClick={() => setDraft({})} className="h-auto px-0">
              <span className="text-label-large">{t('clear')}</span>
            </Button>
            <Button type="button" size="pillSm" disabled={!changed} onClick={() => onApply(draft)}>
              {t('apply')}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
