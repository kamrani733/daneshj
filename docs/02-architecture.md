---
title: "Architecture"
description: "Monorepo layout, request flow, trust boundaries, caching, import direction"
category: "architecture"
last_updated: "2026-09-25"
---

# Architecture

## Stack

| Layer | Choice | Where |
|---|---|---|
| Monorepo | Nx 23.0.1 | `nx.json`, inferred projects via `@nx/*` plugins |
| Framework | Next.js ~16.1.6 (App Router) | `apps/usr` |
| Styling | Tailwind v4 + tokens in `globals.css` | `apps/usr/src/app/globals.css`, `apps/usr/src/components/ui/` |
| Server state | TanStack Query v5 | `libs/shared-ui`, per-feature `api/react-query.ts` |
| Backend | Microservices via same-origin `/api` rewrites and/or `NEXT_PUBLIC_*` URLs | `apps/usr/next.config.js` |

## Folder structure (target)

```text
apps/
  <main-app>/
    app/
      (public)/            # guest + public service pages
      (panel)/             # target: today use `(site)/private-panel` + `(site)/public-panel`
      (admin)/             # admin panel — location TBD (apps/adm?)
      api/                 # route handlers / proxy
libs/
  ui/                      # shared design-system components (no domain imports)
  shared/
    util/                  # formatting, Jalali dates, text normalization, errors
    data-access/           # HTTP client factory, query-key helpers, auth/session helpers
    patterns/              # approval, soft-delete, archive, categories, reasons, reports, uploader
  <service>/               # one per SRS service: dsc, nws, nwl, cln, msg, rwd, rfl, srv
    data-access/           # service API client + hooks shared by its routes
    types/                 # DTOs, status enums, state maps
```

## Current structure (as built)

**Main app:** `apps/usr` only. Route groups: `(public)/(auth)`, `(public)/(site)`, `(public)/home`.

Feature colocation (not the target `sections/` + `mock/` layout yet):

```text
apps/usr/src/app/(public)/(site)/{notifications,private-panel,public-panel}/
  api/, components/, hooks/, types/, data/   # some mocks in data/ (e.g. settings-mock.ts)
apps/usr/src/app/(public)/(auth)/             # auth api/, components/, lib/
apps/usr/src/app/(public)/home/               # home UI + search-mock.ts
apps/usr/src/components/                      # ui/, site/, panel/, auth/
apps/usr/src/shared/api/                      # per-MS HTTP client instances
libs/{api-client,auth,shared-types,shared-ui}/
```

**Gap to target:** no `libs/ui` or `libs/shared/*` pattern libs yet; shared UI lives in `apps/usr/src/components/ui`;
DTOs are handwritten per feature, not in `libs/<service>/types`; `apps/usr/src/features/` is empty; no dedicated
`(panel)/` route group — panels are routes under `(site)/private-panel` and `(site)/public-panel`; admin is not
split to `apps/adm` (embedded via `targetActorId` and notification admin routes).

Route-level colocation (`page.tsx`, `sections/`, `api/`, `hooks/`, `utils/`, `types/`, `mock/`) is defined in
`.cursor/rules/20-architecture.mdc` and [conventions-large-feature-ui.md](./conventions-large-feature-ui.md).

## Request flow

```text
[Browser] → middleware (session, guard)
  → route page (Server Component) → sections
  → route api/ → service data-access client → shared HTTP client
  → /api rewrite or proxy → microservice (Auth | Actor | Notification | Interactive Ops | service MS)
  (mock phase: route api/ → route mock/)
```

## Trust boundaries

- **Actor & permissions** — from the authenticated session only; UI gating is UX
  ([03-domain-and-rules.md](./03-domain-and-rules.md)).
- **Provider scope** — a provider sees and edits only its own records; enforced by backend.
- **Money** — prices, discounts, wallet, gateway results, rewards come from the backend only.
- **Moderation** — approve / reject / suspend / unpublish / delete are server-validated and audit-logged.
- **Rich content** — sanitized before render.

## Caching

- Public service pages: server-rendered, revalidation per route in [04-routing.md](./04-routing.md).
- Client cache: per-data-type `staleTime` ([06-state-management.md](./06-state-management.md)).
- Invalidation: targeted by query-key factory after mutations.

## Import direction

- `libs/ui` → no domain, no data-access, no route imports.
- `libs/<service>/*` → `libs/shared/*`, `libs/ui`.
- Apps → libs. Libs never import apps. Route UI imports its own `api/`/`hooks/` plus libs.
- Enforced by `@nx/enforce-module-boundaries` in `eslint.config.mjs` with a **permissive** rule today:
  `sourceTag: "*"` may depend on `onlyDependOnLibsWithTags: ["*"]`. Project tags are mostly `npm:private` on apps;
  no `ui` / `data-access` tag split yet — target constraints still to be added.

## Design system

[10-design-system.md](./10-design-system.md)
