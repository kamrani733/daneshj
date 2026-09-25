---
title: "Integrations"
description: "Backend microservices, endpoint inventory, readiness and mock status"
category: "architecture"
last_updated: "2026-09-25"
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
| Notification | `GET /notification/report/statistics_report`, `charts_report` | stats, charts pages | REAL in code; spec marks these **Admin-only** — user UI may need `actor_statistics_report` / `actor_charts_report` (B5) |
| Notification | `GET/POST /notification/actor-settings/*` | settings | REAL + **HARDCODED** metadata merge |
| Interactive ops | `POST/GET /interactive-ops/{follow,like,score,share}/*` | `public-panel/api/interactive-ops.ts` | REAL |
| Home | — | `home/data/search-mock.ts` | **MOCKED** (no API) |
| Public panel comments | — | `comments/section.tsx` | **HARDCODED** / client-only mutations |

## Mocks in use

| Mock | Replaces | Remove when |
|---|---|---|
| `settings-mock.ts` | Notification category tree + `categoryId` mapping (`category/list` Admin-only in spec) | Backend exposes category list (and aligned IDs) to actor tokens |
| `(auth)/api/mock.ts` + `isAuthApiMocked()` | Auth MS in dev when `NEXT_PUBLIC_API_URL` is unset (try request, then mock). Also immediate mock for send-otp-for-login, session-limit continue, and no-op logout/delete | Production build (`NODE_ENV` inlined): `isAuthApiMocked()` is false and `withMockFallback` rethrows |
| `home/data/search-mock.ts` | SRV provider/product search | SRV search API integrated |
| `public-panel/data/public-panel-mock.ts` | Loading placeholders for visitor profile | N/A (placeholder until fetch completes) |

## Failure behaviour

Shared error normalization → `ApiError` ([05-data-models.md](./05-data-models.md)). 401 → refresh then login;
403 → no-permission state; 429 → rate-limit message; 5xx → error state with retry.
