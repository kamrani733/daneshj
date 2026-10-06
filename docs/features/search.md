---
title: "Feature: Global search (نتایج جستجو)"
description: "Header search → /search results page: products, services, providers, users; a filter per group"
category: "feature"
last_updated: "2026-10-07"
---

# Feature: Global search (نتایج جستجو)

## Summary

Submitting the header search box opens `/search?q=…` («نتایج جستجو»). The page has its own query field
(debounced 300 ms, ≤ 50 characters), a total count («N نتیجه یافت شد») and four result groups:
محصولات, سرویس‌ها, سرویس دهنده‌ها, کاربران. Each group shows 9 results (3 rows × 3) and «مشاهده همه /
مشاهده کمتر» when there are more. A group with no result shows «(نتیجه ای یافت نشد)» and no cards.
Every group has a filter («فیلتر ها»), applied with «اعمال فیلتر» and reset with «پاک کردن»:

- محصولات — pick a service (searchable select), then that service's categories (main → sub checkboxes).
- سرویس‌ها — services tree «دسته بندی های اصلی و فرعی» (main → sub), collapsible.
- سرویس دهنده‌ها — «سرویس دهنده»: حقیقی (انفرادی) / حقوقی, collapsible.
- کاربران — «کاربران»: کاربر عادی / دانشجو / فارغ‌التحصیل, collapsible.

«اعمال فیلتر» / «پاک کردن» update the URL (new results), close the panel and scroll the group's header into
view when it is above the screen, so the filtered cards are visible at once. Unapplied selections survive
other URL changes (query, other groups). On phones the header search icon opens `/search` directly.

Phones (Figma mobile frames): no total line, 4-card preview per group, «(۰)» for an empty group, tighter
gaps (cards 12, groups 24).

## SRS coverage

No SRS path covers a global search (closest: SRV general pages). UI-ONLY, mock data.

## URL state

`?q=` query · `service=` product service id · `cat=` comma-separated leaf category ids (only with `service`) ·
`scat=` service-tree leaf ids · `ptype=` `individual`/`legal` · `utype=` `regular`/`student`/`graduate` ·
`expand=` sections showing all results. Parsing drops malformed ids and unknown sections
(`search/utils/search-params.ts`, unit-tested).

## Files

| Part | Path |
|---|---|
| Route | `app/(public)/(site)/search/page.tsx` (Suspense for `useSearchParams`) |
| Feature (`@search/*`) | `app/(public)/search/` — `search-page.tsx`, `components/`, `hooks/`, `api/`, `mock/`, `types/`, `utils/` |
| Header entry | `components/site/site-header.tsx` → `HeaderSearchForm` (desktop), search icon link (mobile) |
| Shared UI added | `Checkbox`, `SearchSelect`, `SearchField` clear button, `CompactMediaCard` (demos on `/dev/ui-kit`) |
| Text util | `lib/normalize-fa.ts` — Arabic ي/ك → ی/ک, Persian digits → Latin, whitespace |
| Copy | `messages/fa.json` → `search` |
| Design spec | [design-specs/search/search-results.md](../design-specs/search/search-results.md) |

## States

Loading (spinner on first load; previous results stay visible while a new query loads), error
(`ErrorState` + retry; mock query `خطای آزمایشی` triggers it), per-group no-result.

No result at all (total 0 and no filter applied): the groups are replaced by «پرجستجوترین‌های هفته:» (week's
top queries; clicking one searches it) and `NoResultState` «هیچ نتیجه ای یافت نشد». With a filter applied the
groups stay, so the filter can be changed. The query field shows Persian digits; the URL keeps Latin ones. No guest or permission
restriction — the page is public.

## Known gaps

See [09-known-issues.md](../09-known-issues.md): mock only (no search endpoint), built from screenshots
(Figma MCP limit), a few disagreements between the filter frames (decisions in the design spec).
