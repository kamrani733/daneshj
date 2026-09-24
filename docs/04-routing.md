---
title: "Routing"
description: "Route table, guards, caching and URL conventions"
category: "architecture"
last_updated: "2026-09-25"
---

# Routing

## Route table (existing)

All routes are in `apps/usr` unless noted. **Caching:** no route-level `revalidate` or `loading.tsx`/`error.tsx`
today; pages are dynamic SSR/RSC with client data via React Query where noted.

| Route | Page file | Layout / shell | Actor (UI) | Server guard | SRS / domain | Caching |
|-------|-----------|----------------|------------|--------------|--------------|---------|
| `/` | `(public)/(site)/page.tsx` → home | Root → `(public)` → `(site)` → `SiteShell` | Guest OK | — | Home / search (mock); SRV-like UI | Dynamic SSR + client mock search |
| `/cooperation` | `(site)/cooperation/page.tsx` | SiteShell | Guest OK | — | Static i18n; no SRS path | Dynamic SSR |
| `/login`, `/login/otp`, `/login/password`, `/login/totp`, `/login/sessions` | `(auth)/login/...` | Auth layout | Guest (sessions flow varies) | Auth layout redirects if session | Auth (`USR-Aut` in comments) | Dynamic |
| `/forgot-password`, `/forgot-password/otp`, `/forgot-password/reset` | `(auth)/forgot-password/...` | Auth layout | Guest | Middleware + auth layout | Auth | Dynamic |
| `/public-panel` | `(site)/public-panel/page.tsx` | SiteShell | Guest OK (API uses token if present) | — | Visitor profile (`Usr-Prf-6`); catalog UI for Nws/Dsc/Nwl | Dynamic + React Query |
| `/private-panel` | `(site)/private-panel/page.tsx` | SiteShell | Signed-in user; `?actor_id=` admin view | Middleware: session required | `USR-Prf-2`, `Adm-Prf-2` | Dynamic + React Query |
| `/notifications` | `(site)/notifications/page.tsx` | SiteShell + notifications `page-shell` | Needs token for data | — | `USR-Ntf` | Client fetch (RQ) |
| `/notifications/stats` | `(site)/notifications/stats/page.tsx` | Same | Token for API | — | `Adm-Ntf-6N10` | Client fetch |
| `/notifications/charts` | `(site)/notifications/charts/page.tsx` | Same | Token for API | — | `Adm-Ntf-6N11` | Client fetch |
| `/notifications/reports` | `(site)/notifications/reports/page.tsx` | Same | Token for API | — | `Usr-Ntf-6N5` | Client fetch |
| `/notifications/settings` | `(site)/notifications/settings/page.tsx` | Same | Token for API | — | `USR-Ntf-5` | Client fetch |
| `/dashboard` | **Missing** `page.tsx` | — | Nav expects signed-in user | Middleware lists as protected | Broken — see known issues | — |
| `/register` | Redirect → `/login` | — | — | `next.config.js` | — | — |
| `apps/adm` `/` | `apps/adm/src/app/page.tsx` | Placeholder | — | — | Placeholder | Static |
| `apps/bus` `/` | `apps/bus/src/app/page.tsx` | Placeholder | — | — | Placeholder | Static |

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
