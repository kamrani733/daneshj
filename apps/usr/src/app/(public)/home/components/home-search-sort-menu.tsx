'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  SEARCH_SORT_OPTIONS,
  type SearchSortId,
} from '../data/search-filter-data';

type HomeSearchSortMenuProps = {
  open: boolean;
  value: SearchSortId;
  onSelect: (id: SearchSortId) => void;
  /** Anchor for fixed portal positioning (sort icon button). */
  anchorRef: React.RefObject<HTMLElement | null>;
  menuRef?: React.RefObject<HTMLUListElement | null>;
};

type MenuCoords = { top: number; left: number };

/**
 * Figma Temp #82:1705 / Menu #1:13398 —
 * 280×256, bg #EFEDE6, elev 2, radius 4, items 48px. Portaled above page clip.
 */
export function HomeSearchSortMenu({
  open,
  value,
  onSelect,
  anchorRef,
  menuRef,
}: HomeSearchSortMenuProps) {
  const t = useTranslations('home.searchResults.filter');
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<MenuCoords | null>(null);
  const internalRef = useRef<HTMLUListElement>(null);
  const listRef = menuRef ?? internalRef;

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;

    const update = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      const menuWidth = 280;
      const gap = 4;
      const padding = 8;
      let left = rect.right - menuWidth;
      left = Math.min(left, window.innerWidth - menuWidth - padding);
      left = Math.max(padding, left);
      setCoords({ top: rect.bottom + gap, left });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef]);

  if (!mounted || !open || !coords) return null;

  return createPortal(
    <ul
      ref={listRef}
      role="menu"
      dir="rtl"
      aria-label={t('sortTooltip')}
      style={{
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        zIndex: 9999,
        width: 280,
      }}
      className={cn(
        'flex flex-col rounded bg-home-search-category py-2',
        'shadow-home-elevation-2'
      )}
    >
      {SEARCH_SORT_OPTIONS.map((option) => {
        const selected = value === option.id;

        return (
          <li key={option.id} role="none">
            <Button
              type="button"
              variant="menuitem"
              size="none"
              role="menuitemradio"
              aria-checked={selected}
              onClick={() => onSelect(option.id)}
              className={cn(selected && 'bg-black/[0.04] dark:bg-white/5')}
            >
              <span className="flex size-6 shrink-0 items-center justify-center">
                {selected ? (
                  <Check
                    className="size-5 text-primary"
                    strokeWidth={2}
                    aria-hidden
                  />
                ) : null}
              </span>
              <span className="min-w-0 flex-1 text-right">
                {t(`sort.${option.labelKey}`)}
              </span>
            </Button>
          </li>
        );
      })}
    </ul>,
    document.body
  );
}
