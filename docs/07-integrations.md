---
title: "Integrations"
description: "Backend microservices, endpoint inventory, readiness and mock status"
category: "architecture"
last_updated: "2026-09-25"
---

# Integrations

## Microservices

| Service | Purpose | Base URL env | Contract (OpenAPI) | Frontend status |
|---|---|---|---|---|
| Auth MS | Login, OTP, session, refresh, logout | ⟨FILL⟩ | TBD | ⟨FILL⟩ |
| Actor MS | Users, providers, admins, profiles | `NEXT_PUBLIC_ACTOR_API_URL` / `/api` rewrite | TBD | ⟨FILL⟩ |
| Notification MS | Notifications, notification settings | ⟨FILL⟩ | TBD | Hybrid — `settings-mock.ts` |
| Interactive Ops MS | ⟨FILL: what it covers⟩ | ⟨FILL⟩ | TBD | ⟨FILL⟩ |
| Dsc, Nws, Nwl, Cln, Msg, Rwd, Rfl | SRS services | TBD | TBD | Backend readiness TBD |
| Payment gateway | Event registration, voucher/receipt purchase | TBD | TBD | Not started |

## Endpoint inventory

⟨FILL: table from audit §4 — method, path, used by, REAL / MOCKED / HARDCODED⟩

## Mocks in use

| Mock | Replaces | Remove when |
|---|---|---|
| `settings-mock.ts` | Notification settings categories/channels | Backend confirms fully backend-driven settings (TBD) |
| ⟨FILL⟩ | | |

## Failure behaviour

Shared error normalization → `ApiError` ([05-data-models.md](./05-data-models.md)). 401 → refresh then login;
403 → no-permission state; 429 → rate-limit message; 5xx → error state with retry.
