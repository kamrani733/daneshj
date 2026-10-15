/** «کیف پول» summary card — provisional shape (mocked; no wallet endpoint in `docs/api/`). Amounts in toman. */
export type WalletSummary = {
  balance: number;
  totalSpent: number;
  /** ISO instant of the last balance update. */
  updatedAt: string;
};
