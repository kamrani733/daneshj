---
title: "Routing"
description: "Route table, guards, caching and URL conventions"
category: "architecture"
last_updated: "2026-09-25"
---

# Routing

## Route table (existing)

⟨FILL: every route from audit §3 — route, page file, layout, required actor, SRS service, caching⟩

| Route | Purpose | Actor (UI guard) | Server guard | SRS | Caching |
|-------|---------|------------------|--------------|-----|---------|
| ⟨FILL⟩ | | | | | |

Open: should `/dashboard` exist, or should menu links point to `private-panel` / a future admin app? (TBD)

## Route plan for SRS services

Same shape for every service `<svc>` ∈ {`discounts`, `news`, `newsletters`, `events`, `messages`, `rewards`,
`invite`}. Final names are confirmed per service before its first route is created.

| Surface | Pattern | Actor |
|---|---|---|
| Service home | `/<svc>` | All |
| Full list | `/<svc>/list` | All |
| Detail | `/<svc>/[id]` | All (actions by actor) |
| Terms / help | `/<svc>/terms`, `/<svc>/help` | All |
| User panel | `/panel/<svc>/...` | Usr |
| Provider panel | `/panel/<svc>/...` (provider view) | ASR |
| Admin panel | `/admin/<svc>/...` (items, categories, reasons, reports) | Adm |

## URL conventions

- Filters, sort, search, tab and page live in query params (`?q=&status=&sort=&page=`).
- IDs in paths are opaque; never put actor or provider IDs in URLs as authority.
- Archived / deleted views are tabs via query param (`?view=archived`), not separate routes.

## Access control layers

1. Middleware — session present, panel prefix guard.
2. Server layout — actor check for panel/admin groups (authoritative on the frontend side).
3. Client UI — hide/disable actions by capability (UX only).
4. Backend — final authority.
