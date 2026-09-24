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
| Monorepo | Nx | `nx.json`, `project.json` per project |
| Framework | Next.js ⟨FILL⟩ | ⟨FILL: main app path⟩ |
| Styling | ⟨FILL⟩ | ⟨FILL⟩ |
| Server state | ⟨FILL⟩ | ⟨FILL⟩ |
| Backend | Microservices via same-origin `/api` rewrites and/or direct `NEXT_PUBLIC_*` URLs | `next.config` ⟨FILL⟩ |

## Folder structure (target)

```text
apps/
  <main-app>/
    app/
      (public)/            # guest + public service pages
      (panel)/             # user / provider operational panel  ⟨FILL: current name, e.g. private-panel⟩
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

⟨FILL: current real structure from audit §2, and the gap to the target above⟩

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
- Enforced by Nx tags ⟨FILL: current tags / eslint boundary config, audit §10⟩.

## Design system

[10-design-system.md](./10-design-system.md)
