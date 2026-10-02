'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ScrollCarouselProps = {
  children: ReactNode;
  /** Accessible labels for the arrow buttons. */
  prevLabel: string;
  nextLabel: string;
  /** Arrows from this width up (Figma: desktop / tablet carousels). */
  arrowsFromClassName?: string;
  className?: string;
  trackClassName?: string;
};

/**
 * RTL horizontal carousel: native scroll + snap, arrow buttons at both ends
 * (home «دسته‌بندی‌ها» / «کسب و کار ها»). The start (right) arrow goes back,
 * the end (left) arrow goes forward; arrows disable at the edges.
 */
export function ScrollCarousel({
  children,
  prevLabel,
  nextLabel,
  arrowsFromClassName = 'min-[834px]:flex',
  className,
  trackClassName,
}: ScrollCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // RTL: scrollLeft is 0 at the start and goes negative toward the end.
    const offset = Math.abs(el.scrollLeft);
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ atStart: offset <= 1, atEnd: offset >= max - 1 });
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update]);

  const scroll = (direction: 'back' | 'forward') => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'forward' ? -amount : amount, behavior: 'smooth' });
  };

  const arrowClass = cn(
    'absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full',
    'border border-outline-variant bg-surface-container-lowest text-on-surface-variant shadow-app-elevation-1',
    'hover:bg-surface-container disabled:pointer-events-none disabled:opacity-40',
    arrowsFromClassName
  );

  return (
    <div dir="rtl" className={cn('relative w-full', className)}>
      <button
        type="button"
        aria-label={prevLabel}
        disabled={edges.atStart}
        onClick={() => scroll('back')}
        className={cn(arrowClass, '-start-3')}
      >
        <ChevronRight className="size-5" aria-hidden />
      </button>
      <div
        ref={trackRef}
        onScroll={update}
        className={cn(
          'flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          '[&>*]:snap-start',
          trackClassName
        )}
      >
        {children}
      </div>
      <button
        type="button"
        aria-label={nextLabel}
        disabled={edges.atEnd}
        onClick={() => scroll('forward')}
        className={cn(arrowClass, '-end-3')}
      >
        <ChevronLeft className="size-5" aria-hidden />
      </button>
    </div>
  );
}
