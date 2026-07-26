'use client';

import { NotificationsChartsPanel } from './notifications-charts-panel';
import { NotificationsPageHeading } from './notifications-page-heading';
import { NotificationsSidebar } from './notifications-sidebar';

/** Notifications charts page — Figma نمودارهای ثابت. */
export function NotificationsChartsView() {
  return (
    <div className="mx-auto flex w-full max-w-[1364px] flex-col gap-6 px-4 py-4 min-[1200px]:px-0">
      <NotificationsPageHeading
        titleKey="charts.title"
        breadcrumbCurrentKey="charts.breadcrumbCurrent"
      />

      <div className="flex w-full flex-col gap-6 min-[720px]:flex-row min-[720px]:items-start min-[720px]:gap-6 min-[1200px]:gap-[70px]">
        <NotificationsSidebar />
        <section className="min-w-0 flex-1">
          <NotificationsChartsPanel />
        </section>
      </div>
    </div>
  );
}
