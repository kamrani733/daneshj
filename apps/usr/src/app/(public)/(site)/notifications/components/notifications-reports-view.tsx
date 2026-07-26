'use client';

import { NotificationsPageShell } from './notifications-page-shell';
import { NotificationsReportsPanel } from './notifications-reports-panel';

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
