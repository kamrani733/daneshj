'use client';

import { COUNT_STATS, RATIO_STATS } from '@notifications/data/stats-mock';

import { NotificationsPageShell } from '../layout/page-shell';
import { StatCountCard } from './count-card';
import { StatRatioCard } from './ratio-card';

/** Notifications stats page — Figma سکشن آمار (2×2 KPI grid). */
export function NotificationsStatsView() {
  return (
    <NotificationsPageShell
      titleKey="stats.title"
      breadcrumbCurrentKey="stats.breadcrumbCurrent"
    >
      <div className="grid grid-cols-2 gap-3 min-[720px]:gap-5">
        {COUNT_STATS.map((stat) => (
          <StatCountCard key={stat.id} stat={stat} />
        ))}
        {RATIO_STATS.map((stat) => (
          <StatRatioCard key={stat.id} stat={stat} />
        ))}
      </div>
    </NotificationsPageShell>
  );
}
