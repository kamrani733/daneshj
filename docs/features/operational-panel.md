---
title: "Feature: Operational panel (پنل عملیاتی) — reports, stats, charts"
description: "/operational-panel/* — sticky panel nav plus the «گزارشات», «آمار» and «نمودار» tabs, built from the Operational Panel exports"
category: "feature"
last_updated: "2026-10-15"
---

# Feature: Operational panel (پنل عملیاتی)

## Summary

The signed-in user's operational panel. Same shell as the notifications pages: breadcrumb «خانه › حساب کاربری ›
پنل عملیاتی», title + the user's name, a sidebar that **stays sticky** under the header while the content scrolls
(phones: «منوی پنل عملیاتی - <tab>» opens a bottom sheet). The profile menu's «پنل عملیاتی» opens it
(was the broken `/dashboard`).

Sidebar: **سرویس‌های استفاده شده** · **مدیریت سرویس‌ها** · **کیف پول** · **گزارشات** · **آمار** · **نمودار** ·
**مشاهده تعاملات** — every item has a page (2026-10-15).

Design sources: SVG exports «Operational Panel» / «Operational Panel۳» / «Notifications» and the Figma file
`eGTqXhUsbNADBwGTxOS0nm` (page «Figma Basics»). The canonical frames are the rows «نمای کلی پنل عملیاتی - نسخه وب /
تبلت / موبایل» (web: used services `890:64903`, manage services `890:65383`, wallet `890:65092`, interactions
`890:65464`; card component `890:85718`).

### «سرویس‌های استفاده شده» — `/operational-panel/used-services`

One report without a section header (`OperationalReportPanel variant="plain"`): sort, filters, search; columns
نام سرویس · محصول استفاده شده · تاریخ استفاده · تعامل مالی («ندارد» when empty) · عملیات («برو به پنل عملیاتی
سرویس»). Service, product and action are links when the row carries `<column>Href` (internal paths only).

### «مدیریت سرویس‌ها» — `/operational-panel/manage-services`

Eight service cards, three per row (Figma «Main Services»: image, name, «x محصول فعال» / «y محصول غیر فعال» chips,
«برو به پنل عملیاتی سرویس»). Hover / pressed states apply once a card has a panel link; images in
`public/images/operational-panel/services/`.

### «کیف پول» — `/operational-panel/wallet`

Intro banner (illustration + copy with the inline logo; phones stack the image above), balance card (موجودی, کل
مبلغ استفاده شده, تاریخ به روز رسانی; export pattern tinted with `primary` through a CSS mask), then the collapsible
«سابقه تراکنش ها» report (filters + search, no sort control; amounts signed and coloured).

### «مشاهده تعاملات» — `/operational-panel/interactions`

Desktop intro sentence, then tabs «تعاملات از عملگر» / «تعاملات به عملگر» (`?tab=to`), each one collapsible report:
تاریخ ثبت تعامل · عامل تعامل · نوع عامل تعامل · نوع تعامل · مقدار تعامل.

### «گزارشات» — `/operational-panel/reports`

15 collapsible report sections («گزارش …»). Each: toolbar (sort, filters, search ≤ 50 chars, debounced 300 ms),
table with rounded row cards (wide tables scroll horizontally under the green scroll indicator), pagination
(24 rows/page). Phones/tablets: labelled field cards, 4 at a time with «مشاهده بیشتر». Search, sort, filters and
page live in the URL, namespaced per report (`loginLogout.q`, `loginLogout.page`, `loginLogout.f.operation`, …).
Filters follow the Figma filter frames for wallet («بازه زمانی تراکنش», «بازه میزان تراکنش» — amount range,
`wallet.r.amount.min/max` — «نوع عملیات»), actor delete/restore, comments («نوع عملیات», 10 options) and interactions
(«نوع هدف تعامل», «نوع تعامل», «محیط اشتراک گذاری»); date sorts read «<ستون> (جدیدترین)». States: loading, empty,
no result, error + retry. Section 12 is the notifications report
(`NotificationsReportsPanel`, real API).

### «آمار» — `/operational-panel/stats`

A filter bar (date range, `stats.from/to`), then KPI sections: حساب کاربری, عملیات تعاملی, دیدگاه‌ها, اعلانات,
پشتیبانی, سرویس دعوت از دوستان. Count cards (icon, value, optional unit «دقیقه» or caption «پسندیدن», label,
«↑ ۱۸٪ نسبت به دوره‌ی قبل») and ratio cards («x از y», percent, progress bar). «اعلانات» has its own date filter
(`notifications.from/to`) and uses the Notification MS statistics report.

### «نمودار» — `/operational-panel/charts`

A bar with search (narrows charts by title) and a date filter (`charts.from/to`), then collapsible sections
«نمودارهای بخش …»: full-width bar charts (green, or orange for negative metrics; grouped green/orange with a legend
for the rewards charts; the running period faded) and donut cards two per row. Every card has its own
«روز / هفته / ماه / فصل / سال» chips. «نمودارهای بخش اعلانات» uses the Notification MS charts report.

«نمودارهای قابل تنظیم» compares one statistic between two user groups: «شاخص آماری» picker, «گروه A / گروه B»
cards with removable filter chips, «تنظیم فیلترها — گروه X» (13 selects: جنسیت, نوع کاربر, کشور/استان/شهر محل
زندگی, کشور/استان/شهر محل تحصیل, دانشگاه, وضعیت دانشجویی, مقطع تحصیلی, حوزه/گروه تحصیلی, رشته تحصیلی),
«نمای ترکیبی» (one grouped chart) or «نمای تطبیقی» (one chart per group), period chips. Empty state with the
three steps until a statistic and a group are set.

## SRS coverage

| Path code | Name | Status | Files |
|---|---|---|---|
| `Usr-Rfl-2N1` | مشاهده گزارش سابقه لینک های ساخته شده | UI-ONLY (mock) | `utils/report-definitions.ts` (`referralLinks`) |
| `Usr-Ntf-6N5` | Notifications report (reused) | as notifications | `@notifications/components/reports/panel` |
| `Usr-Ntf-6N12`, `Usr-Ntf-6N11` | Notifications stats / charts (reused data) | as notifications | `components/stats-view.tsx`, `components/notifications-charts-section.tsx` |

The other reports, stats and charts belong to platform areas without an SRS in `docs/srs/` (Aut, Prf, wallet,
comments, interactive ops, support).

## Actors

| Actor | Access |
|---|---|
| Signed-in actor | Own panel (middleware requires a session for `/operational-panel/*`) |
| Guest | Redirected to `/login?next=…` |

## Key modules

| Module | Role |
|---|---|
| `(site)/operational-panel/{page,reports/page,stats/page,charts/page}.tsx` | Routes (thin; `/operational-panel` → reports) |
| `components/operational-shell.tsx`, `nav-items.ts` | Shell + sidebar items (Material icons from the export) |
| `components/report-*.tsx`, `utils/report-definitions.ts`, `utils/report-params.ts` | Reports: config-driven columns, URL state (also used services, wallet transactions, interactions) |
| `components/{used-services,manage-services,wallet,interactions}-view.tsx`, `managed-service-card.tsx`, `wallet-*.tsx` | The four pages added 2026-10-15 |
| `components/stats-view.tsx`, `utils/stat-definitions.ts` | Stats sections and cards |
| `components/chart-*.tsx`, `components/comparison/*`, `utils/chart-definitions.ts` | Charts and comparison tool |
| `api/index.ts`, `api/query-keys.ts`, `hooks/*` | Data entry point (mock phase → `mock/`), React Query hooks |
| `mock/*` | MOCK ONLY — fixtures and in-memory query engines (see `mock/README.md`) |

Shared components created for this feature (also used by notifications): `components/panel/{panel-nav,panel-page-shell}`,
`components/ui/{report-section,report-toolbar,report-table,report-card-list,horizontal-scroller,pagination,stat-card,filter-fields}`,
`components/charts/*`, `hooks/{use-debounced-value,use-mobile-paged-items}` — see `10-design-system.md`.

## Data

All operational data is **mocked** (owner decision 2026-10-09; the four 2026-10-15 pages too — no wallet, service or
interaction-history endpoint in `docs/api/`) except the notifications report, stats and charts,
which reuse the Notification MS. Endpoints to switch to later (only `api/` changes): Auth MS
`report_log/report_login_logout_to_owner_actor`, `report_edit_security_setting_to_owner_actor`,
`report_delete_account_to_owner_actor`, `auth/block_actor_history_to_actor`, `auth/unban_actor_history_to_actor`.

## Known gaps

See `09-known-issues.md` → Operational panel.
