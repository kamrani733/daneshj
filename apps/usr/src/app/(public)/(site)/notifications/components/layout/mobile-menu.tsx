'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { AppDialog } from '@/components/ui/app-dialog';
import { cn } from '@/lib/utils';

import { NotificationsNavList } from './nav-list';

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
          'text-sm font-medium text-neutral-600 shadow-sm dark:bg-home-search-category dark:text-muted-foreground',
          'transition-colors hover:bg-home-search-fill'
        )}
      >
        <span>{t('menuTrigger')}</span>
        <ChevronDown className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
      </button>

      <AppDialog
        open={open}
        onOpenChange={setOpen}
        variant="sheet"
        title={t('menuTrigger')}
        className={cn(
          'gap-0 rounded-t-2xl p-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]',
          'bg-popover'
        )}
      >
        <NotificationsNavList
          variant="sheet"
          onNavigate={() => setOpen(false)}
          className="px-1 pb-2"
        />
      </AppDialog>
    </div>
  );
}
