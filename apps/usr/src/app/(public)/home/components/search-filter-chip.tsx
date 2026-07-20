'use client';

import { cn } from '@/lib/utils';

import { ChipCheckIcon } from './material-icons';

type SearchFilterChipProps = {
  label: string;
  selected?: boolean;
  onSelect: () => void;
};

/**
 * M3 Filter chip — Figma #1:377 / Head content Sub Category
 * h=32 · radius=8 · gap=8 · label/large 14/20 · tracking 0.0071em
 * Unselected: #FAFAF5 · stroke 1 #BFC9C1 · pad 6×16
 * Selected: #FFDBCF · pad 6 8 6 16 · check 18 · on-secondary #72351F
 */
export function SearchFilterChip({
  label,
  selected = false,
  onSelect,
}: SearchFilterChipProps) {
  return (
    <button
      type="button"
      dir="rtl"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center gap-2',
        'rounded-lg text-sm font-medium leading-5 tracking-[0.0071em]',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        selected
          ? 'bg-warning-50 py-1.5 pe-4 ps-2 text-warning-700'
          : 'border border-home-filter bg-home-card px-4 py-1.5 text-home-filter-muted'
      )}
    >
      {selected ? <ChipCheckIcon className="text-warning-700" /> : null}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
