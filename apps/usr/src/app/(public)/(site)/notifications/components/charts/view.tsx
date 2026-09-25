'use client';

import { NotificationsChartsPanel } from '@notifications/components/charts/panel';
import { NotificationsPageShell } from '@notifications/components/layout/page-shell';

type NotificationsChartsViewProps = {
  accessToken?: string | null;
  sessionUserId?: string | null;
};

/** Notifications charts page — actor or admin charts report (see `getChartsReport`). */
export function NotificationsChartsView({
  accessToken,
  sessionUserId,
}: NotificationsChartsViewProps) {
  return (
    <NotificationsPageShell
      titleKey="charts.title"
      breadcrumbCurrentKey="charts.breadcrumbCurrent"
    >
      <NotificationsChartsPanel
        accessToken={accessToken}
        sessionUserId={sessionUserId}
      />
    </NotificationsPageShell>
  );
}
