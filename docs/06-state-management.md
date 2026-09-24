---
title: "State Management"
description: "Where server, client and URL state live, and the rules for each"
category: "architecture"
last_updated: "2026-09-25"
---

# State Management

> Current: ⟨FILL: libraries and where state lives today, audit §4⟩

## Server state

Query cache via ⟨FILL: library⟩. One query-key factory per service. Suggested `staleTime`:

| Data | staleTime |
|---|---|
| Categories, reason lists, terms/help pages | long (10–30 min) |
| Public lists and details (products, news, newsletters, events) | medium (1–5 min) |
| Panel lists after moderation actions | short (≤ 30 s) + targeted invalidation |
| Messages, conversations, notifications, unread counts | very short / realtime ⟨FILL: polling or socket?⟩ |
| Wallet balance, voucher/receipt/registration state | 0 — always refetch |

## Client state

- Session/actor: one provider fed from the server session; components use `useActor()`.
- UI toggles (sidebar, theme, drawer): local or a small store ⟨FILL⟩.
- Form drafts: form library state; unsaved-change guard on multi-tab forms.
- Filters, sort, search, pagination, tabs: URL query params.

## Mutations

- Targeted invalidation after success.
- No optimistic updates for money, registrations, moderation or deletes. Optimistic allowed for pin / favourite /
  archive in messaging only.
