---
title: "Implementation Plan: Global search results page"
description: "Header search → /search with grouped results and a filter per group (mock phase)"
category: "plan"
last_updated: "2026-10-07"
owner: "Tina"
---

# Implementation Plan: Global search results page

## Goal

After typing in the header search and submitting, the user lands on «نتایج جستجو» matching the Figma
screenshots (2026-10-07).

## SRS scope

No SRS path (global search is not in the SRS). Red/yellow SRS flags touched: none.

## Acceptance criteria

- [x] Header search submit → `/search?q=…`; phone search icon → `/search`
- [x] Query field on the page, debounced 300 ms, ≤ 50 chars, normalized (ی/ک, digits), × clears
- [x] Total count + four groups with counts; empty group shows «(نتیجه ای یافت نشد)»
- [x] 9-result preview with «مشاهده همه / مشاهده کمتر»
- [x] Product filter: service picker → categories (main/sub checkboxes) → apply / clear
- [x] Services (tree), providers (حقیقی/حقوقی) and users (membership) filters — frames `422:59585` … `422:60438`
- [x] Query, filter and expanded groups in the URL
- [x] Loading, error + retry states; dark mode via tokens
- [x] No-result state: «پرجستجوترین‌های هفته» + illustration + «هیچ نتیجه ای یافت نشد» (`NoResultState`)
- [x] Data only through `search/api/` (mock behind it)

## Non-goals

- Real search endpoint (none exists)
- Detail links from result cards (no target pages yet)

## Approach summary

New feature folder `app/(public)/search/` (alias `@search/*`) mirroring `home/`, with route
`(site)/search/page.tsx`. Mock `api/` → `mock/`, React Query hooks, URL state hook. New shared pieces:
`Checkbox`, `SearchSelect`, `SearchField` clear button, `CompactMediaCard`, `lib/normalize-fa.ts`.

## Work breakdown

| Step | Task | Files |
|---|---|---|
| 1 | Types, URL parser/builder + tests, text normalization + tests | `search/types`, `search/utils`, `lib/normalize-fa.ts` |
| 2 | Mock + api + query keys + hooks | `search/mock`, `search/api`, `search/hooks` |
| 3 | Shared UI + ui-kit demos | `components/ui/{checkbox,search-select,search-field}.tsx`, `components/cards/compact-media-card.tsx`, `components/dev/ui-kit-search.tsx` |
| 4 | Page + sections + product filter | `search/search-page.tsx`, `search/components/*`, `(site)/search/page.tsx` |
| 5 | Header wiring | `components/site/site-header.tsx` |
| 6 | Docs | routing, integrations, design system, known issues, progress, feature, design spec |

## Risks

| Risk | Mitigation |
|---|---|
| Built from screenshots, not Figma variables | Spec lists every assumed token; verify when MCP is available |
| Search API shape unknown | Types marked provisional; only `api/` changes on integration |

## Testing plan

- Unit: `search-params.spec.ts`, `category-tree.spec.ts`, `normalize-fa.spec.ts`, `mock/search-mock.spec.ts`
  (every filter option returns results)
- Manual smoke: header submit (desktop), search icon (phone), typing updates URL after 300 ms, back button
  restores query, product filter apply/clear, «مشاهده همه», error query `خطای آزمایشی`, dark mode, 390 px width

## Open questions

- [ ] Frame disagreements (filter actions before a service is picked, no «مشاهده همه» on mobile) — design
- [ ] Where do result cards link to? — owner
- [ ] Empty query: show everything (as in the design) or a prompt? — owner (currently everything)
