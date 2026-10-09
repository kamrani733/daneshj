'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type PageItem = number | 'gap';

/** 1 2 3 … N window that follows the current page. */
export function buildPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (page <= 3) return [1, 2, 3, 'gap', totalPages];
  if (page >= totalPages - 2) {
    return [1, 'gap', totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, 'gap', page - 1, page, page + 1, 'gap', totalPages];
}

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

/** Figma pagination — LTR numbers, 48 px targets, active page on a tinted pill. */
export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  const t = useTranslations('common.pagination');
  const iconButtonClass =
    'size-12 rounded-full text-on-surface-variant hover:bg-on-surface/5 focus-visible:ring-primary/30';

  return (
    <nav
      dir="ltr"
      aria-label={t('label')}
      className={cn('flex items-center justify-center gap-4 min-[720px]:gap-8', className)}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t('prev')}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={iconButtonClass}
      >
        <ChevronLeft className="size-6" strokeWidth={1.5} aria-hidden />
      </Button>

      <div className="flex items-center">
        {buildPageItems(page, totalPages).map((item, index) =>
          item === 'gap' ? (
            <span
              key={`gap-${index}`}
              aria-hidden
              className="flex h-12 items-center justify-center px-3.5 text-label-large font-medium text-on-surface-variant"
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              variant="ghost"
              aria-current={item === page ? 'page' : undefined}
              aria-label={t('page', { page: item })}
              onClick={() => onPageChange(item)}
              className={cn(
                'h-12 min-w-12 rounded-full px-3.5 text-on-surface-variant hover:bg-on-surface/5 focus-visible:ring-primary/30',
                item === page && 'bg-on-surface/10 hover:bg-on-surface/10'
              )}
            >
              {/* Type token outside `cn()`: tailwind-merge reads custom sizes as colours. */}
              <span className="text-label-large font-medium">{formatFaNumber(item)}</span>
            </Button>
          )
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t('next')}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={iconButtonClass}
      >
        <ChevronRight className="size-6" strokeWidth={1.5} aria-hidden />
      </Button>
    </nav>
  );
}
