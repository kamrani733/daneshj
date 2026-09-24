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
| 13 | Msg: actor access rules for conversations/messages (ASR, Adm) | Messaging UI when built |

## TBD facts (design / infra — not open product decisions)

| ID | Item | Context |
|---|---|---|
| T1 | Figma file URL / page names | Design system sources; frame IDs in code comments only |
| T2 | Display typography token scale | No explicit tokens; Tailwind defaults in use |
| T3 | h1–h4 typography token scale | No explicit tokens; Tailwind defaults in use |
| T4 | z-index scale | No explicit scale in `globals.css`; inline `z-[…]` in components |
| T5 | Overlay color token | No `--color-overlay` for modal backdrops |
| T6 | Realtime for notifications/messages | No WebSocket client found; polling interval TBD |

## SRS problems

See [srs/README.md](./srs/README.md) → Known issues, Declared but not detailed, Review flags.

## Technical debt

| Issue | Location | Severity | Suggested fix |
|-------|----------|----------|----------------|
| `NEXT_PUBLIC_ACTOR_API_URL` gate disables queries when using `/api` proxy only | `private-panel/api/react-query.ts`, `public-panel/api/react-query.ts` | **High** | Enable when `accessToken` + same-origin `/api`, or set public env |
| Hardcoded default interactive-ops backend host in `next.config.js` | `apps/usr/next.config.js` | **High** | Require env in prod; redact in docs |
| `/dashboard` protected but no page | `middleware.ts`, `auth-routes.ts` | **High** | Add page or remove links/guard |
| Auth OTP dev shortcuts / client-side OTP storage | `auth-forms.tsx`, `auth-flow.ts` | **High** | Remove before production |
| `TEMP_ADMIN_ACCESS_TOKEN` bypass | `temporary-admin-login.ts` | **High** | Restrict to non-prod or remove |
| Duplicated API error/HTTP layers | multiple `http.ts` files | Medium | Consolidate in `@daneshjoam/api-client` |
| No global toast / error boundary | app-wide | Medium | Add `error.tsx` + toast pattern |
| Comments/messaging without API | `comments/section.tsx` | Medium | Wire Msg service or mark UI-only |
| Home search entirely mock | `home/data/search-mock.ts` | Medium | Integrate SRV search API |
| Large unmaintainable files (>300 lines) | Multiple — see audit §11 | Medium | Split by tab/section |
| CI runs `e2e` with no Playwright project | `.github/workflows/ci.yml` | Medium | Add e2e app or drop target |
| Tailwind version mismatch in package.json | `apps/usr/package.json` vs root | Low | Align declarations |
| `any` in TS | only `apps/*/index.d.ts` (image types) | Low | — |

### Component consolidation needed

| Pair | Issue |
|------|-------|
| `dialog.tsx` vs `app-dialog.tsx` | Both provide modal dialogs |
| `outlined-field.tsx` vs `floating-input.tsx` vs `underline-field.tsx` | Three field variants |

### Hardcoded colors needing token migration

See [10-design-system.md](./10-design-system.md#hardcoded-colors-in-code-should-map-to-tokens) for the full list.

## Deferred (explicitly OK for now)

| Item | Reason |
|---|---|
| Services with headings only in SRS | Not specified |
| Rewards cash-out / wallet top-up from rewards | Flagged red in SRS |

## Resolved

- 2026-09-25 — SRS converted to Markdown in `docs/srs/` (was open question: "Where is the SRS?").
- 2026-09-25 — Duplicate `files/srs/` to be removed; `docs/srs/` is canonical.
- 2026-09-25 — Scaffold page specs removed (`apps/usr/specs/index.spec.tsx`, `apps/adm/specs/index.spec.tsx`). They imported a page module that does not exist and cannot render async server components. `jalali.ts` and `format-fa.ts` now have unit tests. `apps/adm` Jest passes with no tests (`passWithNoTests`).
