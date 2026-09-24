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
| 11 | ~~Dark mode in scope?~~ **Yes** (2026-09-25) | — |
| 12 | Soft-delete retention period and who configures it | Delete/restore UI copy |
| 13 | Msg: actor access rules for conversations/messages (ASR, Adm) | Messaging UI when built |

## TBD facts (design / infra — not open product decisions)

| ID | Item | Context |
|---|---|---|
| T1 | Figma file URL / page names | Design system sources; frame IDs in code comments only |
| T2 | Display typography token scale | M3 scale added in `globals.css` (2026-09-25); migrate screens on touch |
| T3 | h1–h4 typography token scale | M3 headline/title tokens added (2026-09-25); migrate on touch |
| T4 | z-index scale | No explicit scale in `globals.css`; inline `z-[…]` in components |
| T5 | Overlay color token | `--color-overlay` added (2026-09-25); migrate `bg-black/…` on touch |
| T6 | Realtime for notifications/messages | No WebSocket client found; polling interval TBD |

## SRS problems

See [srs/README.md](./srs/README.md) → Known issues, Declared but not detailed, Review flags.

## Technical debt

| Issue | Location | Severity | Suggested fix |
|-------|----------|----------|----------------|
| `NEXT_PUBLIC_ACTOR_API_URL` gate disables queries when using `/api` proxy only | `private-panel` / `public-panel` `react-query.ts` | Resolved 2026-09-25 | Visitor profile loads without the public env; token optional |
| Hardcoded default interactive-ops backend host in `next.config.js` | `apps/usr/next.config.js` | **High** | Require env in prod; redact in docs |
| `/dashboard` protected but no page | `middleware.ts`, `auth-routes.ts` | **High** | Add page or remove links/guard |
| Auth OTP dev shortcuts / client-side OTP storage | `auth-forms.tsx`, `auth-flow.ts` | **High** | Remove before production |
| `TEMP_ADMIN_ACCESS_TOKEN` bypass | `temporary-admin-login.ts` | **High** | Restrict to non-prod or remove |
| Duplicated API error/HTTP layers | multiple `http.ts` files | Medium | Consolidate in `@daneshjoam/api-client` |
| No global toast / error boundary | app-wide | Medium | Add `error.tsx` + toast pattern |
| `--color-surface` name ≠ M3 `surface` | `globals.css` vs `docs/ai/m3-tokens.css` | Medium | Existing `bg-surface` = **card**. M3 v2 `surface` = **page**. Do not overwrite. Public-panel uses `background` + `surface-container-lowest` |
| Public-panel «دیدگاه‌های منتقل‌شده» product rule | `public-panel/components/comments/` | Medium | Keep client-side transfer; profile comment SRS not in `docs/srs` (not Msg) |
| Comments without API | `public-panel/components/comments/` | Medium | Stay behind `api/` + `mock/`; **not** Msg |
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
- 2026-09-25 — Dark mode is in scope. M3 tokens added; approved dark `primary` / `on-primary` / `error` / `on-error` overwrites. `--color-surface` left as “card”.
