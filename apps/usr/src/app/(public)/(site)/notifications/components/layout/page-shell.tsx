'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { NotificationsNav } from './nav';
import { NotificationsPageHeading } from './page-heading';

type NotificationsPageShellProps = {
  children: ReactNode;
  titleKey?: string;
  breadcrumbCurrentKey?: string;
  contentClassName?: string;
};

/** Shared page chrome for notifications list / charts routes. */
export function NotificationsPageShell({
  children,
  titleKey,
  breadcrumbCurrentKey,
  contentClassName,
}: NotificationsPageShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1364px] flex-col gap-6 px-4 py-4 min-[1200px]:px-0">
      <NotificationsPageHeading
        titleKey={titleKey}
        breadcrumbCurrentKey={breadcrumbCurrentKey}
      />

      <div className="flex w-full flex-col gap-4 min-[720px]:flex-row min-[720px]:items-start min-[720px]:gap-6 min-[1200px]:gap-[70px]">
        <NotificationsNav />
        <section className={cn('min-w-0 flex-1', contentClassName)}>
          {children}
        </section>
      </div>
    </div>
  );
}
