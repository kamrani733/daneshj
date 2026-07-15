'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import type { HomeMenuItem } from '../data/home-menu-data';

type HomeMenuPanelProps = {
  items: HomeMenuItem[];
  className?: string;
  onNavigate?: () => void;
};

/** Figma Menu — 280×auto, #EFEDE6, radius 4px, elevation 2, items 56px. */
export function HomeMenuPanel({
  items,
  className,
  onNavigate,
}: HomeMenuPanelProps) {
  return (
    <ul
      dir="rtl"
      className={cn(
        'flex w-[280px] flex-col overflow-hidden rounded bg-home-search-category py-2 text-right shadow-home-elevation-2',
        className
      )}
      role="menu"
    >
      {items.map((item) => (
        <HomeMenuRow
          key={item.id}
          item={item}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  );
}

function HomeMenuRow({
  item,
  onNavigate,
}: {
  item: HomeMenuItem;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rowRef = useRef<HTMLLIElement>(null);
  const hasChildren = Boolean(item.children?.length);

  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: MouseEvent) => {
      if (!rowRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointer);
    return () => document.removeEventListener('mousedown', handlePointer);
  }, [open]);

  const content = (
    <>
      <span className="min-w-0 flex-1 truncate text-right">{item.label}</span>
      {hasChildren ? (
        <ChevronLeft className="size-6 shrink-0 text-content-muted" aria-hidden />
      ) : null}
    </>
  );

  const rowClassName =
    'flex h-14 w-full items-center justify-between gap-3 px-3 text-right text-base leading-6 tracking-[0.0094em] text-content transition-colors hover:bg-black/5 dark:hover:bg-white/5';

  return (
    <li ref={rowRef} className="relative" role="none">
      {item.href && !hasChildren ? (
        <Link
          href={item.href}
          role="menuitem"
          dir="rtl"
          onClick={onNavigate}
          className={rowClassName}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          role="menuitem"
          dir="rtl"
          aria-expanded={hasChildren ? open : undefined}
          aria-haspopup={hasChildren ? 'menu' : undefined}
          onClick={() => {
            if (hasChildren) {
              setOpen((value) => !value);
              return;
            }
            onNavigate?.();
          }}
          className={rowClassName}
        >
          {content}
        </button>
      )}

      {hasChildren && open ? (
        <div
          dir="rtl"
          className="absolute right-full top-0 z-[80] me-1"
          role="presentation"
        >
          <HomeMenuPanel
            items={item.children!}
            onNavigate={() => {
              setOpen(false);
              onNavigate?.();
            }}
          />
        </div>
      ) : null}
    </li>
  );
}

type HomeMenuDropdownProps = {
  open: boolean;
  onClose: () => void;
  items: HomeMenuItem[];
  align?: 'start' | 'end';
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
};

export function HomeMenuDropdown({
  open,
  onClose,
  items,
  align = 'end',
  className,
  containerRef,
}: HomeMenuDropdownProps) {
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
    <div
      dir="rtl"
      className={cn(
        'absolute top-[calc(100%+4px)] z-[80]',
        align === 'end' ? 'right-0' : 'left-0',
        className
      )}
    >
      <HomeMenuPanel items={items} onNavigate={onClose} />
    </div>
  );
}
