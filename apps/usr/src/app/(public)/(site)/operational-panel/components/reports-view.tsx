'use client';

import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

import { PanelBreadcrumb, PanelNav, PanelPageShell } from '@/components/panel';
import { SectionHeading } from '@/components/ui/section-heading';

import { NotificationsReportsPanel } from '@notifications/components/reports/panel';
import { OPERATIONAL_PANEL_NAV_ITEMS } from '@operational-panel/components/nav-items';
import { OperationalReportPanel } from '@operational-panel/components/report-panel';
import { OPERATIONAL_REPORT_IDS } from '@operational-panel/types';

type OperationalReportsViewProps = {
  displayName?: string;
  accessToken?: string | null;
};

/** Export position of the notifications report (after the wallet report). */
const NOTIFICATIONS_AFTER = 'wallet';

/** `/operational-panel/reports` — Figma «پنل عملیاتی» › «گزارشات». */
export function OperationalReportsView({ displayName, accessToken }: OperationalReportsViewProps) {
  const t = useTranslations('operationalPanel');
  const items = OPERATIONAL_PANEL_NAV_ITEMS.map((item) => ({ ...item, label: t(`nav.${item.key}`) }));

  return (
    <PanelPageShell
      heading={
        <header className="flex w-full flex-col items-start gap-4">
          <PanelBreadcrumb
            label={t('breadcrumb.label')}
            home={t('breadcrumb.home')}
            account={t('breadcrumb.account')}
            current={t('title')}
          />
          <div className="flex flex-col gap-1">
            <SectionHeading title={t('title')} as="h1" align="start" size="responsive" />
            {displayName ? (
              <p className="px-2 text-body-medium text-on-surface-variant">{displayName}</p>
            ) : null}
          </div>
        </header>
      }
      nav={<PanelNav items={items} label={t('nav.label')} menuLabel={t('nav.menu')} compactOnTablet />}
      contentClassName="flex flex-col gap-6"
    >
      {OPERATIONAL_REPORT_IDS.map((reportId) => (
        <Fragment key={reportId}>
          <OperationalReportPanel reportId={reportId} />
          {reportId === NOTIFICATIONS_AFTER ? <NotificationsReportsPanel accessToken={accessToken} /> : null}
        </Fragment>
      ))}
    </PanelPageShell>
  );
}
