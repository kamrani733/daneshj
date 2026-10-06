'use client';

import { ChevronDown, Search, X } from 'lucide-react';
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

import { Spinner } from '@/components/ui/spinner';
import { useDismissible } from '@/hooks/use-dismissible';
import { normalizeFaText } from '@/lib/normalize-fa';
import { cn } from '@/lib/utils';

export type SearchSelectOption = {
  value: string;
  label: string;
};

type SearchSelectProps = {
  /** Field label: placeholder while empty, floating (notched) label once a value is picked. */
  label: string;
  options: SearchSelectOption[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  /** Accessible label of the clear (×) button. */
  clearLabel: string;
  /** Shown in the list when typing matches nothing. */
  emptyLabel: string;
  loading?: boolean;
  disabled?: boolean;
  /** Background behind the floating label — match the parent surface. */
  labelSurfaceClassName?: string;
  maxLength?: number;
  className?: string;
};

/**
 * Outlined single-select with type-to-filter (ARIA combobox + listbox).
 * Search icon at the start; chevron while empty, clear (×) once a value is picked.
 */
export function SearchSelect({
  label,
  options,
  value,
  onValueChange,
  clearLabel,
  emptyLabel,
  loading = false,
  disabled = false,
  labelSurfaceClassName = 'bg-surface-container-low',
  maxLength = 50,
  className,
}: SearchSelectProps) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const selected = options.find((option) => option.value === value) ?? null;

  const filtered = useMemo(() => {
    const needle = normalizeFaText(term);
    if (!needle) return options;
    return options.filter((option) =>
      normalizeFaText(option.label).includes(needle),
    );
  }, [options, term]);

  const close = useCallback(() => {
    setOpen(false);
    setTerm('');
  }, []);
  useDismissible(open, close, [wrapRef]);

  const openList = () => {
    if (disabled) return;
    setActiveIndex(0);
    setOpen(true);
  };

  const pick = (option: SearchSelectOption) => {
    onValueChange(option.value);
    close();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        openList();
        return;
      }
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((index) =>
        filtered.length === 0
          ? 0
          : (index + step + filtered.length) % filtered.length,
      );
    } else if (event.key === 'Enter' && open) {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) pick(option);
    } else if (event.key === 'Escape') {
      close();
    }
  };

  const showFloatingLabel = selected !== null || open;
  const inputValue = open ? term : (selected?.label ?? '');
  const activeId =
    open && filtered[activeIndex] ? `${listId}-${activeIndex}` : undefined;

  return (
    <div ref={wrapRef} className={cn('relative w-full', className)}>
      <div
        className={cn(
          'relative flex h-14 w-full items-center gap-3 rounded-extra-small border border-outline px-3',
          'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <Search
          className="size-6 shrink-0 text-on-surface-variant"
          strokeWidth={1.5}
          aria-hidden
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          disabled={disabled}
          maxLength={maxLength}
          value={inputValue}
          placeholder={showFloatingLabel ? selected?.label : label}
          onFocus={openList}
          onClick={openList}
          onChange={(event) => {
            setTerm(event.target.value);
            setActiveIndex(0);
            if (!open) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-start text-body-large text-on-surface outline-none placeholder:text-on-surface-variant"
        />
        {selected && !open ? (
          <button
            type="button"
            aria-label={clearLabel}
            disabled={disabled}
            onClick={() => {
              onValueChange(null);
              inputRef.current?.focus();
            }}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
        ) : (
          <ChevronDown
            className={cn(
              'size-6 shrink-0 text-on-surface-variant transition-transform',
              open && 'rotate-180',
            )}
            strokeWidth={1.5}
            aria-hidden
          />
        )}
        {showFloatingLabel ? (
          <span
            aria-hidden
            className={`text-body-small ${cn(
              'pointer-events-none absolute start-3 top-0 -translate-y-1/2 px-1 text-on-surface-variant',
              labelSurfaceClassName,
            )}`}
          >
            {label}
          </span>
        ) : null}
      </div>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          aria-busy={loading || undefined}
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-extra-small bg-surface-container py-2 shadow-app-elevation-2"
        >
          {filtered.length === 0 ? (
            <li className="flex min-h-12 items-center px-3 text-body-medium text-on-surface-variant">
              {loading ? (
                <Spinner className="size-5 text-primary" />
              ) : (
                emptyLabel
              )}
            </li>
          ) : (
            filtered.map((option, index) => (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={option.value === value}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => pick(option)}
                // Size kept outside cn(): tailwind-merge reads custom `text-<scale>` as a color.
                className={`text-body-large ${cn(
                  'flex min-h-12 cursor-pointer items-center px-3 py-2 text-start text-on-surface',
                  index === activeIndex && 'bg-on-surface/8',
                  option.value === value && 'font-medium text-primary',
                )}`}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
