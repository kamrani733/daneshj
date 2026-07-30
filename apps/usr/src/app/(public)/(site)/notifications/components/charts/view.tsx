'use client';

import { NotificationsChartsPanel } from './panel';
import { NotificationsPageShell } from '../layout/page-shell';

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
