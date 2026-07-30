'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type PageItem = number | 'gap';

/** 1 2 3 … N style window that follows the current page. */
function buildPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (page <= 3) return [1, 2, 3, 'gap', totalPages];
  if (page >= totalPages - 2) {
    return [1, 'gap', totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, 'gap', page - 1, page, page + 1, 'gap', totalPages];
}

type NotificationsPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/** Figma pagination #2392:4596 — LTR numbers, 48px hit targets, active gray pill. */
export function NotificationsPagination({
  page,
  totalPages,
  onPageChange,
}: NotificationsPaginationProps) {
  const t = useTranslations('notifications.pagination');

  return (
    <nav
      dir="ltr"
      aria-label={t('label')}
      className="flex items-center justify-center gap-8 pt-1"
    >
      <PagerIconButton
        label={t('prev')}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-6" strokeWidth={1.5} />
      </PagerIconButton>

      <div className="flex items-center">
        {buildPageItems(page, totalPages).map((item, index) =>
          item === 'gap' ? (
            <span
              key={`gap-${index}`}
              aria-hidden
              className="flex h-12 items-center justify-center px-3.5 text-sm font-medium text-green-700 dark:text-muted-foreground"
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
                'h-12 min-w-8 rounded-full px-3.5 text-sm font-medium text-green-700 hover:bg-black/5 dark:text-muted-foreground dark:hover:bg-white/5',
                item === page &&
                  'bg-black/10 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/10'
              )}
            >
              {formatFaNumber(item)}
            </Button>
          )
        )}
      </div>

      <PagerIconButton
        label={t('next')}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="size-6" strokeWidth={1.5} />
      </PagerIconButton>
    </nav>
  );
}

function PagerIconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="size-12 rounded-full text-green-700 hover:bg-black/5 dark:text-muted-foreground dark:hover:bg-white/5"
    >
      {children}
    </Button>
  );
}
