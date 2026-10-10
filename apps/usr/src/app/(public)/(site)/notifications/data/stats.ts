import type { ComponentType } from 'react';

import {
  LinkIcon,
  MarkEmailUnreadIcon,
  NotificationsIcon,
} from '@/components/icons/material-icons';
import type {
  StatisticsCountStat,
  StatisticsRatioStat,
} from '@notifications/api';

type StatIcon = ComponentType<{ className?: string }>;

export type CountStatConfig = StatisticsCountStat & {
  icon: StatIcon;
  trendPercent?: number;
};

export type RatioStatConfig = StatisticsRatioStat & {
  icon: StatIcon;
  trendPercent?: number;
};

/** Figma icons (operational panel «اعلانات» stats). */
const COUNT_ICONS: Record<StatisticsCountStat['id'], StatIcon> = {
  manual: NotificationsIcon,
  system: NotificationsIcon,
};

const RATIO_ICONS: Record<StatisticsRatioStat['id'], StatIcon> = {
  unread: MarkEmailUnreadIcon,
  linkClick: LinkIcon,
};

/** Attach Figma icons to API-mapped KPI rows. */
export function withStatIcons(
  countStats: StatisticsCountStat[],
  ratioStats: StatisticsRatioStat[]
): { countStats: CountStatConfig[]; ratioStats: RatioStatConfig[] } {
  return {
    countStats: countStats.map((stat) => ({
      ...stat,
      icon: COUNT_ICONS[stat.id],
    })),
    ratioStats: ratioStats.map((stat) => ({
      ...stat,
      icon: RATIO_ICONS[stat.id],
    })),
  };
}
