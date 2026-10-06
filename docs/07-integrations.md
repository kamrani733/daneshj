---
title: "Integrations"
description: "Backend microservices, endpoint inventory, readiness and mock status"
category: "architecture"
last_updated: "2026-10-07"
---

# Integrations

OpenAPI specs (repo copy): [`docs/api/`](./api/) — index in [`docs/api/README.md`](./api/README.md). Type generation plan: [`plans/api-types.md`](./plans/api-types.md).

## Microservices

| Service | Purpose | Base URL env | Contract (OpenAPI) | Frontend status |
|---|---|---|---|---|
| Auth MS | Login, OTP, password, session, refresh, logout; actor access matrices (`/actor_accesses/*`) | `NEXT_PUBLIC_API_URL` or `/api` + `AUTH_API_URL` rewrite | OpenAPI in [`docs/api/auth-ms.openapi.yaml`](./api/auth-ms.openapi.yaml) (v6.0.0) | REAL when `NEXT_PUBLIC_API_URL` set. Dev with it unset: **MOCK** (`isAuthApiMocked` + `withMockFallback` on request failure). Production builds never mock |
| Actor MS | Profiles (owner/admin/visitor), service titles | `NEXT_PUBLIC_ACTOR_API_URL` / `ACTOR_API_URL` → `/api` | OpenAPI in [`docs/api/actor-ms.openapi.yaml`](./api/actor-ms.openapi.yaml) (v1.0.0) | REAL endpoints; React Query **disabled** unless `NEXT_PUBLIC_ACTOR_API_URL` set (known bug) |
| Notification MS | Inbox, read state, reports, charts, stats, actor settings | `NEXT_PUBLIC_NOTIFICATION_API_URL` / `NOTIFICATION_API_URL` | OpenAPI in [`docs/api/notification-ms.openapi.yaml`](./api/notification-ms.openapi.yaml) (v1.0.0) | REAL for list/read/reports; settings **hybrid** with `settings-mock.ts` (see open decision 9 / B4 in [09-known-issues.md](./09-known-issues.md)) |
| Interactive Ops MS | Follow, like, score, share on public profiles | `NEXT_PUBLIC_INTERACTIVE_OPS_API_URL` / `INTERACTIVE_OPS_API_URL` | OpenAPI in [`docs/api/interactive-ops-ms.openapi.yaml`](./api/interactive-ops-ms.openapi.yaml) (v1.0.0) | REAL; default rewrite host hardcoded if env unset. Spec declares no security on product endpoints — see B7 in [09-known-issues.md](./09-known-issues.md) |
| Dsc, Nws, Nwl, Cln, Msg, Rwd, Rfl | SRS services | TBD | TBD | Backend readiness TBD |
| Payment gateway | Event registration, voucher/receipt purchase | TBD | TBD | Not started |

## Endpoint inventory

Summary from audit §4 — full path list in `docs/ai/00-project-audit.md` §4.

| Area | Method / path (pattern) | Used by | Status |
|------|-------------------------|---------|--------|
| Auth | `POST /auth/actor_send_code`, `actor_verify_code`, `refresh_token`, `get_token_info`, login/password/session endpoints | `(auth)/api/auth.ts`, auth UI | MOCK in dev if no `NEXT_PUBLIC_API_URL` (failed request returns mock); REAL otherwise. Impossible in production builds |
| Actor | `GET /profiles_base/get_actor_info`, `GET/PUT/PATCH/POST /profiles_*/*` | private/public panel `api/profiles-*.ts` | REAL (query gating issue) |
| Actor | `GET /service_titles/service-title/list-to-all` | `service-titles.ts` | REAL |
| Notification | `GET/POST /notification/actor-notifications/*`, unread counts | notifications inbox/header | REAL |
| Notification | `GET /notification/report/detailed_status_report` | reports page | REAL (all actor types in spec) |
| Notification | `GET /notification/report/statistics_report`, `charts_report` | stats, charts (admin session) | REAL |
| Notification | `GET /notification/report/actor_statistics_report`, `actor_charts_report` | stats, charts (non-admin session) | REAL |
| Notification | `GET/POST /notification/actor-settings/*` | settings | REAL + **HARDCODED** metadata merge |
| Interactive ops | `POST/GET /interactive-ops/{follow,like,score,share}/*` | `public-panel/api/interactive-ops.ts` | REAL |
| Home | — | `home/data/search-mock.ts` | **MOCKED** (no API) |
| Global search | — (no endpoint in any spec) | `(public)/search/api/` → `search/mock/` | **MOCKED** |
| Public panel comments | — | `comments/section.tsx` | **HARDCODED** / client-only mutations |

## Mocks in use

| Mock | Replaces | Remove when |
|---|---|---|
| `settings-mock.ts` | Notification category tree + `categoryId` mapping (`category/list` Admin-only in spec) | Backend exposes category list (and aligned IDs) to actor tokens |
| `(auth)/api/mock.ts` + `isAuthApiMocked()` | Auth MS in dev when `NEXT_PUBLIC_API_URL` is unset (try request, then mock). Also immediate mock for send-otp-for-login, session-limit continue, and no-op logout/delete | Production build (`NODE_ENV` inlined): `isAuthApiMocked()` is false and `withMockFallback` rethrows |
| `home/data/search-mock.ts` | SRV provider/product search | SRV search API integrated |
| `(public)/search/mock/search-mock.ts` | Global search (products, services, providers, users) + service / category filter options | Search endpoint integrated (only `search/api/` changes) |
| `public-panel/data/public-panel-mock.ts` | Rich fixture source for demo mode + loading placeholders | Demo mode uses `public-panel/mock/*` when gate + cookie active |

## Demo mode (public panel presentations)

Optional **presentation demo mode** for `/public-panel` only (Session 2.5). Other routes can adopt the same pattern later.

| Piece | Location | Behaviour |
|---|---|---|
| Env gate | `NEXT_PUBLIC_DEMO_MODE_ENABLED=true` | Toggle + fixtures only when set. Vercel preview sets it; a later production domain should leave it unset. |
| Cookie | `demo_mode=1` on, `demo_mode=0` off | Shared by server (RSC layout) and client (React Query, toggle). Missing cookie + gate on → fixtures. |
| Persona cookie | `demo_persona=<id>` | Presentation viewer + panel shape. Default `visitor-individual-provider`. IDs: `owner-individual-provider`, `visitor-individual-provider`, `visitor-non-provider`, `guest`. |
| Resolver | `apps/usr/src/lib/demo-mode/` | `resolvePublicPanelApiRuntime` picks real `api/` vs lazy `mock/` twins. |
| Fixtures | `public-panel/mock/fixtures.ts`, `interactive-ops-demo.ts` | Profile per persona; Interactive Ops counters in memory. |
| Viewer shim | `public-panel/demo/viewer-context.ts` | Demo-only `viewerActorId` / token; real session unchanged. |
| Capabilities | `public-panel/capabilities.ts` | Sections read visibility from the same rules as production. |
| UI | `PublicPanelDemoToolbar` (persona dropdown + toggle), `PublicPanelDemoBanner` | Only on `/public-panel` when gate is on. Persona switch invalidates demo React Query keys (no full reload). |

Demo mode **does not** bypass auth or permission rules on real routes; on `/public-panel` with gate + cookie it replaces read data, simulates the selected persona locally, and keeps mutations in-memory (no backend calls).


Shared error normalization → `ApiError` ([05-data-models.md](./05-data-models.md)). 401 → refresh then login;
403 → no-permission state; 429 → rate-limit message; 5xx → error state with retry.
