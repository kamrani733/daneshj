import { redirect } from 'next/navigation';

import { OPERATIONAL_PANEL_REPORTS_PATH } from '@operational-panel/utils/paths';

/** `/operational-panel` — only «گزارشات» is designed so far. */
export default function OperationalPanelPage() {
  redirect(OPERATIONAL_PANEL_REPORTS_PATH);
}
