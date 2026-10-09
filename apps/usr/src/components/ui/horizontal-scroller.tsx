'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

type HorizontalScrollerProps = {
  children: ReactNode;
  /** Accessible name of the scrollable region, e.g. the report title. */
  label: string;
  /** Accessible labels of the arrow buttons (toward the start / toward the end). */
  scrollStartLabel: string;
  scrollEndLabel: string;
  className?: string;
};

type Metrics = { overflow: boolean; size: number; offset: number; atStart: boolean; atEnd: boolean };

const INITIAL: Metrics = { overflow: false, size: 1, offset: 0, atStart: true, atEnd: true };

/**
 * RTL horizontal scroll area with the Figma report indicator above the content:
 * triangle buttons at both ends and a primary thumb (wide report tables).
 * The native scrollbar is hidden; touch, trackpad, keyboard and thumb drag all scroll.
 */
export function HorizontalScroller({
  children,
  label,
  scrollStartLabel,
  scrollEndLabel,
  className,
}: HorizontalScrollerProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; scrollLeft: number } | null>(null);
  const [metrics, setMetrics] = useState<Metrics>(INITIAL);

  const update = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    // RTL: scrollLeft is 0 at the start and goes negative toward the end.
    const max = el.scrollWidth - el.clientWidth;
    const scrolled = Math.abs(el.scrollLeft);
    setMetrics({
      overflow: max > 1,
      size: el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1,
      offset: el.scrollWidth > 0 ? scrolled / el.scrollWidth : 0,
      atStart: scrolled <= 1,
      atEnd: scrolled >= max - 1,
    });
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, [update]);

  const scrollByPage = (direction: 'start' | 'end') => {
    const el = viewportRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: direction === 'end' ? -amount : amount, behavior: 'smooth' });
  };

  const onThumbPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = viewportRef.current;
    if (!el) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, scrollLeft: el.scrollLeft };
  };

  const onThumbPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = viewportRef.current;
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!el || !track || !drag || track.clientWidth === 0) return;
    // Moving the thumb toward the end (left) scrolls toward the end (negative scrollLeft).
    const ratio = el.scrollWidth / track.clientWidth;
    el.scrollLeft = drag.scrollLeft + (event.clientX - drag.x) * ratio;
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  return (
    <div className={cn('flex w-full min-w-0 flex-col gap-2', className)}>
      {metrics.overflow ? (
        <div className="flex h-3.5 items-center gap-1">
          <ArrowButton direction="start" label={scrollStartLabel} disabled={metrics.atStart} onClick={() => scrollByPage('start')} />
          <div ref={trackRef} className="relative h-3 min-w-0 flex-1">
            <div
              role="presentation"
              onPointerDown={onThumbPointerDown}
              onPointerMove={onThumbPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="absolute inset-y-0 cursor-grab touch-none rounded-full bg-primary active:cursor-grabbing"
              // Runtime-computed thumb geometry.
              style={{ width: `${metrics.size * 100}%`, insetInlineStart: `${metrics.offset * 100}%` }}
            />
          </div>
          <ArrowButton direction="end" label={scrollEndLabel} disabled={metrics.atEnd} onClick={() => scrollByPage('end')} />
        </div>
      ) : null}

      <div
        ref={viewportRef}
        role="region"
        aria-label={label}
        tabIndex={metrics.overflow ? 0 : -1}
        onScroll={update}
        className="scrollbar-none w-full overflow-x-auto rounded-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        {children}
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: 'start' | 'end';
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-3.5 shrink-0 items-center justify-center text-primary disabled:opacity-40"
    >
      {/* Figma triangle; points toward the end (left) and mirrors for the start (right). */}
      <svg
        aria-hidden
        viewBox="0 0 12 12"
        className={cn('size-3', direction === 'start' && '-scale-x-100')}
        fill="currentColor"
      >
        <path d="M1.5 6.67C.83 6.28.83 5.32 1.5 4.93L9 .6c.67-.38 1.5.1 1.5.87v8.66c0 .77-.83 1.25-1.5.87z" />
      </svg>
    </button>
  );
}
