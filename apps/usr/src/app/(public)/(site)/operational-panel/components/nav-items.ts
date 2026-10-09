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

import { OPERATIONAL_PANEL_REPORTS_PATH } from '@operational-panel/utils/paths';

/**
 * Sidebar of the Operational Panel export. Only «گزارشات» has a design; the others stay visible but
 * disabled (no `href`) until their designs arrive. Labels: `operationalPanel.nav.<key>`.
 */
export const OPERATIONAL_PANEL_NAV_ITEMS: Array<Omit<PanelNavItem, 'label'>> = [
  { key: 'usedServices', icon: FormatListBulletedIcon },
  { key: 'manageServices', icon: ArchiveIcon },
  { key: 'wallet', icon: WalletIcon },
  { key: 'reports', icon: AssignmentIcon, href: OPERATIONAL_PANEL_REPORTS_PATH },
  { key: 'stats', icon: AssessmentIcon },
  { key: 'charts', icon: BarChartIcon },
  { key: 'interactions', icon: RecommendIcon },
];
