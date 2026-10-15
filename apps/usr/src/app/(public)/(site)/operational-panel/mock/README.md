# MOCK ONLY — operational panel reports

Fake data and fake implementations for `/operational-panel/*` (reports, used services, wallet, interactions)
until endpoints are wired.

- Imported **only** by `@operational-panel/api` (never by components or hooks).
- Same shapes as `@operational-panel/types`; search, date range, enum filters, sort and 24-row pages are
  simulated in memory with the same request the real endpoint will receive.
- 60 rows per report (`fixtures.ts`), values copied from the Operational Panel export; newest first.
- Wallet summary card: `wallet-mock.ts` (balance, total spent, last update from the export).
- Latency: 350 ms per report call, 300 ms for the wallet summary.
- Error path: the query `خطای آزمایشی` rejects, so the error state + retry can be checked.
- The notifications report on the same page is **not** mocked here — it uses the Notification MS through
  `@notifications/api`.

Five reports have Auth MS owner endpoints to switch to (only `api/` changes) — see
`docs/plans/operational-panel.md`. Remove this folder when every report has an endpoint
(`docs/07-integrations.md`).
