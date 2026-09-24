---
title: "State Management"
description: "Where server, client and URL state live, and the rules for each"
category: "architecture"
last_updated: "2026-09-25"
---

# State Management

> **Current:** TanStack Query v5 for server state; httpOnly session cookie + server `getSession()` for auth;
> Zustand for minimal `useAuthStore` (user mirror) and `useAuthFlowStore` (auth wizard, persisted); local
> `useState` / `useReducer` in large feature components; URL via `searchParams` (`actor_id`, `actor_type`, `next`,
> referral codes).

## Server state

Query cache via **TanStack Query v5** (`QueryProvider` in `libs/shared-ui`). Global defaults:
`staleTime: 30_000`, `retry: 1`, `refetchOnWindowFocus: false` (`libs/shared-ui/src/lib/query-client.ts`).
One query-key module per feature (`api/query-keys.ts` / `react-query.ts`). Suggested `staleTime`:

| Data | staleTime |
|---|---|
| Categories, reason lists, terms/help pages | long (10–30 min) |
| Public lists and details (products, news, newsletters, events) | medium (1–5 min) |
| Panel lists after moderation actions | short (≤ 30 s) + targeted invalidation |
| Messages, conversations, notifications, unread counts | very short; **realtime mechanism TBD** (no WebSocket client in repo — React Query refetch today) |
| Wallet balance, voucher/receipt/registration state | 0 — always refetch |

## Client state

- Session/actor: server session passed as `accessToken` props; **no** centralized `useActor()` yet (planned).
- UI toggles (sidebar, theme): `next-themes` `ThemeProvider` + local component state.
- Form drafts: local state in controllers (no form library); auth flow state in persisted Zustand (`auth-flow`).
- Filters, sort, search, pagination, tabs: URL query params (notifications inbox) or local state (some panels).

## Mutations

- Targeted invalidation after success.
- No optimistic updates for money, registrations, moderation or deletes. Optimistic allowed for pin / favourite /
  archive in messaging only.
