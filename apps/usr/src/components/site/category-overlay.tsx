'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';

import { CATEGORY_GRID_ITEMS, CATEGORY_MENU_ITEMS } from './nav-data';
import { HomeMenuPanel, HomeMenuStackList } from './menu-panel';
import { SITE_IMAGES } from './site-assets';

type HomeCategoryOverlayProps = {
  open: boolean;
  onClose: () => void;
  onSelect?: (label: string) => void;
};

/** Figma category overlay — grid desktop (#1:9227), full-screen list mobile (#74:5694). */
export function HomeCategoryOverlay({ open, onClose, onSelect }: HomeCategoryOverlayProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[70] h-[100dvh] w-screen',
        'min-[834px]:flex min-[834px]:h-auto min-[834px]:w-auto min-[834px]:items-start min-[834px]:justify-center min-[834px]:bg-black/40 min-[834px]:px-4 min-[834px]:pt-32 dark:min-[834px]:bg-black/60'
      )}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="دسته‌بندی"
        className={cn(
          'relative flex size-full h-[100dvh] w-full flex-col overflow-hidden bg-home-header',
          'min-[834px]:size-auto min-[834px]:h-auto min-[834px]:max-w-[1100px] min-[834px]:rounded-3xl min-[834px]:p-10 min-[834px]:shadow-home-elevation-4'
        )}
      >
        <button
          type="button"
          aria-label="بستن"
          onClick={onClose}
          className="absolute left-6 top-6 z-10 hidden size-10 items-center justify-center rounded-full bg-home-search-category text-content transition-colors hover:bg-muted min-[834px]:inline-flex"
        >
          <X className="size-5" />
        </button>

        <div className="hidden flex-col items-center gap-12 min-[834px]:flex">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold leading-9 text-primary">دسته بندی تخفیف ها </h2>
            <Image
              src={SITE_IMAGES.sectionTitleAccent}
              alt=""
              width={140}
              height={4}
              aria-hidden
              className="h-1 w-[140px] object-contain"
            />
          </div>

          <div className="grid grid-cols-7 gap-x-[61px] gap-y-12">
            {CATEGORY_GRID_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                dir="rtl"
                onClick={() => {
                  onSelect?.(item.label.trim());
                  onClose();
                }}
                className="group flex flex-col items-center gap-6"
              >
                <span className="flex size-[135px] items-center justify-center overflow-hidden rounded-full bg-home-header shadow-home-elevation-1 transition-transform group-hover:scale-[1.02] dark:bg-home-search-fill">
                  <Image
                    src={SITE_IMAGES.discountCard}
                    alt=""
                    width={90}
                    height={90}
                    aria-hidden
                    className="size-[90px] rounded-full object-cover"
                  />
                </span>
                <span className="max-w-[135px] text-center text-sm font-semibold leading-5 tracking-[0.0071em] text-content-muted">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div
          dir="rtl"
          className="flex size-full min-h-0 flex-1 flex-col min-[834px]:hidden"
        >
          <div className="flex shrink-0 items-center justify-start px-4 pb-2 pt-16" dir="ltr">
            <button
              type="button"
              aria-label="بستن"
              onClick={onClose}
              className="inline-flex size-10 items-center justify-center rounded-full bg-home-search-category text-content transition-colors hover:bg-muted"
            >
              <X className="size-5" />
            </button>
          </div>
          <HomeMenuStackList
            items={CATEGORY_MENU_ITEMS}
            expandNested
            className="min-h-0 w-full flex-1"
            listClassName="!max-h-none h-full min-h-0 flex-1 rounded-none shadow-none"
            onNavigate={(label) => {
              onSelect?.(label);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}

type CategoryMenuDropdownProps = {
  open: boolean;
  onClose: () => void;
  onSelect?: (label: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export function CategoryMenuDropdown({
  open,
  onClose,
  onSelect,
  containerRef,
}: CategoryMenuDropdownProps) {
  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose, containerRef]);

  if (!open) return null;

  return (
    <div dir="rtl" className="absolute right-0 top-[calc(100%+4px)] z-[100] hidden min-[834px]:block">
      <HomeMenuPanel
        items={CATEGORY_MENU_ITEMS}
        onNavigate={(label) => {
          onSelect?.(label);
          onClose();
        }}
      />
    </div>
  );
}

export function CategoryTriggerChevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn('size-5 shrink-0 transition-transform', open && 'rotate-180')}
      fill="currentColor"
    >
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );
}
