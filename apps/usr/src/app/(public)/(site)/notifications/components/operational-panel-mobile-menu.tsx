'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { NotificationsNavList } from './notifications-nav-list';

type OperationalPanelMobileMenuProps = {
  className?: string;
};

/** Mobile operational panel menu — trigger + bottom sheet (Figma). */
export function OperationalPanelMobileMenu({
  className,
}: OperationalPanelMobileMenuProps) {
  const t = useTranslations('notifications.sidebar');
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('w-full min-[720px]:hidden', className)}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          'flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-border bg-white px-4',
          'text-sm font-medium text-neutral-600 shadow-sm',
          'transition-colors hover:bg-home-search-fill'
        )}
      >
        <span>{t('menuTrigger')}</span>
        <ChevronDown className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className={cn(
            'top-auto right-0 bottom-0 left-0 w-full max-w-none translate-x-0 translate-y-0 sm:max-w-none',
            'gap-0 rounded-t-2xl rounded-b-none p-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]',
            'ring-0 data-open:zoom-in-100 data-closed:zoom-out-100',
            'data-open:slide-in-from-bottom-4 data-closed:slide-out-to-bottom-4'
          )}
        >
          <div className="flex flex-col items-center pt-3">
            <span
              aria-hidden
              className="mb-2 h-1 w-10 rounded-full bg-neutral-300"
            />
            <DialogTitle className="sr-only">{t('menuTrigger')}</DialogTitle>
          </div>
          <NotificationsNavList
            variant="sheet"
            onNavigate={() => setOpen(false)}
            className="px-1 pb-2"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
