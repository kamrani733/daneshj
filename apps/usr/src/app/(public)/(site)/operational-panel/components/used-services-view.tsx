'use client';

import { OperationalShell } from '@operational-panel/components/operational-shell';
import { OperationalReportPanel } from '@operational-panel/components/report-panel';

/** `/operational-panel/used-services` — export «Operational Panel» › «سرویس‌های استفاده شده». */
export function OperationalUsedServicesView({ displayName }: { displayName?: string }) {
  return (
    <OperationalShell section="usedServices" displayName={displayName}>
      <OperationalReportPanel reportId="usedServices" variant="plain" />
    </OperationalShell>
  );
}
