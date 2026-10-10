'use client';

import { Fragment } from 'react';

import { NotificationsReportsPanel } from '@notifications/components/reports/panel';
import { OperationalShell } from '@operational-panel/components/operational-shell';
import { OperationalReportPanel } from '@operational-panel/components/report-panel';
import { OPERATIONAL_REPORT_IDS } from '@operational-panel/types';

type OperationalReportsViewProps = {
  displayName?: string;
  accessToken?: string | null;
};

/** Export position of the notifications report (after the wallet report). */
const NOTIFICATIONS_AFTER = 'wallet';

/** `/operational-panel/reports` — Figma «پنل عملیاتی» › «گزارشات». */
export function OperationalReportsView({ displayName, accessToken }: OperationalReportsViewProps) {
  return (
    <OperationalShell section="reports" displayName={displayName}>
      {OPERATIONAL_REPORT_IDS.map((reportId) => (
        <Fragment key={reportId}>
          <OperationalReportPanel reportId={reportId} />
          {reportId === NOTIFICATIONS_AFTER ? <NotificationsReportsPanel accessToken={accessToken} /> : null}
        </Fragment>
      ))}
    </OperationalShell>
  );
}
