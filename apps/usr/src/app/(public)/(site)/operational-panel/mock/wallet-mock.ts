// MOCK ONLY — fake wallet summary (values from the «Operational Panel۳» export). Imported by `@operational-panel/api` only.
import type { WalletSummary } from '@operational-panel/types/wallet';

const LATENCY_MS = 300;

/** 1405/02/13 14:35 Tehran. */
const MOCK_WALLET_SUMMARY: WalletSummary = {
  balance: 112000,
  totalSpent: 452000,
  updatedAt: '2026-05-03T11:05:00.000Z',
};

export function mockGetWalletSummary(): Promise<WalletSummary> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_WALLET_SUMMARY), LATENCY_MS));
}
