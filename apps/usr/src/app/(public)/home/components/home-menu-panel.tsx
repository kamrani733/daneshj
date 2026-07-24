'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import type { HomeMenuItem } from '../data/home-menu-data';

type HomeMenuPanelProps = {
  items: HomeMenuItem[];
  className?: string;
  onNavigate?: (label: string) => void;
};

type MenuStackLevel = {
  title: string;
  items: HomeMenuItem[];
};

type HomeMenuStackListProps = {
  items: HomeMenuItem[];
  className?: string;
  listClassName?: string;
  onNavigate?: (label: string) => void;
  rootTitle?: string;
  expandNested?: boolean;
};

const EXPAND_INDENT_BY_DEPTH = ['px-3', 'pe-3 ps-14', 'pe-3 ps-20', 'pe-3 ps-24'] as const;

function expandRowPadding(depth: number) {
  return EXPAND_INDENT_BY_DEPTH[Math.min(depth, EXPAND_INDENT_BY_DEPTH.length - 1)];
}

/** Mobile menu — drill-down by default; `expandNested` opens children inline with right indent. */
export function HomeMenuStackList({
  items,
  className,
  listClassName,
  onNavigate,
  rootTitle,
  expandNested = false,
}: HomeMenuStackListProps) {
  const [stack, setStack] = useState<MenuStackLevel[]>([]);
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  const current = stack[stack.length - 1];
  const list = expandNested ? items : (current?.items ?? items);

  const goBack = () => setStack((value) => value.slice(0, -1));

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderExpandItems = (nodes: HomeMenuItem[], depth: number): ReactNode =>
    nodes.map((item) => {
      const Icon = item.icon;
      const hasChildren = Boolean(item.children?.length);
      const isOpen = openIds.has(item.id);
      const rowClassName = cn(
        'flex h-14 w-full items-center justify-between gap-3 text-right text-base leading-6 tracking-[0.0094em] text-content transition-colors hover:bg-black/5 dark:hover:bg-white/5',
        expandRowPadding(depth)
      );
      const content = (
        <>
          {Icon ? (
            <Icon className="size-6 shrink-0 text-content" strokeWidth={1.5} aria-hidden />
          ) : null}
          <span className="min-w-0 flex-1 text-right">{item.label}</span>
          {hasChildren ? (
            <ChevronLeft
              className={cn(
                'size-6 shrink-0 text-content-muted transition-transform',
                isOpen && '-rotate-90'
              )}
              aria-hidden
            />
          ) : null}
        </>
      );

      return (
        <li key={item.id} role="none" className="flex flex-col">
          {item.href && !hasChildren ? (
            <Link
              href={item.href}
              role="menuitem"
              dir="rtl"
              onClick={() => onNavigate?.(item.label.trim())}
              className={rowClassName}
            >
              {content}
            </Link>
          ) : (
            <button
              type="button"
              role="menuitem"
              dir="rtl"
              aria-haspopup={hasChildren ? 'menu' : undefined}
              aria-expanded={hasChildren ? isOpen : undefined}
              className={rowClassName}
              onClick={() => {
                if (hasChildren) {
                  toggleOpen(item.id);
                  return;
                }
                onNavigate?.(item.label.trim());
              }}
            >
              {content}
            </button>
          )}

          {hasChildren && isOpen ? (
            <ul role="menu" className="flex w-full flex-col">
              {renderExpandItems(item.children!, depth + 1)}
            </ul>
          ) : null}
        </li>
      );
    });

  return (
    <div className={cn('flex w-full flex-col', className)}>
      {!expandNested && (current || rootTitle) ? (
        <div className="mb-2 flex shrink-0 items-center gap-2 px-1">
          {current ? (
            <button
              type="button"
              dir="rtl"
              onClick={goBack}
              className="inline-flex min-w-0 flex-1 items-center gap-2 text-right text-sm font-medium text-content"
            >
              <ChevronRight className="size-5 shrink-0" aria-hidden />
              <span className="truncate">{current.title}</span>
            </button>
          ) : (
            <span dir="rtl" className="min-w-0 flex-1 text-right text-sm font-medium text-content-muted">
              {rootTitle}
            </span>
          )}
        </div>
      ) : null}

      <ul
        dir="rtl"
        className={cn(
          'flex min-h-0 w-full flex-col overflow-y-auto overscroll-contain rounded bg-home-search-category py-2 text-right shadow-home-elevation-2',
          'max-h-[min(60vh,calc(100dvh-10rem))]',
          listClassName
        )}
        role="menu"
      >
        {expandNested
          ? renderExpandItems(list, 0)
          : list.map((item) => {
              const Icon = item.icon;
              const hasChildren = Boolean(item.children?.length);
              const rowClassName =
                'flex h-14 w-full items-center justify-between gap-3 px-3 text-right text-base leading-6 tracking-[0.0094em] text-content transition-colors hover:bg-black/5 dark:hover:bg-white/5';
              const content = (
                <>
                  {Icon ? (
                    <Icon className="size-6 shrink-0 text-content" strokeWidth={1.5} aria-hidden />
                  ) : null}
                  <span className="min-w-0 flex-1 text-right">{item.label}</span>
                  {hasChildren ? (
                    <ChevronLeft className="size-6 shrink-0 text-content-muted" aria-hidden />
                  ) : null}
                </>
              );

              return (
                <li key={item.id} role="none">
                  {item.href && !hasChildren ? (
                    <Link
                      href={item.href}
                      role="menuitem"
                      dir="rtl"
                      onClick={() => onNavigate?.(item.label.trim())}
                      className={rowClassName}
                    >
                      {content}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      role="menuitem"
                      dir="rtl"
                      aria-haspopup={hasChildren ? 'menu' : undefined}
                      className={rowClassName}
                      onClick={() => {
                        if (hasChildren) {
                          setStack((value) => [
                            ...value,
                            { title: item.label.trim(), items: item.children! },
                          ]);
                          return;
                        }
                        onNavigate?.(item.label.trim());
                      }}
                    >
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
      </ul>
    </div>
  );
}

const MENU_VIEWPORT_PADDING = 16;

/** Cap panel height to remaining viewport space so overflow can scroll. */
function useViewportMaxHeight(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>
) {
  const [maxHeight, setMaxHeight] = useState<number | undefined>();

  useEffect(() => {
    if (!open) {
      setMaxHeight(undefined);
      return;
    }

    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const available = window.innerHeight - top - MENU_VIEWPORT_PADDING;
      setMaxHeight(Math.max(160, Math.min(available, window.innerHeight * 0.7)));
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef]);

  return maxHeight;
}

/** Figma Menu — min 280px, expands with label length; elevation 2, items 56px. */
export function HomeMenuPanel({
  items,
  className,
  onNavigate,
  scrollable = false,
  maxHeight,
}: HomeMenuPanelProps & { scrollable?: boolean; maxHeight?: number }) {
  return (
    <ul
      dir="rtl"
      className={cn(
        'relative z-[90] flex w-max min-w-[280px] max-w-[min(480px,90vw)] flex-col rounded bg-home-search-category py-2 text-right shadow-home-elevation-2',
        scrollable
          ? 'overflow-y-auto overscroll-contain'
          : 'overflow-visible',
        scrollable && maxHeight == null && 'max-h-[min(70vh,calc(100dvh-6rem))]',
        className
      )}
      style={scrollable && maxHeight != null ? { maxHeight } : undefined}
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
  onNavigate?: (label: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rowRef = useRef<HTMLLIElement>(null);
  const hasChildren = Boolean(item.children?.length);
  const flyoutMaxHeight = useViewportMaxHeight(open && hasChildren, rowRef);

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

  const select = () => onNavigate?.(item.label.trim());
  const Icon = item.icon;

  const content = (
    <>
      {Icon ? <Icon className="size-6 shrink-0 text-content" strokeWidth={1.5} aria-hidden /> : null}
      <span className="min-w-0 flex-1 whitespace-nowrap text-right">{item.label}</span>
      {hasChildren ? (
        <ChevronLeft className="size-6 shrink-0 text-content-muted" aria-hidden />
      ) : null}
    </>
  );

  const rowClassName =
    'flex h-14 w-full items-center justify-between gap-3 px-3 text-right text-base leading-6 tracking-[0.0094em] text-content transition-colors hover:bg-black/5 dark:hover:bg-white/5';

  return (
    <li ref={rowRef} className={cn('relative', open && 'z-[100]')} role="none">
      {item.href && !hasChildren ? (
        <Link
          href={item.href}
          role="menuitem"
          dir="rtl"
          onClick={select}
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
            select();
          }}
          className={rowClassName}
        >
          {content}
        </button>
      )}

      {hasChildren && open ? (
        <div
          dir="rtl"
          className="absolute right-full top-0 z-[110] me-1"
          role="presentation"
        >
          <HomeMenuPanel
            items={item.children!}
            scrollable
            maxHeight={flyoutMaxHeight}
            onNavigate={(label) => {
              setOpen(false);
              onNavigate?.(label);
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
        'absolute top-[calc(100%+4px)] z-[100]',
        align === 'end' ? 'right-0' : 'left-0',
        className
      )}
    >
      <HomeMenuPanel items={items} onNavigate={() => onClose()} />
    </div>
  );
}
