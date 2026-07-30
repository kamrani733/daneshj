'use client';

import { NotificationsChartsPanel } from './notifications-charts-panel';
import { NotificationsPageShell } from './notifications-page-shell';

type NotificationsChartsViewProps = {
  accessToken?: string | null;
};

/** Notifications charts page — Figma نمودار + charts_report API. */
export function NotificationsChartsView({
  accessToken,
}: NotificationsChartsViewProps) {
  return (
    <NotificationsPageShell
      titleKey="charts.title"
      breadcrumbCurrentKey="charts.breadcrumbCurrent"
    >
      <NotificationsChartsPanel accessToken={accessToken} />
    </NotificationsPageShell>
  );
}
