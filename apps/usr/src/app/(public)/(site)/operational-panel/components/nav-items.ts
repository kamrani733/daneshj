import {
  ArchiveIcon,
  AssessmentIcon,
  AssignmentIcon,
  BarChartIcon,
  FormatListBulletedIcon,
  RecommendIcon,
  WalletIcon,
} from '@/components/icons/material-icons';
import type { PanelNavItem } from '@/components/panel';

import {
  OPERATIONAL_PANEL_CHARTS_PATH,
  OPERATIONAL_PANEL_INTERACTIONS_PATH,
  OPERATIONAL_PANEL_MANAGE_SERVICES_PATH,
  OPERATIONAL_PANEL_REPORTS_PATH,
  OPERATIONAL_PANEL_STATS_PATH,
  OPERATIONAL_PANEL_USED_SERVICES_PATH,
  OPERATIONAL_PANEL_WALLET_PATH,
} from '@operational-panel/utils/paths';

export type OperationalNavKey =
  | 'usedServices'
  | 'manageServices'
  | 'wallet'
  | 'reports'
  | 'stats'
  | 'charts'
  | 'interactions';

/** Sidebar of the Operational Panel export. An item without `href` renders disabled. Labels: `operationalPanel.nav.<key>`. */
export const OPERATIONAL_PANEL_NAV_ITEMS: Array<Omit<PanelNavItem, 'label'> & { key: OperationalNavKey }> = [
  { key: 'usedServices', icon: FormatListBulletedIcon, href: OPERATIONAL_PANEL_USED_SERVICES_PATH },
  { key: 'manageServices', icon: ArchiveIcon, href: OPERATIONAL_PANEL_MANAGE_SERVICES_PATH },
  { key: 'wallet', icon: WalletIcon, href: OPERATIONAL_PANEL_WALLET_PATH },
  { key: 'reports', icon: AssignmentIcon, href: OPERATIONAL_PANEL_REPORTS_PATH },
  { key: 'stats', icon: AssessmentIcon, href: OPERATIONAL_PANEL_STATS_PATH },
  { key: 'charts', icon: BarChartIcon, href: OPERATIONAL_PANEL_CHARTS_PATH },
  { key: 'interactions', icon: RecommendIcon, href: OPERATIONAL_PANEL_INTERACTIONS_PATH },
];
