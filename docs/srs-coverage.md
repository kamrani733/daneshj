---
title: "SRS Feature Coverage"
description: "Mapping of SRS paths to frontend implementation status"
category: "audit"
last_updated: "2026-09-25"
---

# SRS Feature Coverage

Extracted from [audit §8](./ai/00-project-audit.md#8-srs-feature-map).

## Status Legend

| Status | Definition |
|--------|------------|
| **DONE** | SRS operation implemented end-to-end with real backend integration |
| **PARTIAL** | Subset of operation or mock/generic substitute |
| **UI-ONLY** | Screen/widget exists without service API |
| **MISSING** | No matching frontend implementation |

## Summary by Service

| Service | DONE | PARTIAL | UI-ONLY | MISSING | Total |
|---------|------|---------|---------|---------|-------|
| **SRV** (general service pages) | 0 | 9 | 0 | 26 | 35 |
| **Rwd** (rewards) | 0 | 0 | 0 | 26 | 26 |
| **Dsc** (discount on goods & services) | 0 | 4 | 3 | 129 | 136 |
| **Rfl** (invite friends) | 0 | 4 | 0 | 19 | 23 |
| **Msg** (messaging) | 0 | 0 | 4 | 28 | 32 |
| **Nws** (news) | 0 | 0 | 4 | 99 | 103 |
| **Nwl** (newsletter) | 0 | 0 | 4 | 117 | 121 |
| **Cln** (calendar events) | 0 | 0 | 0 | 81 | 81 |
| **TOTAL** | **0** | **17** | **15** | **525** | **557** |

## Implemented Outside SRS Index

The following screens/domains are implemented but not in the Chapter-2 service path index:

- `/cooperation` — static cooperation page
- Auth flows (`/login`, forgot-password, sessions) — Actor auth MS
- `private-panel`, `public-panel` — Profile (`Prf`) / Actor MS
- `/notifications/*` — Notification MS (`Ntf` codes in comments)
- Interactive ops (follow/like/score/share) — `public-panel/api/interactive-ops.ts`
- `apps/adm`, `apps/bus` placeholder landing pages
- Temporary admin login

## Cross-Service Patterns

| Pattern | In codebase? | Abstraction |
|---------|--------------|-------------|
| Approval workflow (submit → approve/reject + reason) | **Partial** | Per-profile Actor APIs + `review-pending-list`; not shared |
| Soft delete + restore | **Partial** | `create-delete-panel.tsx`; not service-wide |
| Archive / unarchive | **Not found** | — |
| Main / sub categories | **Partial** | Notification filter categories only |
| Managed reason lists | **Not found** | — |
| Notifications to counterpart | **Partial** | Notification MS inbox only |
| Audit logging UI | **Not found** | — |
| Reports / statistics / charts | **Partial** | `notifications/stats`, `charts`, `reports` only |
| Upload format/size errors | **Partial** | `documents-panel.tsx`, `view-field.tsx` |
| Guest access error | **Partial** | Auth middleware only |

## Detailed Tables

For the full per-path breakdown, see [audit §8](./ai/00-project-audit.md#8-srs-feature-map).
