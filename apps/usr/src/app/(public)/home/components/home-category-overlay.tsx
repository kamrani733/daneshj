'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';

import { CATEGORY_GRID_ITEMS, CATEGORY_MENU_ITEMS } from '../data/home-menu-data';
import { HOME_IMAGES } from '../home-assets';
import { HomeMenuPanel } from './home-menu-panel';

type HomeCategoryOverlayProps = {
  open: boolean;
  onClose: () => void;
};

/** Figma category overlay — grid desktop (#1:9227), list mobile. */
export function HomeCategoryOverlay({ open, onClose }: HomeCategoryOverlayProps) {
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
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 px-4 pt-24 dark:bg-black/60 min-[834px]:pt-32">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="دسته‌بندی"
        className="relative w-full max-w-[1100px] rounded-3xl bg-home-header p-6 shadow-home-elevation-4 min-[834px]:p-10"
      >
        <button
          type="button"
          aria-label="بستن"
          onClick={onClose}
          className="absolute left-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-home-search-category text-content transition-colors hover:bg-muted min-[834px]:left-6 min-[834px]:top-6"
        >
          <X className="size-5" />
        </button>

        <div className="hidden flex-col items-center gap-12 min-[834px]:flex">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold leading-9 text-primary">دسته بندی تخفیف ها </h2>
            <Image
              src={HOME_IMAGES.sectionTitleAccent}
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
                onClick={onClose}
                className="group flex flex-col items-center gap-6"
              >
                <span className="flex size-[135px] items-center justify-center overflow-hidden rounded-full bg-home-header shadow-home-elevation-1 transition-transform group-hover:scale-[1.02] dark:bg-home-search-fill">
                  <Image
                    src={HOME_IMAGES.discountCard}
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

        <div dir="rtl" className="flex flex-col items-end gap-4 pt-8 min-[834px]:hidden">
          <h2 className="w-full text-right text-xl font-bold leading-8 text-primary">دسته بندی تخفیف ها </h2>
          <HomeMenuPanel
            items={CATEGORY_MENU_ITEMS}
            className="w-full max-w-[280px]"
            onNavigate={onClose}
          />
        </div>
      </div>
    </div>
  );
}

type CategoryMenuDropdownProps = {
  open: boolean;
  onClose: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

/** Desktop/tablet anchored list dropdown from category button. */
export function CategoryMenuDropdown({ open, onClose, containerRef }: CategoryMenuDropdownProps) {
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
    <div dir="rtl" className="absolute right-0 top-[calc(100%+4px)] z-[80] hidden min-[834px]:block">
      <HomeMenuPanel items={CATEGORY_MENU_ITEMS} onNavigate={onClose} />
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
