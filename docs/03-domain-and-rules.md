---
title: "Domain & Business Rules"
description: "Actors, per-service access matrix, status lifecycles and business rules from the SRS"
category: "architecture"
last_updated: "2026-09-25"
---

# Domain & Business Rules

Derived from `srs/`. Where the SRS is silent or flagged, the rule says TBD. Codes in brackets point to SRS paths.

## Actors

| Actor | Code | Notes |
|---|---|---|
| Guest | — | Public read only; interactive actions → guest-access error (e.g. `Usr-Dsc-1E1`, `Usr-Msg-1E1`) |
| User | `Usr` | Student account |
| Provider | `ASR` | Natural or legal entity. Legal-entity providers are blocked from some user actions (`ASR-Rfl-1E2`, `ASR-Nws-1E2`) |
| Admin | `Adm` | Full moderation/configuration |
| System | `Sys` | Automatic jobs only (`Sys-Rwd-2N2`, `Sys-Nwl-9N7`) |

Permission source of truth: TBD (JWT claims / `loginType` / actor type) — see [09-known-issues.md](./09-known-issues.md).
Policy: deny by default, grant per matrix, backend enforces.

## Access matrix (by capability)

| Capability | Guest | Usr | ASR | Adm |
|---|---|---|---|---|
| View service home pages, lists, details (Dsc, Nws, Nwl, Cln) | ✅ | ✅ | ✅ | ✅ |
| Terms / help pages per service (SRV-503/504) | ✅ | ✅ | ✅ | ✅ |
| Get discount voucher / payment receipt (Dsc-3, Dsc-4) | ❌ | ✅ | ❌ | ❌ |
| Create / edit products, vouchers, receipts (Dsc-2/3/4) | ❌ | ❌ | ✅ own | ✅ |
| Request product delete / restore / publish (Dsc-2) | ❌ | ❌ | ✅ | — |
| Approve / unpublish products; approve/reject receipts (Dsc-2, Dsc-4) | ❌ | ❌ | ❌ | ✅ |
| Create news (Nws-2) | ❌ | ✅ | ✅ (natural) | ✅ |
| Object to news deletion (Nws-2) | ❌ | ✅ | ✅ | — |
| Approve / reject news (Nws-3) | ❌ | ❌ | ❌ | ✅ |
| Create / edit / copy newsletters (Nwl-2/3) | ❌ | ❌ | ✅ own | ✅ |
| Approve / reject / suspend newsletters (Nwl-3/4) | ❌ | ❌ | ❌ | ✅ |
| Object to newsletter suspension (Nwl-4) | ❌ | ❌ | ✅ | — |
| Report a newsletter (Nwl-5) | ❌ | ✅ | ❌ | ❌ |
| Archive / preview / download newsletters (Nwl-6/7) | ❌ | ✅ | ✅ | ✅ |
| Register / cancel registration for events (Cln-3) | ❌ | ✅ | ❌ | ❌ |
| Suggest events (Cln-4) | ❌ | ✅ | ❌ | approve/reject |
| Create / edit / cancel / delete events (Cln-2) | ❌ | ❌ | ❌ | ✅ |
| Conversations and messages (Msg-1/2) | ❌ | ✅ | TBD | TBD |
| Create / share referral links (Rfl-1) | ❌ | ✅ | ❌ (legal entity) | ❌ |
| View own rewards (Rwd-1) | ❌ | ✅ | ❌ | ✅ all |
| Manage reward topics (Rwd-2) | ❌ | ❌ | ❌ | ✅ |
| Manage categories and reason lists (Dsc-5/6, Nws-4/5, Nwl-8/9, Cln-5/6) | ❌ | ❌ | ❌ | ✅ |
| Reports / statistics (per service) | ❌ | own | own | ✅ all |
| Approve operations of other actors on services (SRV-525) | ❌ | ❌ | ❌ | ✅ |

Rows marked TBD are not explicit in the SRS; confirm before implementing.

## Status lifecycles (as described in the SRS — confirm exact enums with backend)

| Entity | Statuses mentioned |
|---|---|
| Product (Dsc) | draft → pending publish (در انتظار انتشار) → approved/published (تایید/منتشر شده) · rejected (رد) · unpublished (لغو انتشار, with reason) · ended (پایان) · archived · deleted (restorable) |
| Voucher / receipt (Dsc) | active · used · deleted (restorable; used ones can't be deleted) · receipt approved/rejected by admin |
| News (Nws) | pending approval → approved / rejected (with reason) · deleted (restorable, objection possible) · archived |
| Newsletter (Nwl) | pending publish → published / rejected (reason) · suspended (reason; objection possible) → unsuspended · reported · archived · deleted (restorable) |
| Calendar event (Cln) | active · cancelled (reason; restorable) · deleted (restorable) · archived · held |
| Event suggestion (Cln-4) | pending → approved / rejected · deleted (restorable) |
| Category / reason | active · deleted (restorable within retention) · auto-deleted when unused (`Sys`) |

Each entity's transitions are coded once as a state map (`05-data-models.md`).

## Business rules

1. Delete is soft; restorable for an admin-configured retention period, then physically deleted by the backend.
2. Items in use (categories with subs, used reasons, used vouchers/receipts) cannot be deleted — show the E-path.
3. Rejecting, unpublishing, suspending, cancelling require a reason from the service's managed list.
4. Unpublishing a product and a reported newsletter give the publisher a negative reward (Rwd dependency).
5. Duplicate product titles are not allowed within one business (`Dsc-2E4`); duplicate category names within the
   same level/parent are not allowed.
6. Product content language must match the site language (`Dsc-2E5`).
7. Referral links: max 3 per user per calendar day; the 4th attempt is disabled until the next day (Rfl-1).
8. Event registration can be free, wallet-paid or gateway-paid; cancellation allowed until 24 h before start.
9. Discount code validity is set in days (default 1).
10. Unread message counts over 99 display as `+99`.
11. Panel lists paginate at 24 per page; public lists that the SRS marks use infinite scroll.
12. Search input max 50 characters; names min 3 characters (min 2 in some edit forms — follow the path text).
13. Upload limits: featured image ≤ 1 MB (jpg/png/webp/avif); list image ≤ 500 KB; product image 342×511 < 1 MB;
    newsletter PDF ≤ 3 MB; discount-code import xlsx with one column.

## Terminology

Glossary: [srs/README.md](./srs/README.md#glossary-persian--english). Code identifiers use the English term
(`provider`, `voucher`, `receipt`, `unpublish`, `suspend`, `archive`, `restore`); UI uses the Persian SRS term.

## Out of scope (until specified)

Rewards cash-out / pay-to-wallet / pay-with-reward (flagged red), and every service listed as headings only.
