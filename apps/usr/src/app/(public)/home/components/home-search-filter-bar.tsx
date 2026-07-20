'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { UnderlineField } from '@/components/ui/underline-field';
import { useDismissible } from '@/hooks/use-dismissible';
import { cn } from '@/lib/utils';

import {
  EMPTY_SEARCH_FILTERS,
  type SearchFilterValues,
  type SearchSortId,
} from '../data/search-filter-data';
import { FilterToolbarButton } from './filter-toolbar-button';
import { HomeSearchSortMenu } from './home-search-sort-menu';
import { FilterAltIcon, ImportExportIcon } from './material-icons';

type HomeSearchFilterBarProps = {
  filters: SearchFilterValues;
  sort: SearchSortId;
  onFiltersChange: (filters: SearchFilterValues) => void;
  onSortChange: (sort: SearchSortId) => void;
  onApply: (filters: SearchFilterValues) => void;
  onClear: () => void;
  className?: string;
};

export function HomeSearchFilterBar({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  onApply,
  onClear,
  className,
}: HomeSearchFilterBarProps) {
  const t = useTranslations('home.searchResults.filter');
  const [panelOpen, setPanelOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [draft, setDraft] = useState(filters);
  const [openField, setOpenField] = useState<string | null>(null);
  const sortBtnRef = useRef<HTMLButtonElement>(null);
  const sortMenuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (panelOpen) setDraft(filters);
  }, [panelOpen, filters]);

  const dismissSort = useCallback(() => setSortOpen(false), []);
  useDismissible(sortOpen, dismissSort, [sortBtnRef, sortMenuRef]);

  const patchDraft = (patch: Partial<SearchFilterValues>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const toggleField = (id: string) => {
    setOpenField((current) => (current === id ? null : id));
  };

  const elevated = panelOpen || sortOpen;

  return (
    <div
      className={cn(
        /* Figma Login-logout report Filter — radius 12 · stroke 1 #BFC9C1 · bg #F5F8F5 · h 72 */
        'relative w-full rounded-xl border border-home-filter',
        panelOpen ? 'bg-home-card' : 'bg-home-filter-bar',
        elevated ? 'z-[60] overflow-visible' : 'overflow-visible',
        className
      )}
    >
      {/* Control bar #1:13393 — pad 8×16 · icons 56 · gap 16 · filter_alt + import_export */}
      <div
        dir="ltr"
        className="flex h-[72px] items-center justify-end gap-4 px-4 py-2"
      >
        <FilterToolbarButton
          label={t('filterTooltip')}
          active={panelOpen}
          aria-expanded={panelOpen}
          onClick={() => {
            setSortOpen(false);
            setPanelOpen((open) => !open);
          }}
        >
          <FilterAltIcon />
        </FilterToolbarButton>

        <FilterToolbarButton
          ref={sortBtnRef}
          label={t('sortTooltip')}
          active={sortOpen}
          aria-expanded={sortOpen}
          aria-haspopup="menu"
          onClick={() => {
            setPanelOpen(false);
            setSortOpen((open) => !open);
          }}
        >
          <ImportExportIcon />
        </FilterToolbarButton>
      </div>

      <HomeSearchSortMenu
        open={sortOpen}
        value={sort}
        anchorRef={sortBtnRef}
        menuRef={sortMenuRef}
        onSelect={(id) => {
          onSortChange(id);
          setSortOpen(false);
        }}
      />

      {panelOpen ? (
        <div dir="rtl" className="flex flex-col">
          <div className="flex h-14 items-center justify-end px-3">
            <p className="text-base leading-6 tracking-[0.0094em] text-home-filter-ink">
              {t('title')}
            </p>
          </div>

          <div className="flex w-full flex-col">
            <div className="flex w-full flex-col min-[834px]:flex-row min-[834px]:justify-end">
              <FilterField
                id="discount"
                label={t('fields.discount')}
                open={openField === 'discount'}
                onToggle={() => toggleField('discount')}
              >
                <RangeInputs
                  startLabel={t('fields.rangeStart')}
                  endLabel={t('fields.rangeEnd')}
                  supporting={t('fields.percent')}
                  startValue={draft.discountMin}
                  endValue={draft.discountMax}
                  onStartChange={(discountMin) => patchDraft({ discountMin })}
                  onEndChange={(discountMax) => patchDraft({ discountMax })}
                />
              </FilterField>

              <FilterField
                id="price"
                label={t('fields.price')}
                open={openField === 'price'}
                onToggle={() => toggleField('price')}
              >
                <RangeInputs
                  startLabel={t('fields.rangeStart')}
                  endLabel={t('fields.rangeEnd')}
                  supporting={t('fields.toman')}
                  startValue={draft.priceMin}
                  endValue={draft.priceMax}
                  onStartChange={(priceMin) => patchDraft({ priceMin })}
                  onEndChange={(priceMax) => patchDraft({ priceMax })}
                />
              </FilterField>

              <FilterField
                id="date"
                label={t('fields.date')}
                open={openField === 'date'}
                onToggle={() => toggleField('date')}
              >
                <RangeInputs
                  startLabel={t('fields.rangeStart')}
                  endLabel={t('fields.rangeEnd')}
                  supporting={t('fields.dateHint')}
                  startValue={draft.dateFrom}
                  endValue={draft.dateTo}
                  onStartChange={(dateFrom) => patchDraft({ dateFrom })}
                  onEndChange={(dateTo) => patchDraft({ dateTo })}
                  inputType="date"
                />
              </FilterField>
            </div>

            <div className="flex w-full flex-col min-[834px]:flex-row min-[834px]:justify-end">
              <FilterField
                id="rating"
                label={t('fields.rating')}
                open={openField === 'rating'}
                onToggle={() => toggleField('rating')}
                className="min-[834px]:w-[calc((100%-0px)/3)] min-[834px]:max-w-none min-[834px]:flex-none"
              >
                <UnderlineField
                  label={t('fields.ratingMin')}
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={draft.ratingMin}
                  onChange={(event) =>
                    patchDraft({ ratingMin: event.target.value })
                  }
                  className="self-end px-2 pb-2"
                />
              </FilterField>
            </div>
          </div>

          <div dir="ltr" className="flex items-center gap-2 px-4 py-5 pe-6 ps-4">
            <Button
              type="button"
              size="pillSm"
              onClick={() => {
                onFiltersChange(draft);
                onApply(draft);
                setPanelOpen(false);
                setOpenField(null);
              }}
            >
              {t('apply')}
            </Button>
            <Button
              type="button"
              variant="soft"
              size="pillSm"
              onClick={() => {
                setDraft(EMPTY_SEARCH_FILTERS);
                onClear();
                setOpenField(null);
              }}
            >
              {t('clear')}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterField({
  id,
  label,
  open,
  onToggle,
  children,
  className,
}: {
  id: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex min-w-0 flex-1 flex-col', className)}>
      <Button
        type="button"
        variant="toolbar"
        size="field"
        dir="ltr"
        aria-expanded={open}
        aria-controls={`filter-field-${id}`}
        onClick={onToggle}
        className="justify-end gap-3 hover:bg-black/[0.04] dark:hover:bg-white/5"
      >
        <ChevronDown
          className={cn(
            'size-6 shrink-0 text-home-filter-muted transition-transform',
            open && 'rotate-180'
          )}
          aria-hidden
        />
        <span className="truncate">{label}</span>
      </Button>
      {open ? (
        <div id={`filter-field-${id}`} className="px-2 pb-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function RangeInputs({
  startLabel,
  endLabel,
  supporting,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  inputType = 'text',
}: {
  startLabel: string;
  endLabel: string;
  supporting: string;
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  inputType?: 'text' | 'date' | 'number';
}) {
  return (
    <div
      dir="ltr"
      className="flex flex-col gap-4 px-2 pb-1 min-[640px]:flex-row min-[640px]:items-start"
    >
      <UnderlineField
        label={startLabel}
        supporting={supporting}
        type={inputType}
        value={startValue}
        onChange={(event) => onStartChange(event.target.value)}
      />
      <UnderlineField
        label={endLabel}
        supporting={supporting}
        type={inputType}
        value={endValue}
        onChange={(event) => onEndChange(event.target.value)}
      />
    </div>
  );
}
