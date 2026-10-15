---
title: "Known Issues & Gaps"
description: "Blockers, open questions, SRS problems, technical debt"
category: "meta"
last_updated: "2026-10-15"
---

# Known Issues & Gaps

## Open decisions (owner answers needed)

| # | Question | Blocks |
|---|---|---|
| 2 | Are `apps/adm` and `apps/bus` planned frontends or scaffolding to delete? | Admin/provider panel location, Nx tags |
| 4 | Backend readiness for Msg, Dsc, Nws, Nwl, Cln, Rwd? | Mock vs real per service |
| 5 | Should `/dashboard` exist, or links point to `private-panel` / admin app? «پنل عملیاتی» now opens `/operational-panel`; «عملیات سطح عضویت», «مدیریت سشن ها», «تنظیمات امنیتی» still point to `/dashboard` | Navigation |
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
| Global search (`/search`) entirely mock; no search endpoint in any OpenAPI spec | `app/(public)/search/mock/` | Medium | Backend to provide one search endpoint (products, services, providers, users + product filter by service/categories); only `search/api/` changes |
| `/search` built from screenshots only — Figma MCP limit reached (filter frames `422:59585` … `422:60438` listed in `ai/figma-map.md` but never read) | `docs/design-specs/search/search-results.md` | Medium | Verify spacing/colours against the Figma frames when MCP calls are available |
| `/search` frames disagree: desktop «محصولات» hides the filter actions until a service is picked (tablet/mobile show them); mobile frames show no «مشاهده همه» although groups have more results | `search/components/` | Low | Implemented: actions always shown; «مشاهده همه» kept on phones (otherwise results past the 4-card preview are unreachable) — confirm with design |
| Duplicate illustration: `public/images/home/Empty state1.svg` was copied to `public/images/states/no-result.svg` (kebab-case, shared folder); the original could not be deleted from here | `apps/usr/public/images/home/` | Low | Delete `home/Empty state1.svg` |
| `cn()` (tailwind-merge) drops custom font-size classes (`text-label-large`, `text-title-small`, …) when a text colour is in the same call — it reads them as colours | `lib/utils.ts` — e.g. `CountChip`, `Badge` | Medium | `extendTailwindMerge` with the M3 type scale (changes how existing components render — confirm first). New `/search` code keeps sizes outside `cn()` |
| Large unmaintainable files (>300 lines) | Multiple — see audit §11 | Medium | Split by tab/section |
| CI runs `e2e` with no Playwright project | `.github/workflows/ci.yml` | Medium | Add e2e app or drop target |
| Followers dialog «حذف» calls unfollow | `public-panel/hooks/use-profile-stats-bar.ts` | Medium | Needs an Interactive Ops "remove follower" endpoint |
| Panel comments are client-only (post, reply, delete, restore, feature, report) | `public-panel/components/comments/` | Medium | Wire when the panel-comment API exists (profile SRS TBD, not Msg) |
| Dislike count: Expectation doc says admin-only, some Figma frames show it to visitors | `public-panel/capabilities.ts` (`showDislikes`) | Low | Follows the doc; confirm with design |
| Feature / transfer / reply icons on comment cards | `public-panel/components/comments/card.tsx` | Low | Figma draws all five icons; clicks still follow the role table (owner features, visitor transfers) |
| Stats-bar action counts differ between Figma frames (with / without numbers) | `public-panel/components/profile/stats-bar.tsx` | Low | Counts kept (like, share); confirm |
| No electronic card in Actor MS | `private-panel/api/profile-mappers.ts` | Medium | Public panel hides the e-card CTA until a link exists |
| Certificates removed from «سایر اطلاعات» | `public-panel/components/catalog/other-info-panel.tsx` | Low | Not in Figma, Expectation report or Actor API; type kept |
| Hero card background pattern not implemented | `components/panel/profile-hero-card.tsx` | Low | Asset not in repo; plan forbids downloading it from Figma |
| Old home search results unused: the header search now opens `/search` (2026-10-07) | `home/components/home-search-results.tsx`, `HomeSearchCategoryBar` in `components/site/site-header.tsx` | Low | Delete with `home/data/search-mock.ts`; owner to decide |
| Figma MCP Starter-plan call limit | design workflow | Medium | Exports (SVG) used as fallback; upgrade plan or keep exports in `docs/design-specs/` notes |
| Tailwind version mismatch in package.json | `apps/usr/package.json` vs root | Low | Align declarations |
| `any` in TS | only `apps/*/index.d.ts` (image types) | Low | — |

### Operational panel (2026-10-10)

| Issue | Location | Severity | Next step |
|-------|----------|----------|-----------|
| Every operational report, stat and chart is mocked (owner decision) — 5 Auth MS owner reports exist | `operational-panel/api/` | Medium | Wire per report; only `api/` changes |
| Report filters follow the Figma filter frames (2026-10-15 SVG exports) for every mocked report except referral links: labels, real option lists, several date ranges per report (`dateFilterColumns`, URL `<report>.d.<column>.from/to`), the wallet amount range | `utils/report-definitions.ts` | Low | — |
| Not built from those frames — options are placeholders («نوع یک…», «دلیل یک…», «سطح یک…»): login «نوع ورود» / «نوع خروج»; security «فیلد ویرایش شده»; unblock / manual block type and reasons; restrictions target / restriction / actor types and access levels; public panel requests «وضعیت» and lifecycle «نوع اقدام» / «فاصله زمانی درخواست تا اقدام» | `REPORT_ENUMS` | Medium | Real option lists from product / backend |
| Restrictions filter draws the ID fields (شناسه عملگر، محصول، سرویس دهنده، عملیات فرعی، راهبر محدود / رفع کننده) as «شروع / پایان بازه» pairs — not built (an ID range is unclear) | `restrictions` | Low | Confirm: exact ID search or range |
| Manual block: Figma filter «نوع دوره مسدودی» offers روزانه / ساعتی, the table shows دقیقه / ساعت — the table's values are kept | `periodUnit` | Low | Confirm with design |
| Figma filter fields with placeholder options («نوع یک / دو / سه / چهار») are not built: wallet «منبع تراکنش» / «نوع تراکنش», actor delete/restore «نوع عملگر»; interactions «نوع هدف تعامل» has only its two real options (دیدگاه، پنل عمومی) | `REPORT_ENUMS` | Medium | Real option lists from product / backend |
| Referral report filter frame adds 3 date ranges and 8 invitee fields (type, gender, province, city, university, degree, major) — beyond `Usr-Rfl-2N1` (filter: creation time) and their lists are sample data; not built | `referralLinks` | Medium | Product decision (SRS vs design) + option endpoints |
| Sort menus: Figma drops «قدیمی‌ترین» on these four reports (wallet: newest only; actor delete/restore defaults to the admin username) — followed; Figma date labels differ slightly («تاریخ اقدام» vs column «تاریخ و زمان اقدام») | `sortOptions` | Low | Confirm |
| Stats and charts «فیلترها» panels offer a date range only (export draws no fields); charts search narrows by title | `components/date-range-filter-bar.tsx` | Low | Confirm fields |
| Wide desktop tables are clipped in the export; columns = desktop columns + the tablet card fields. Interaction report: desktop and tablet disagree (نوع تعامل / نوع عملیات) — union used | `utils/report-definitions.ts` | Low | Confirm with design |
| Referral-links report shows invitee details (gender, province, university, …) beyond `Usr-Rfl-2N1` (title, created time, invited username) — looks like `Adm-Rfl-2N2` fields; privacy check needed | `referralLinks` | Medium | Product / privacy decision |
| Export draws the notifications report with wallet columns; the existing notifications report is embedded instead (owner decision) | `reports-view.tsx` | Low | — |
| Page size 24 (rule) vs 12 rows in the export | `REPORT_PAGE_SIZE` | Low | — |
| Sidebar shadow: export uses a custom shadow; `shadow-app-elevation-1` used (no token) | `components/panel/panel-nav.tsx` | Low | Add a token if the exact shadow is wanted |
| Notifications charts on the operational page use the actor charts report fields named `reactionTimeSeries` / `conversionRateSeries` (they hold manual / system received counts) | `notifications/types/api.ts` | Low | Rename in the notifications API mapping |
| Comparison tool: statistic list = all mocked bar charts; university / major options mocked; option lists for the other fields reuse `@private-panel/data/*` (second consumer — move to a shared module when the private panel is reopened) | `hooks/use-comparison-field-options.ts` | Low | Backend option endpoints |
| No `NoPermissionState` component yet — a 403 from a future report endpoint would show the generic error state | `report-panel.tsx` | Medium | Build `NoPermissionState` (design system ❌) |
| Hydration warning on every operational page with a report: `useId` values (`aria-controls` of `ReportSection` / `ReportToolbar`) differ between server and client — seen on the existing «گزارشات» page as well | `components/ui/report-section.tsx`, `report-toolbar.tsx` | Medium | Find the tree difference above the panels (dev console «A tree hydrated but some attributes…») |
| Filter options not read (Figma Starter call limit reached 2026-10-15). Used services panel (`890:92799`) is known: «بازه تاریخ استفاده» (done), «نوع سرویس», «تعامل مالی» — the two dropdowns are missing until their options are known. Wallet (`890:92769`) and interactions (`890:85647`) panels unread; they keep the generic filter (date range + enum checkboxes) | `utils/report-definitions.ts` | Medium | Export the open («Wide») variants of `890:100503`, `890:100540`, `890:86875`, `890:86722`, `890:86773`, `890:86838` and the two panels as SVG |
| Link targets: service / product / «برو به پنل عملیاتی سرویس» / interaction actor and the service cards have no destination yet (service panels do not exist) — shown as plain primary text, cards without hover | `report-cell.tsx`, `managed-service-card.tsx` | Medium | Backend sends internal paths (`<column>Href`, `panelHref`) |
| Used services: the SVG export («نوع سرویس», «نام محصول») and the Figma web overview («نام سرویس», «محصول استفاده شده») disagree — overview used | `reports.usedServices.columns` | Low | Confirm with design |
| Wallet card: the export puts amount above label for balance / total spent but label above value for the update date — one order (label, value) used | `wallet-summary-card.tsx` | Low | Confirm with design |
| Interactions «به عملگر» tab: only the «از عملگر» frame was read; same fields used | `INTERACTION_COLUMNS` | Low | Confirm |
| Manage services tablet / mobile frames not read; grid falls to 2 / 1 columns | `manage-services-view.tsx` | Low | Check frames `890:97390`, `890:97004` |
| React Query pauses retries while the tab is hidden, so error states (here and on `/search`) appear only after the tab is visible | app-wide | Low | Expected library behaviour |

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
