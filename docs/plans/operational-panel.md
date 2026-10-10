---
title: "Implementation Plan: Operational panel — reports, stats, charts"
description: "Build /operational-panel/{reports,stats,charts} from the Operational Panel exports, sharing the panel shell, report, stat and chart blocks with notifications"
category: "plan"
last_updated: "2026-10-10"
owner: "Frontend"
---

# Implementation Plan: Operational panel — reports, stats, charts

## Goal

`/operational-panel/reports` renders the «پنل عملیاتی» export (`Operational Panel.svg`, 1512 px desktop): page
heading, the operational-panel sidebar and 15 collapsible report sections. The page reuses the notifications page
pattern (same shell, sidebar, report block, toolbar, pagination); those pieces move to shared components and the
notifications pages switch to them.

## Scope update (2026-10-10)

The owner sent the stats (desktop `Actor-2/Frame 1984079021`, mobile `Frame 1984079027`), charts (tablet
`Frame 1984079025-2`, desktop `Actor-2/Property 1=Wide*`), comparison (`Property 1=Empty|Half full|Combine|Adapted`)
and mobile menu (`Operational Panel-2`) frames and asked for the page per those exports, with the sidebar
**sticky** while scrolling. Added: `/operational-panel/stats`, `/operational-panel/charts` (+ comparison tool);
«آمار» / «نمودار» enabled in the sidebar. Same data rule: mocked, except «اعلانات» which reuses the Notification MS
statistics / charts reports (they match the export's cards and charts).

## Owner decisions (2026-10-09)

| Question | Decision |
|---|---|
| Route | `/operational-panel/reports`; `/operational-panel` redirects there. Sidebar shows all 7 items; the 6 without a design are visible but disabled. Session required (middleware). |
| Data | All mock for now (`mock/` behind `api/`), including the 5 reports that have Auth MS owner endpoints. |
| «گزارش اعلان‌های دریافتی و وضعیت آنها» | Reuse the existing notifications report (real API, its own columns/filters/sort). The export shows the wallet columns there (copy-paste). |
| Shared code | Extract shell, nav, report section, toolbar, table, pagination to shared components and migrate notifications. |

## SRS scope

Only one report is in `docs/srs/`: `Usr-Rfl-2N1` (گزارش سابقه لینک های ساخته شده — search: link title, invited
username; filter: creation time; sort: title, creation time, invited username). The other reports belong to
platform areas without an SRS in the repo (Aut, Prf, Ntf, wallet, comments, interactive ops). No red/yellow items.

## Reports (export order)

| # | id | Title | Real endpoint (later) |
|---|---|---|---|
| 1 | `publicPanelFields` | گزارش مدیریت نمایش اطلاعات در پنل عمومی | — |
| 2 | `accountOps` | گزارش سابقه عملیات حساب کاربری | — |
| 3 | `publicPanelLifecycle` | گزارش ایجاد/حذف پنل عمومی | — |
| 4 | `publicPanelRequests` | گزارش درخواست ایجاد/حذف پنل عمومی | — |
| 5 | `loginLogout` | گزارش ورود و خروج | Auth `report_log/report_login_logout_to_owner_actor` (`Usr-Aut-12N2`) |
| 6 | `securitySettings` | گزارش سابقه ویرایش تنظیمات امنیتی | Auth `report_log/report_edit_security_setting_to_owner_actor` |
| 7 | `bruteForceUnblock` | گزارش سابقه رفع مسدودی عملگر به دلیل حملات بیرحمانه | Auth `auth/unban_actor_history_to_actor` |
| 8 | `manualBlock` | گزارش سابقه مسدودی/رفع مسدودی عملگر به صورت دستی | Auth `auth/block_actor_history_to_actor` |
| 9 | `restrictions` | گزارش سابقه محدودی/رفع محدودی عملگر | — |
| 10 | `actorDeleteRestore` | گزارش سابقه حذف/بازگردانی عملگر | Auth `report_log/report_delete_account_to_owner_actor` |
| 11 | `wallet` | گزارش عملیات کیف پول کاربر | — |
| 12 | — | گزارش اعلان‌های دریافتی و وضعیت آنها | Notification MS (already wired) |
| 13 | `comments` | گزارش سابقه عملیات انجام شده روی دیدگاه ها | — |
| 14 | `interactions` | گزارش سابقه عملیات تعاملی | — |
| 15 | `referralLinks` | گزارش سابقه لینک های ساخته شده | — (`Usr-Rfl-2N1`) |

## Acceptance criteria

- [x] Heading (breadcrumb خانه › حساب کاربری › پنل عملیاتی, title, user's name), sticky sidebar and 15 sections match the export
- [x] Each mocked report: search (≤ 50 chars, debounced), sort, filters, server-style pagination (24/page), URL state
- [x] Loading, empty, no-result and error (retry) states in every report
- [x] Wide tables scroll horizontally with the green scroll indicator; layout works on phone/tablet/desktop
- [x] Stats: six sections of count / ratio cards; charts: six chart sections + comparison tool (empty / half / combined / adapted)
- [x] Notifications pages on the shared components (shell, nav, report, stat, chart blocks)
- [x] Profile menu «پنل عملیاتی» opens the new route (was `/dashboard`)
- [x] `nx affected -t lint test build` passes (lint: 0 errors; 110 tests; build ok)
- [x] Dark mode visual pass (reports, stats, charts)
- [ ] Manual check by the owner on a real session (notifications sections use the real API)

## Non-goals

- The other 6 sidebar destinations (no design)
- Real endpoints for the 5 Auth reports (separate task — only `api/` changes)

## Assumptions (provisional, listed in known issues)

- Columns clipped in the export (wide tables) are not in the SVG; only the visible columns are built.
- Filter and sort fields are not in the export or an SRS (except `Usr-Rfl-2N1`): each report gets a date-range
  filter on its main date column, checkbox filters on closed-set columns, and sort by date (newest/oldest).
- Page size 24 (rule `30-data-layer`), although the export draws 12 rows.

## Work breakdown

| Step | Task | Files |
|---|---|---|
| 1 | Shared Jalali date-time formatter (+ tests); notifications delegates to it | `lib/jalali.ts` |
| 2 | Shared shell + nav: `PanelPageShell`, `PanelNav` (sidebar + mobile sheet) | `components/panel/` |
| 3 | Shared report blocks: `ReportSection`, `ReportToolbar`, `ReportTable`, `HorizontalScroller`, `Pagination` | `components/ui/` |
| 4 | Material icons from the export (sidebar) | `components/icons/material-icons.tsx` |
| 5 | Migrate notifications shell, reports panel, table, pagination | `notifications/components/**` |
| 6 | Operational panel route: definitions, types, `api/`, `mock/`, hooks, URL state, views | `(site)/operational-panel/**` |
| 7 | i18n (`operationalPanel` namespace, shared labels), middleware, profile menu link, alias | `fa.json`, `middleware.ts`, `tsconfig.json` |
| 8 | `/dev/ui-kit` demos, docs (routing, integrations, design system, known issues, feature doc, progress) | `components/dev/`, `docs/` |

## Risks

| Risk | Mitigation |
|---|---|
| Notifications regressions from the migration | Same layout values moved to tokens; visual check of `/notifications/reports` light + dark |
| 15 reports in one URL | Params are namespaced per report (`<id>.q`, `<id>.page`, …); a report only rewrites its own keys |

## Testing plan

- Unit: date-time formatter; report URL params parse/build; mock filtering/sort/pagination for every report
- Manual: desktop/tablet/phone, dark mode, keyboard through toolbar/table/pagination

## Documentation updates

- [ ] `features/operational-panel.md`, `README.md` Features row
- [ ] `04-routing.md`, `07-integrations.md` (mocks), `10-design-system.md` (new shared components)
- [ ] `09-known-issues.md` (clipped columns, provisional filters, notifications report columns), `CURRENT-PROGRESS.md`
