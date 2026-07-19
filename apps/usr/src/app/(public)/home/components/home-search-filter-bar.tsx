'use client';

import { ArrowUpDown, ChevronDown, Filter, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

import {
  EMPTY_SEARCH_FILTERS,
  SEARCH_SORT_OPTIONS,
  type SearchFilterValues,
  type SearchSortId,
} from '../data/search-filter-data';

type HomeSearchFilterBarProps = {
  filters: SearchFilterValues;
  sort: SearchSortId;
  onFiltersChange: (filters: SearchFilterValues) => void;
  onSortChange: (sort: SearchSortId) => void;
  onApply: (filters: SearchFilterValues) => void;
  onClear: () => void;
  className?: string;
};

type MenuCoords = { top: number; left: number };

/**
 * Figma Temp #75:1065 / Login-logout report Filter —
 * collapsed 72px control bar · expand panel · sort menu (elev 2, z portal).
 */
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
  const [mounted, setMounted] = useState(false);
  const [sortCoords, setSortCoords] = useState<MenuCoords | null>(null);
  const sortBtnRef = useRef<HTMLButtonElement>(null);
  const sortMenuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (panelOpen) setDraft(filters);
  }, [panelOpen, filters]);

  useLayoutEffect(() => {
    if (!sortOpen || !sortBtnRef.current) return;

    const update = () => {
      const rect = sortBtnRef.current?.getBoundingClientRect();
      if (!rect) return;
      const menuWidth = 280;
      const gap = 4;
      const padding = 8;
      let left = rect.right - menuWidth;
      left = Math.min(left, window.innerWidth - menuWidth - padding);
      left = Math.max(padding, left);
      setSortCoords({ top: rect.bottom + gap, left });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [sortOpen]);

  useEffect(() => {
    if (!sortOpen) return;

    const handlePointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        sortBtnRef.current?.contains(target) ||
        sortMenuRef.current?.contains(target)
      ) {
        return;
      }
      setSortOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSortOpen(false);
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [sortOpen]);

  const patchDraft = (patch: Partial<SearchFilterValues>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const elevated = panelOpen || sortOpen;

  return (
    <div
      className={cn(
        'relative w-full rounded-xl border border-home-filter',
        panelOpen ? 'bg-home-card' : 'bg-home-filter-bar',
        elevated && 'z-[60]',
        className
      )}
    >
      {/* Control bar — 8×16 · h content 56 · total ~72 */}
      <div
        dir="ltr"
        className="flex items-center justify-between gap-6 px-4 py-2"
      >
        <label className="relative h-14 w-full max-w-[420px] shrink min-w-0">
          <span className="sr-only">{t('searchPlaceholder')}</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-6 -translate-y-1/2 text-home-filter-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={panelOpen ? draft.query : filters.query}
            onChange={(event) => {
              const query = event.target.value;
              if (panelOpen) {
                patchDraft({ query });
              } else {
                onFiltersChange({ ...filters, query });
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                const next = panelOpen
                  ? draft
                  : { ...filters, query: event.currentTarget.value };
                onFiltersChange(next);
                onApply(next);
              }
            }}
            placeholder={t('searchPlaceholder')}
            className={cn(
              'h-14 w-full rounded-[28px] border border-home-filter bg-home-filter-search',
              'pl-12 pr-5 text-end text-base leading-6 tracking-[0.0094em] text-home-filter-ink outline-none',
              'placeholder:text-home-filter-muted focus-visible:ring-2 focus-visible:ring-primary/30',
              '[&::-webkit-search-cancel-button]:hidden'
            )}
          />
        </label>

        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            aria-expanded={panelOpen}
            aria-label={t('filterTooltip')}
            title={t('filterTooltip')}
            onClick={() => {
              setSortOpen(false);
              setPanelOpen((open) => !open);
            }}
            className={cn(
              'inline-flex size-14 items-center justify-center rounded-full text-home-filter-ink transition-colors',
              'hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              'dark:hover:bg-white/10',
              panelOpen && 'bg-black/5 text-primary dark:bg-white/10'
            )}
          >
            <Filter className="size-6" strokeWidth={1.75} />
          </button>

          <button
            ref={sortBtnRef}
            type="button"
            aria-expanded={sortOpen}
            aria-haspopup="menu"
            aria-label={t('sortTooltip')}
            title={t('sortTooltip')}
            onClick={() => {
              setPanelOpen(false);
              setSortOpen((open) => !open);
            }}
            className={cn(
              'inline-flex size-14 items-center justify-center rounded-full text-home-filter-ink transition-colors',
              'hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              'dark:hover:bg-white/10',
              sortOpen && 'bg-black/5 text-primary dark:bg-white/10'
            )}
          >
            <ArrowUpDown className="size-6" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {mounted && sortOpen && sortCoords
        ? createPortal(
            <ul
              ref={sortMenuRef}
              role="menu"
              dir="rtl"
              style={{
                position: 'fixed',
                top: sortCoords.top,
                left: sortCoords.left,
                zIndex: 9999,
                width: 280,
              }}
              className="flex flex-col rounded bg-home-search-category py-2 shadow-home-elevation-2"
            >
              {SEARCH_SORT_OPTIONS.map((option) => (
                <li key={option.id} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onSortChange(option.id);
                      setSortOpen(false);
                    }}
                    className={cn(
                      'flex h-12 w-full items-center justify-end px-3 text-base leading-6 tracking-[0.0094em] text-home-filter-ink transition-colors',
                      'hover:bg-black/5 dark:hover:bg-white/10',
                      sort === option.id && 'font-semibold text-primary'
                    )}
                  >
                    {t(`sort.${option.labelKey}`)}
                  </button>
                </li>
              ))}
            </ul>,
            document.body
          )
        : null}

      {panelOpen ? (
        <div dir="rtl" className="flex flex-col">
          {/* Title row — menu list item style */}
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
                onToggle={() =>
                  setOpenField((id) => (id === 'discount' ? null : 'discount'))
                }
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
                onToggle={() => setOpenField((id) => (id === 'price' ? null : 'price'))}
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
                onToggle={() => setOpenField((id) => (id === 'date' ? null : 'date'))}
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
                onToggle={() => setOpenField((id) => (id === 'rating' ? null : 'rating'))}
                className="min-[834px]:w-[calc((100%-0px)/3)] min-[834px]:max-w-none min-[834px]:flex-none"
              >
                <label className="flex w-full max-w-[200px] flex-col items-stretch gap-0 self-end px-2 pb-2">
                  <span className="sr-only">{t('fields.ratingMin')}</span>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={draft.ratingMin}
                    onChange={(event) => patchDraft({ ratingMin: event.target.value })}
                    placeholder={t('fields.ratingMin')}
                    className={cn(
                      'h-14 w-full rounded-t border-0 border-b border-home-filter bg-home-card',
                      'px-4 text-end text-base text-home-filter-ink outline-none',
                      'placeholder:text-home-filter-muted focus-visible:ring-2 focus-visible:ring-primary/30'
                    )}
                  />
                </label>
              </FilterField>
            </div>
          </div>

          {/* Actions — padding 20 16 20 24 · gap 8 · buttons h-10 / Figma wrap h-48 */}
          <div
            dir="ltr"
            className="flex items-center gap-2 px-4 py-5 pe-6 ps-4"
          >
            <button
              type="button"
              onClick={() => {
                onFiltersChange(draft);
                onApply(draft);
                setPanelOpen(false);
                setOpenField(null);
              }}
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium leading-5 tracking-[0.0071em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t('apply')}
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(EMPTY_SEARCH_FILTERS);
                onClear();
                setOpenField(null);
              }}
              className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-medium leading-5 tracking-[0.0071em] text-primary transition-colors hover:bg-primary/5"
            >
              {t('clear')}
            </button>
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
      <button
        type="button"
        dir="ltr"
        aria-expanded={open}
        aria-controls={`filter-field-${id}`}
        onClick={onToggle}
        className="flex h-14 w-full items-center justify-end gap-3 px-3 text-home-filter-ink transition-colors hover:bg-black/[0.04] dark:hover:bg-white/5"
      >
        <ChevronDown
          className={cn(
            'size-6 shrink-0 text-home-filter-muted transition-transform',
            open && 'rotate-180'
          )}
          aria-hidden
        />
        <span className="truncate text-base font-medium leading-6 tracking-[0.0094em]">
          {label}
        </span>
      </button>
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
      <LabeledField
        label={startLabel}
        supporting={supporting}
        value={startValue}
        onChange={onStartChange}
        inputType={inputType}
      />
      <LabeledField
        label={endLabel}
        supporting={supporting}
        value={endValue}
        onChange={onEndChange}
        inputType={inputType}
      />
    </div>
  );
}

function LabeledField({
  label,
  supporting,
  value,
  onChange,
  inputType,
}: {
  label: string;
  supporting: string;
  value: string;
  onChange: (value: string) => void;
  inputType: 'text' | 'date' | 'number';
}) {
  return (
    <label className="flex w-full max-w-[200px] flex-col items-stretch gap-0">
      <span className="sr-only">{label}</span>
      <input
        type={inputType}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        className={cn(
          'h-14 w-full rounded-t border-0 border-b border-home-filter bg-home-card',
          'px-4 text-end text-base leading-6 text-home-filter-ink outline-none',
          'placeholder:text-home-filter-muted focus-visible:ring-2 focus-visible:ring-primary/30'
        )}
      />
      <span className="px-4 pt-1 text-xs leading-4 tracking-[0.0083em] text-home-filter-muted">
        {supporting}
      </span>
    </label>
  );
}
