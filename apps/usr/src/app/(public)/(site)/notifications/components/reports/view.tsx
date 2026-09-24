'use client';

import { NotificationsPageShell } from '@notifications/components/layout/page-shell';
import { NotificationsReportsPanel } from '@notifications/components/reports/panel';

type NotificationsReportsViewProps = {
  accessToken?: string | null;
};

/** Notifications reports page — Figma گزارشات. */
export function NotificationsReportsView({
  accessToken,
}: NotificationsReportsViewProps) {
  return (
    <NotificationsPageShell
      titleKey="reports.title"
      breadcrumbCurrentKey="reports.breadcrumbCurrent"
    >
      <NotificationsReportsPanel accessToken={accessToken} />
    </NotificationsPageShell>
  );
}
