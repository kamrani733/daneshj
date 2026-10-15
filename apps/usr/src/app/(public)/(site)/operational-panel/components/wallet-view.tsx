'use client';

import { OperationalShell } from '@operational-panel/components/operational-shell';
import { OperationalReportPanel } from '@operational-panel/components/report-panel';
import { WalletIntroBanner } from '@operational-panel/components/wallet-intro-banner';
import { WalletSummaryCard } from '@operational-panel/components/wallet-summary-card';

/** `/operational-panel/wallet` — export «Operational Panel۳»: intro banner, balance card, «سابقه تراکنش ها». */
export function OperationalWalletView({ displayName }: { displayName?: string }) {
  return (
    <OperationalShell section="wallet" displayName={displayName}>
      <WalletIntroBanner />
      <WalletSummaryCard />
      <OperationalReportPanel reportId="walletTransactions" showSort={false} />
    </OperationalShell>
  );
}
