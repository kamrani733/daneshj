---
title: "Known Issues & Gaps"
description: "Blockers, open questions, SRS problems, technical debt"
category: "meta"
last_updated: "2026-09-25"
---

# Known Issues & Gaps

## Open decisions (owner answers needed)

| # | Question | Blocks |
|---|---|---|
| 1 | Source of truth for actors/permissions (JWT claims, `loginType`, actor type)? | Auth helper, every guard |
| 2 | Are `apps/adm` and `apps/bus` planned frontends or scaffolding to delete? | Admin/provider panel location, Nx tags |
| 3 | Where are OpenAPI specs for Auth, Actor, Notification, Interactive Ops? | Generated types |
| 4 | Backend readiness for Msg, Dsc, Nws, Nwl, Cln, Rwd? | Mock vs real per service |
| 5 | Should `/dashboard` exist, or links point to `private-panel` / admin app? | Navigation |
| 6 | Is `NEXT_PUBLIC_ACTOR_API_URL` required in production or do `/api` rewrites suffice? | Config, security |
| 7 | Production domains and env matrix on Vercel? | Deployment |
| 8 | CI `e2e`: expected to pass? No Playwright project exists. | CI |
| 9 | Notification settings: fully backend-driven or permanently hybrid with `settings-mock.ts`? | Notification MS |
| 10 | Is there an SRS for the platform shell (auth, profiles, notifications, panels)? | Docs for built areas |
| 11 | Dark mode in scope? | Design system |
| 12 | Soft-delete retention period and who configures it | Delete/restore UI copy |

## SRS problems

See [srs/README.md](./srs/README.md) → Known issues, Declared but not detailed, Review flags.

## Technical debt

⟨FILL: table from audit §11 — issue, location, severity, fix⟩

## Deferred (explicitly OK for now)

| Item | Reason |
|---|---|
| Services with headings only in SRS | Not specified |
| Rewards cash-out / wallet top-up from rewards | Flagged red in SRS |

## Resolved

- 2026-09-25 — SRS converted to Markdown in `docs/srs/` (was open question: "Where is the SRS?").
- 2026-09-25 — Duplicate `files/srs/` to be removed; `docs/srs/` is canonical.
