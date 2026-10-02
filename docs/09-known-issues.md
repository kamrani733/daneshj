---
title: "Known Issues & Gaps"
description: "Blockers, open questions, SRS problems, technical debt"
category: "meta"
last_updated: "2026-10-02"
---

# Known Issues & Gaps

## Open decisions (owner answers needed)

| # | Question | Blocks |
|---|---|---|
| 2 | Are `apps/adm` and `apps/bus` planned frontends or scaffolding to delete? | Admin/provider panel location, Nx tags |
| 4 | Backend readiness for Msg, Dsc, Nws, Nwl, Cln, Rwd? | Mock vs real per service |
| 5 | Should `/dashboard` exist, or links point to `private-panel` / admin app? | Navigation |
| 6 | Is `NEXT_PUBLIC_ACTOR_API_URL` required in production or do `/api` rewrites suffice? | Config, security |
| 7 | Production domains and env matrix on Vercel? | Deployment |
| 8 | CI `e2e`: expected to pass? No Playwright project exists. | CI |
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

## Backend questions (OpenAPI vs `apps/usr`)

Repo specs: [`docs/api/`](./api/) — index in [`docs/api/README.md`](./api/README.md). Compare with Notification calls in `apps/usr/src/app/(public)/(site)/notifications/api/notifications.ts`, settings in `notifications/hooks/use-notifications-settings.ts` + `notifications/data/settings-mock.ts`, header bell in `apps/usr/src/components/site/notifications-panel.tsx`, and Interactive Ops in `apps/usr/src/app/(public)/(site)/public-panel/api/interactive-ops.ts`.

| ID | Question for backend | Severity | Code assumes | Spec (`notification-ms` / `interactive-ops-ms`) |
|---|---|---|---|---|
| B1 | Should logged-in **User** (and other non-Admin actor types) call `GET /notification/actor-notifications/unread-count` for the site header badge? | **High** | User session Bearer on unread-count (`notifications.ts`, `notifications-panel.tsx`) | `AdminBearerAuth` only |
| B2 | Should actors load prefs via `GET /notification/actor-settings/list`, or is another actor-scoped list endpoint planned? | **High** | User Bearer on settings page (`getActorSettings` / `useActorSettingsQuery`) | `AdminBearerAuth` only (`create` allows all actor types) |
| B3 | Will `POST /notification/actor-notifications/click/{recipient_id}` be opened to the notification recipient actor types (SRS link-click tracking)? | Medium | Not wired yet; inbox uses read endpoints only | `AdminBearerAuth` only |
| B4 | Will actors get a read-only categories API (e.g. extend `GET /notification/category/list` or a new list-for-actor path) for settings UI and filter trees? | **High** | Category tree and `categoryId` values come from `settings-mock.ts` and `notifications-filter-data.ts` (no `category/list` call) | `GET /notification/category/list` is Admin-only |
| B6 | Confirm mark-read URL: is the contract `POST .../read/{sent_notification_id}` only, or is `POST .../{sent_notification_id}/read` also supported? | Medium | Frontend uses spec path `…/read/{sent_notification_id}` (2026-09-25). Owner saw 404 on `…/{id}/read` in browser | OpenAPI: `POST /notification/actor-notifications/read/{sent_notification_id}` |
| B7 | Interactive Ops: what authentication and authorization apply to follow/like/score/share and list/average GETs in production? | **High** | Sends `Authorization: Bearer` when the visitor is logged in; no actor-type checks in the client | OpenAPI sets `security: null` (no scheme) on all `/interactive-ops/*` product endpoints except `test_api` |

## SRS problems

See [srs/README.md](./srs/README.md) → Known issues, Declared but not detailed, Review flags.

## Technical debt

| Issue | Location | Severity | Suggested fix |
|-------|----------|----------|----------------|
| `NEXT_PUBLIC_ACTOR_API_URL` gate disables queries when using `/api` proxy only | `private-panel` / `public-panel` `react-query.ts` | Resolved 2026-09-25 | Visitor profile loads without the public env; token optional |
| Hardcoded default interactive-ops backend host in `next.config.js` | `apps/usr/next.config.js` | **High** | Require env in prod; redact in docs |
| `/dashboard` protected but no page | `middleware.ts`, `auth-routes.ts` | **High** | Add page or remove links/guard |
| Auth OTP dev shortcuts / client-side OTP storage | `auth-forms.tsx`, `auth-flow.ts` | **High** | Remove before production |
| Server-side auth (server actions) vs Auth MS network policy | `auth-flow-actions.ts`, `auth/api/auth.ts` | **High** | Auth calls now run server-side (server actions). If Auth MS rejects traffic from outside Iran, login will fail on Vercel. Confirm with backend before deploying. |
| `TEMP_ADMIN_ACCESS_TOKEN` bypass | `temporary-admin-login.ts` | **High** | Restrict to non-prod or remove |
| Duplicated API error/HTTP layers | multiple `http.ts` files | Medium | Consolidate in `@daneshjoam/api-client` |
| No global toast / error boundary | app-wide | Medium | Add `error.tsx` + toast pattern |
| `foreground` vs `on-surface` | `globals.css` | Low | shadcn `--color-foreground` dark `#eff1ed` vs Figma `on-surface` dark `#dee4de` — unify later |
| Public-panel «دیدگاه‌های منتقل‌شده» product rule | `public-panel/components/comments/` | Medium | Keep client-side transfer; profile comment SRS not in `docs/srs` (not Msg) |
| Comments without API | `public-panel/components/comments/` | Medium | Stay behind `api/` + `mock/`; **not** Msg |
| Home search entirely mock | `home/data/search-mock.ts` | Medium | Integrate SRV search API |
| Large unmaintainable files (>300 lines) | Multiple — see audit §11 | Medium | Split by tab/section |
| CI runs `e2e` with no Playwright project | `.github/workflows/ci.yml` | Medium | Add e2e app or drop target |
| Followers dialog «حذف» calls unfollow | `public-panel/hooks/use-profile-stats-bar.ts` | Medium | Needs an Interactive Ops "remove follower" endpoint |
| Panel comments are client-only (post, reply, delete, restore, feature, report) | `public-panel/components/comments/` | Medium | Wire when the panel-comment API exists (profile SRS TBD, not Msg) |
| Dislike count: Expectation doc says admin-only, some Figma frames show it to visitors | `public-panel/capabilities.ts` (`showDislikes`) | Low | Follows the doc; confirm with design |
| Feature star shown on visitor frames, but role table says owner-only | `public-panel/capabilities.ts` (`commentFeature`) | Low | Follows the doc; confirm with design |
| Stats-bar action counts differ between Figma frames (with / without numbers) | `public-panel/components/profile/stats-bar.tsx` | Low | Counts kept (like, share); confirm |
| No electronic card in Actor MS | `private-panel/api/profile-mappers.ts` | Medium | Public panel hides the e-card CTA until a link exists |
| Certificates removed from «سایر اطلاعات» | `public-panel/components/catalog/other-info-panel.tsx` | Low | Not in Figma, Expectation report or Actor API; type kept |
| Hero card background pattern not implemented | `components/panel/profile-hero-card.tsx` | Low | Asset not in repo; plan forbids downloading it from Figma |
| Home category search bar not in the home Figma | `home/components/home-search-shell.tsx` | Low | Kept because search results depend on it; confirm |
| Figma MCP Starter-plan call limit | design workflow | Medium | Exports (SVG) used as fallback; upgrade plan or keep exports in `docs/design-specs/` notes |
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

- 2026-09-25 — **B5 (notification stats/charts endpoints):** Non-admin sessions call `actor_statistics_report` / `actor_charts_report`; admin sessions keep `statistics_report` / `charts_report`. Routing uses `isAdminActorUserId` in `apps/usr/src/lib/session-actor.ts`.
- 2026-09-25 — **Open decision 9 (notification settings mock):** Hybrid until actors can load category metadata from the API. `GET /notification/category/list` is **Admin-only** in [`notification-ms.openapi.yaml`](./api/notification-ms.openapi.yaml), so the Figma settings tree and `categoryId` mapping stay in `settings-mock.ts`; `actor-settings/list` (also Admin-only in the spec) plus `actor-settings/create` (all actor types) hydrate/save channel prefs. Revisit when backend exposes categories (and optionally settings list) to User/provider tokens.
- 2026-09-25 — **Open decision 3 (OpenAPI location):** All four microservice specs live in [`docs/api/`](./api/) (`auth-ms.openapi.yaml`, `actor-ms.openapi.yaml`, `notification-ms.openapi.yaml`, `interactive-ops-ms.openapi.yaml`) with an endpoint index in [`docs/api/README.md`](./api/README.md).
- 2026-09-25 — **Open decision 1 (permission source):** Frontend permission matrices come from Auth MS — `GET /actor_accesses/get_access_actor` for authenticated actors (Bearer per actor type) and `GET /actor_accesses/get_access_guest` for guests. JWT / `loginType` / token info remain for **identity and session**, not as the authoritative operation-level grant list. **Actor-type mismatch:** OpenAPI security schemes name five actor types — **User, Admin, University, Industry, Business** (see `docs/api/README.md`). SRS actor codes are three product roles — **Usr**, **ASR** (provider), **Adm** — plus Guest. Map API types to SRS at the UI/guard layer (e.g. University/Industry/Business → provider panels; User → student account) until SRS or backend align naming.
- 2026-09-25 — SRS converted to Markdown in `docs/srs/` (was open question: "Where is the SRS?").
- 2026-09-25 — Duplicate `files/srs/` to be removed; `docs/srs/` is canonical.
- 2026-09-25 — Scaffold page specs removed (`apps/usr/specs/index.spec.tsx`, `apps/adm/specs/index.spec.tsx`). They imported a page module that does not exist and cannot render async server components. `jalali.ts` and `format-fa.ts` now have unit tests. `apps/adm` Jest passes with no tests (`passWithNoTests`).
- 2026-09-25 — Dark mode is in scope. M3 tokens added; approved dark `primary` / `on-primary` / `error` / `on-error` overwrites. `--color-surface` left as “card”.
- 2026-09-25 — Figma variable names are the source of truth (v3). `surface`, `background`, `on-surface` (dark), `secondary` take Figma values; card usages moved to `surface-container-lowest`, shadcn neutral `secondary` variants to `surface-container-highest` / `on-surface`.
