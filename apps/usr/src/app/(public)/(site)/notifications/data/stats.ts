import { Bell, ClipboardList, type LucideIcon } from 'lucide-react';

import type {
  StatisticsCountStat,
  StatisticsRatioStat,
} from '@notifications/api';

export type CountStatConfig = StatisticsCountStat & {
  icon: LucideIcon;
  trendPercent?: number;
};

export type RatioStatConfig = StatisticsRatioStat & {
  icon: LucideIcon;
  trendPercent?: number;
};

const COUNT_ICONS: Record<StatisticsCountStat['id'], LucideIcon> = {
  manual: Bell,
  system: Bell,
};

const RATIO_ICONS: Record<StatisticsRatioStat['id'], LucideIcon> = {
  unread: Bell,
  linkClick: ClipboardList,
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
