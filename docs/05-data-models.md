---
title: "Data Models"
description: "Shared entity shapes, status maps and response contracts"
category: "architecture"
last_updated: "2026-09-25"
---

# Data Models

> **Existing types:** Handwritten TypeScript in each feature's `types/` (e.g.
> `notifications/types/api.ts` ~490 lines, private/public panel `types/api.ts`). **No OpenAPI codegen** in the
> repo. Shared minimal types: `libs/shared-types` (`User`, `Session` only). API envelopes `{ success, message,
> errors }` are asserted per feature (`assertApiSuccess`, duplicated `formatApiResponseError` helpers).

## Shared contracts (target — confirm with backend)

```ts
// libs/shared/data-access — provisional until OpenAPI specs exist
type Id = string;

interface Paginated<T> { items: T[]; page: number; pageSize: number; total: number }   // panel lists, pageSize 24
interface CursorPage<T> { items: T[]; nextCursor: string | null }                       // infinite-scroll lists

interface ApiError {
  status: number;
  code: string;                 // stable machine code, mapped to an SRS E-path where one exists
  message: string;              // Persian, user-displayable
  fieldErrors?: Record<string, string>;
}

interface SoftDeletable { deletedAt: string | null; restorableUntil: string | null }
interface Archivable   { archivedAt: string | null }
interface Audited      { createdAt: string; createdBy: Id; updatedAt: string; updatedBy: Id }

interface Category { id: Id; name: string; parentId: Id | null; deletedAt: string | null }
interface Reason   { id: Id; kind: 'reject' | 'cancel' | 'suspend' | 'unpublish'; title: string; inUse: boolean; deletedAt: string | null }

interface ModerationDecision { decision: 'approve' | 'reject'; reasonId?: Id; note?: string }
interface FieldChange<T = unknown> { field: string; oldValue: T; newValue: T; status: 'pending' | 'approved' | 'rejected'; reasonNote?: string }
```

## Status maps

Each moderated entity defines its statuses and allowed transitions once, in its service `types` module:

```ts
// example shape — values per 03-domain-and-rules.md, confirm enums with backend
export const productTransitions = {
  draft:            { submit: 'pendingPublish' },
  pendingPublish:   { approve: 'published', reject: 'rejected' },
  published:        { unpublish: 'unpublished', archive: 'archived' },
  // …
} as const;
```

UI actions are derived from `transitions[status]` ∩ actor capabilities. No ad hoc `if (status === …)` in components.

## Derived / display-only rules

- Prices, discounts, wallet balances, rewards and event fees are server values; never computed for submission.
- Relative times, Jalali dates and digit formatting come from the shared formatting util.
