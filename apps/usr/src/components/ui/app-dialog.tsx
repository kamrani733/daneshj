'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export type AppDialogAction = {
  label: string;
  onClick?: () => void;
  loading?: boolean;
  href?: string;
  /** Text-link tone when `actionsStyle="text"`. */
  tone?: 'default' | 'destructive' | 'muted';
};

export type AppDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: 'confirm' | 'content' | 'sheet';
  title: string;
  description?: string;
  children?: ReactNode;
  /** Optional media above the title (e.g. warning icon). */
  icon?: ReactNode;
  primaryAction?: AppDialogAction;
  secondaryAction?: AppDialogAction;
  actionsStyle?: 'default' | 'text';
  showCloseButton?: boolean;
  className?: string;
  dir?: 'rtl' | 'ltr';
};

const SHELL =
  'rounded-[28px] border-0 bg-home-search-fill shadow-home-elevation-2 ring-0 dark:bg-home-stat-card';

/** Figma XR dialog: 404×160, min 280 / max 560, radius 28 */
const CONFIRM_CONTENT = cn(
  SHELL,
  'w-[min(404px,calc(100%-2rem))] min-h-[160px] min-w-[280px] max-w-[560px]',
  'gap-6 p-6 text-right sm:max-w-[560px]'
);

const CONTENT_SHELL = cn(
  SHELL,
  'w-full min-w-[280px] max-w-[560px] gap-4 p-5 text-right'
);

const SHEET_SHELL = cn(
  'top-auto right-0 bottom-0 left-0 flex w-full max-w-none translate-x-0 translate-y-0 flex-col',
  'rounded-t-3xl rounded-b-none border-0 bg-home-header p-5',
  'pb-[max(1.25rem,env(safe-area-inset-bottom))] ring-0 shadow-home-elevation-3',
  'sm:max-w-none data-open:zoom-in-100 data-closed:zoom-out-100',
  'data-open:slide-in-from-bottom-4 data-closed:slide-out-to-bottom-4'
);

const GHOST =
  'h-auto border-0 bg-transparent px-2 py-2 text-sm font-medium text-primary shadow-none hover:bg-transparent hover:text-primary dark:text-primary-100';

const TEXT_LINK =
  'h-auto border-0 bg-transparent px-0 py-2 text-sm font-medium text-primary shadow-none hover:bg-transparent hover:text-primary dark:text-primary-100';

const TEXT_DESTRUCTIVE =
  'h-auto border-0 bg-transparent px-0 py-2 text-sm font-medium text-error shadow-none hover:bg-transparent hover:text-error';

const TEXT_MUTED =
  'h-auto border-0 bg-transparent px-0 py-2 text-sm font-medium text-home-filter-ink shadow-none hover:bg-transparent hover:text-home-filter-ink dark:text-home-filter-ink';

const PRIMARY_PILL =
  'h-11 min-w-[5.5rem] !rounded-full bg-primary px-8 text-sm font-medium text-white hover:bg-primary/90 dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-primary-100/90';

function textActionClass(tone: AppDialogAction['tone'] = 'default') {
  if (tone === 'destructive') return TEXT_DESTRUCTIVE;
  if (tone === 'muted') return TEXT_MUTED;
  return TEXT_LINK;
}

export function AppDialog({
  open,
  onOpenChange,
  variant = 'confirm',
  title,
  description,
  children,
  icon,
  primaryAction,
  secondaryAction,
  actionsStyle = 'default',
  showCloseButton = false,
  className,
  dir = 'rtl',
}: AppDialogProps) {
  const desc = description ?? title;

  if (variant === 'confirm') {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent dir={dir} className={cn(CONFIRM_CONTENT, className)}>
          <AlertDialogHeader
            className={cn(
              'w-full place-items-stretch !text-right',
              'sm:place-items-stretch sm:!text-right',
              icon && 'gap-4'
            )}
          >
            {icon ? (
              <div
                data-slot="alert-dialog-media"
                className="flex w-full justify-center"
              >
                {icon}
              </div>
            ) : null}
            <AlertDialogTitle
              dir="rtl"
              className="w-full text-right text-sm font-medium leading-7 text-home-filter-ink dark:text-primary-50"
            >
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="sr-only">
              {desc}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {(primaryAction || secondaryAction) && (
            <AlertDialogFooter className="mt-0 flex-row justify-end gap-4 border-0 bg-transparent p-0 sm:justify-end">
              {secondaryAction ? (
                <AlertDialogCancel
                  variant="ghost"
                  className={
                    actionsStyle === 'text'
                      ? textActionClass(secondaryAction.tone ?? 'muted')
                      : GHOST
                  }
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </AlertDialogCancel>
              ) : null}

              {primaryAction ? (
                primaryAction.href ? (
                  <Button asChild className={PRIMARY_PILL}>
                    <Link
                      href={primaryAction.href}
                      onClick={() => primaryAction.onClick?.()}
                    >
                      {primaryAction.label}
                    </Link>
                  </Button>
                ) : secondaryAction ? (
                  <AlertDialogAction
                    disabled={primaryAction.loading}
                    className={
                      actionsStyle === 'text'
                        ? textActionClass(primaryAction.tone)
                        : PRIMARY_PILL
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      primaryAction.onClick?.();
                    }}
                  >
                    {primaryAction.loading ? (
                      <Spinner
                        className="size-5"
                        aria-label={primaryAction.label}
                      />
                    ) : (
                      primaryAction.label
                    )}
                  </AlertDialogAction>
                ) : (
                  <AlertDialogCancel
                    variant="ghost"
                    className={
                      actionsStyle === 'text'
                        ? textActionClass(primaryAction.tone)
                        : GHOST
                    }
                    onClick={primaryAction.onClick}
                  >
                    {primaryAction.label}
                  </AlertDialogCancel>
                )
              ) : null}
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (variant === 'sheet') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          dir={dir}
          className={cn(SHEET_SHELL, className)}
        >
          <div className="flex flex-col items-center">
            <span
              aria-hidden
              className="mb-1 h-1 w-10 rounded-full bg-neutral-300 dark:bg-neutral-600"
            />
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <DialogDescription className="sr-only">{desc}</DialogDescription>
          </div>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        dir={dir}
        className={cn(CONTENT_SHELL, className)}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{desc}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
