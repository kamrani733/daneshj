'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { PanelNav, PanelPageShell } from '@/components/panel';

import { NOTIFICATIONS_NAV_ITEMS } from '@notifications/components/layout/nav-items';
import { NotificationsPageHeading } from '@notifications/components/layout/page-heading';

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
  const t = useTranslations('notifications.sidebar');
  const items = NOTIFICATIONS_NAV_ITEMS.map((item) => ({ ...item, label: t(item.key) }));

  return (
    <PanelPageShell
      heading={
        <NotificationsPageHeading
          titleKey={titleKey}
          breadcrumbCurrentKey={breadcrumbCurrentKey}
        />
      }
      nav={<PanelNav items={items} label={t('navLabel')} menuLabel={t('menuTrigger')} />}
      contentClassName={contentClassName}
    >
      {children}
    </PanelPageShell>
  );
}
