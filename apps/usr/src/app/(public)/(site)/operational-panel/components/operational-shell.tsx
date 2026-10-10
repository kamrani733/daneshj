'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { PanelBreadcrumb, PanelNav, PanelPageShell } from '@/components/panel';
import { SectionHeading } from '@/components/ui/section-heading';

import { OPERATIONAL_PANEL_NAV_ITEMS, type OperationalNavKey } from '@operational-panel/components/nav-items';

type OperationalShellProps = {
  /** Current sidebar item — named in the phone menu trigger. */
  section: OperationalNavKey;
  displayName?: string;
  children: ReactNode;
};

/** Figma «پنل عملیاتی» chrome: breadcrumb, title + user name, sticky sidebar / phone menu sheet. */
export function OperationalShell({ section, displayName, children }: OperationalShellProps) {
  const t = useTranslations('operationalPanel');
  const items = OPERATIONAL_PANEL_NAV_ITEMS.map((item) => ({ ...item, label: t(`nav.${item.key}`) }));

  return (
    <PanelPageShell
      heading={
        <header className="flex w-full flex-col items-start gap-4">
          <PanelBreadcrumb
            collapseOnPhone={false}
            label={t('breadcrumb.label')}
            home={t('breadcrumb.home')}
            account={t('breadcrumb.account')}
            current={t('title')}
          />
          <div className="flex flex-col gap-1">
            <SectionHeading title={t('title')} as="h1" align="start" size="responsive" />
            {displayName ? <p className="px-2 text-body-medium text-on-surface-variant">{displayName}</p> : null}
          </div>
        </header>
      }
      nav={
        <PanelNav
          items={items}
          label={t('nav.label')}
          menuLabel={t('nav.menuWithSection', { section: t(`nav.${section}`) })}
          compactOnTablet
          centeredMenuTrigger
        />
      }
      contentClassName="flex flex-col gap-6"
    >
      {children}
    </PanelPageShell>
  );
}
