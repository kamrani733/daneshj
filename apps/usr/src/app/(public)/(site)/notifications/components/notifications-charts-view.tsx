'use client';

import { NotificationsChartsPanel } from './notifications-charts-panel';
import { NotificationsPageShell } from './notifications-page-shell';

/** Notifications charts page — Figma نمودارهای ثابت. */
export function NotificationsChartsView() {
  return (
    <NotificationsPageShell
      titleKey="charts.title"
      breadcrumbCurrentKey="charts.breadcrumbCurrent"
    >
      <NotificationsChartsPanel />
    </NotificationsPageShell>
  );
}
