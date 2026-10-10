'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FilterAltIcon } from '@/components/icons/material-icons';
import { cn } from '@/lib/utils';

import type { ComparisonField, ComparisonGroupId } from '@operational-panel/types/charts';

export type GroupChip = { field: ComparisonField; label: string };

type GroupCardProps = {
  group: ComparisonGroupId;
  chips: GroupChip[];
  editing: boolean;
  onEdit: () => void;
  onRemove: (field: ComparisonField) => void;
};

const TONE = {
  a: {
    badge: 'bg-primary-container text-primary',
    chip: 'bg-primary-container text-on-primary-container',
    empty: 'border-primary bg-primary-container/40 text-primary',
  },
  b: {
    badge: 'bg-secondary-container text-secondary',
    chip: 'bg-secondary-container text-on-secondary-container',
    empty: 'border-secondary bg-secondary-container/40 text-secondary',
  },
} as const;

/** «گروه A / B» card: group badge, «فیلترها» button, removable filter chips or the dashed empty hint. */
export function ComparisonGroupCard({ group, chips, editing, onEdit, onRemove }: GroupCardProps) {
  const t = useTranslations('operationalPanel.charts.comparison');
  const tone = TONE[group];

  return (
    <section
      aria-label={t(`groups.${group}`)}
      className="flex flex-col gap-4 rounded-medium bg-surface-container-lowest p-4 shadow-app-elevation-1"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={cn('rounded-small px-2 py-1 font-bold', tone.badge)}>
          {/* Type token outside `cn()`: tailwind-merge reads custom sizes as colours. */}
          <span className="text-title-small">{t(`groups.${group}`)}</span>
        </span>
        <button
          type="button"
          aria-pressed={editing}
          onClick={onEdit}
          className={cn(
            'inline-flex h-10 items-center gap-2 rounded-medium border border-outline px-4 text-on-surface-variant',
            'hover:bg-on-surface/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
            editing && 'bg-on-surface/10'
          )}
        >
          <FilterAltIcon size={20} />
          <span className="text-label-large font-medium">{t('filters')}</span>
        </button>
      </div>

      {chips.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li key={chip.field}>
              <span className={cn('inline-flex h-8 items-center gap-1 rounded-small ps-2 pe-1', tone.chip)}>
                <span className="text-label-large font-medium">{chip.label}</span>
                <button
                  type="button"
                  aria-label={t('removeFilter', { filter: chip.label })}
                  onClick={() => onRemove(chip.field)}
                  className="inline-flex size-6 items-center justify-center rounded-full hover:bg-on-surface/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={cn('rounded-small border border-dashed px-3 py-3 text-center', tone.empty)}>
          <span className="text-label-medium">{t('noFilters')}</span>
        </p>
      )}
    </section>
  );
}
