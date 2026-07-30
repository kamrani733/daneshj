import {
  Bell,
  ChartColumn,
  ChartNoAxesColumn,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';

import { NOTIFICATIONS_PATH } from '@notifications/data/notifications-ui';

export const CHARTS_PATH = `${NOTIFICATIONS_PATH}/charts`;
export const STATS_PATH = `${NOTIFICATIONS_PATH}/stats`;
export const REPORTS_PATH = `${NOTIFICATIONS_PATH}/reports`;

export type NotificationsNavKey =
  | 'received'
  | 'reports'
  | 'stats'
  | 'charts';

export type NotificationsNavItem = {
  key: NotificationsNavKey;
  href: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
};

export const NOTIFICATIONS_NAV_ITEMS: NotificationsNavItem[] = [
  {
    key: 'received',
    href: NOTIFICATIONS_PATH,
    icon: Bell,
    match: (pathname) =>
      pathname === NOTIFICATIONS_PATH || pathname === `${NOTIFICATIONS_PATH}/`,
  },
  {
    key: 'reports',
    href: REPORTS_PATH,
    icon: ClipboardList,
    match: (pathname) =>
      pathname === REPORTS_PATH || pathname.startsWith(`${REPORTS_PATH}/`),
  },
  {
    key: 'stats',
    href: STATS_PATH,
    icon: ChartColumn,
    match: (pathname) =>
      pathname === STATS_PATH || pathname.startsWith(`${STATS_PATH}/`),
  },
  {
    key: 'charts',
    href: CHARTS_PATH,
    icon: ChartNoAxesColumn,
    match: (pathname) =>
      pathname === CHARTS_PATH || pathname.startsWith(`${CHARTS_PATH}/`),
  },
];
