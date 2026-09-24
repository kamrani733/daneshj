---
title: "Large feature UI"
description: "When and how to split a big route-level screen into smaller pieces"
category: "architecture"
last_updated: "2026-09-25"
---

# Large feature UI

## How big is too big?

A page or component over ~150–200 lines, or with more than one data fetch plus one non-trivial interaction,
should be split. If you cannot describe a file's job in one sentence, split it.

## Canonical layout — page as folder

```text
app/<route>/
  page.tsx           # thin — params, guard, compose sections
  sections/
  api/               # data functions; mock phase delegates to mock/
  hooks/
  utils/
  types/
  mock/              # MOCK ONLY (mock/README.md)
```

Skip empty folders. Anything used by two or more routes goes to `libs/` (shared or the service lib).

## Typical split for an SRS service screen

- `sections/list-toolbar.tsx` — search, filters, sort (shared list shell)
- `sections/list-table.tsx` — rows + row actions from the status map
- `sections/detail-*.tsx` — one section per tab/panel of the detail
- `sections/moderation-*.tsx` — approve/reject/diff views (shared pattern components)

## Barrels

Explicit imports inside an app. Libs expose a public `index.ts` (Nx convention); never import a lib's internals.

## Migration policy

Split incrementally when touching an oversized file; dedicated refactor pass when a service stabilizes.
