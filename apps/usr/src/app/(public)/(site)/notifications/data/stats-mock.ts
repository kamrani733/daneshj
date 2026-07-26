import {
  Bell,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';

import type { ChartLabelKey } from './charts-mock';

export type StatTitleKey = Extract<
  ChartLabelKey,
  'systemReceived' | 'manualReceived' | 'readRatio' | 'linkClickRatio'
>;

export type CountStatConfig = {
  id: 'system' | 'manual';
  titleKey: Extract<StatTitleKey, 'systemReceived' | 'manualReceived'>;
  value: number;
  trendPercent: number;
  icon: LucideIcon;
};

export type RatioStatConfig = {
  id: 'unread' | 'linkClick';
  titleKey: Extract<StatTitleKey, 'readRatio' | 'linkClickRatio'>;
  value: number;
  total: number;
  percent: number;
  trendPercent: number;
  icon: LucideIcon;
};

/** Figma سکشن آمار — count KPIs (top row). */
export const COUNT_STATS: CountStatConfig[] = [
  {
    id: 'manual',
    titleKey: 'manualReceived',
    value: 120,
    trendPercent: 18,
    icon: Bell,
  },
  {
    id: 'system',
    titleKey: 'systemReceived',
    value: 130,
    trendPercent: 18,
    icon: Bell,
  },
];

/** Figma سکشن آمار — ratio KPIs (bottom row). */
export const RATIO_STATS: RatioStatConfig[] = [
  {
    id: 'unread',
    titleKey: 'readRatio',
    value: 120,
    total: 250,
    percent: 74,
    trendPercent: 18,
    icon: Bell,
  },
  {
    id: 'linkClick',
    titleKey: 'linkClickRatio',
    value: 130,
    total: 250,
    percent: 74,
    trendPercent: 18,
    icon: ClipboardList,
  },
];
