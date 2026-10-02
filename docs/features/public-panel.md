---
title: "Feature: Public panel (پنل عمومی)"
description: "Visitor-facing actor profile: role-based views, provider catalog, comments, demo personas"
category: "feature"
last_updated: "2026-10-02"
---

# Feature: Public panel (پنل عمومی)

## Summary

`/public-panel` shows an actor's public profile to the owner, other signed-in users, guests and admins: hero
(identity, bio, socials, e-card link), interaction stats, promo banner, academic records, and — on an individual
service provider panel — the provider contact grid, «محصولات من» catalog and «سایر اطلاعات» (résumé, portfolio).
Comments (transferred + registered) close the page. Built from the Public Panel Figma exports (desktop 1512,
tablet 834, mobile 393) for the individual-provider, non-provider and guest views.

## SRS coverage

| Path code | Name | Status | Files |
|---|---|---|---|
| `Usr-Prf-6`, `6N1`, `6N2` | Visitor public panel (user / individual / business retrieve) | PARTIAL | `public-panel/api/`, `components/view.tsx` |
| `USR1-53-1N1…1N13` | Follow / like / dislike / share / score (Interactive Ops) | PARTIAL | `api/interactive-ops.ts`, `hooks/use-profile-stats-bar.ts` |
| `Usr-Dsc-1N8`, `Usr-Nws-1N1 / 1N6` | Catalog cards | UI-ONLY | `components/catalog/tabs.tsx`, `components/cards/*` |
| Panel comments | Comments on a public panel | UI-ONLY — profile SRS not in `docs/srs` (not Msg) | `components/comments/*` |

Role rules come from the Expectation (User) report, tables «نقش عملگرها در صفحه پنل عمومی» and «عملیات دیدگاه ها».

## Actors

Single source: `public-panel/capabilities.ts` (`getPublicPanelCapabilities`). Codes: F = enabled ·
M = shown, guest gets message m21 · V = view only · AR / NA = hidden.

| Capability | Owner | Signed-in user | Guest | Admin |
|---|---|---|---|---|
| Follow / like / dislike / share (stats bar) | AR | F | M | AR |
| Dislike count + list | — | — | — | F (extra «نپسند کننده» stat) |
| People dialogs row action | remove / unfollow / follow toggle | follow toggle | M | none |
| Comment composer | NA | F | guest prompt | NA |
| Reply | F | F | M | NA |
| Like / dislike a comment | F | F | M | V |
| Transfer a comment (to own panel) | NA | F | M | AR |
| Report a comment | F | F | M | F |
| Feature («برگزیده») | F | AR | AR | AR |
| Delete comment / reply | own | own | — | any (soft) |
| Restore deleted comment | — | — | — | F |
| Remove / edit transferred comments | F | — | — | — |
| Provider info + «محصولات من» | individual-provider panel only, all viewers | | | |

Admin = session whose login type is not a user (`page.tsx`, same rule as `SiteShell`).

## Routes

| Route | Purpose | Guard |
|---|---|---|
| `/public-panel?actor_id=&actor_type=` | Visitor view of an actor; without `actor_id` the viewer's own panel | none (guests allowed); backend enforces actions |

## Key modules

| Layer | Path | Responsibility |
|---|---|---|
| Route | `app/(public)/(site)/public-panel/page.tsx` | session → viewer id, admin flag |
| View | `components/view.tsx` | sections, `GuestAccessProvider` (m21 dialog) |
| Capabilities | `capabilities.ts`, `hooks/use-public-panel-capabilities.ts` | role × panel → actions |
| Data | `api/`, `api/react-query.ts`, `api/profile-mappers.ts` | Actor MS visitor retrieve, Interactive Ops |
| Cards | `src/components/cards/` | shared Discount / News / Newsletter cards with hover |
| Comments | `components/comments/section.tsx`, `card.tsx`, `utils/comments.ts` | lists, sort menu, featured-first, soft delete |
| Demo | `lib/demo-mode/persona.ts`, `demo/viewer-context.ts`, `mock/`, `data/public-panel-mock.ts` | presentation personas |

## Demo mode

Gate `NEXT_PUBLIC_DEMO_MODE_ENABLED=true` + cookie `demo_mode=1`; persona cookie `demo_persona`. Eight personas:
`{owner|visitor|guest|admin}-{individual-provider|non-provider}` (legacy `guest` maps to
`guest-individual-provider`). Guest personas show the owner with an empty «درباره من» (guest export). On phones
the persona select and toggle live in the demo banner.

## Responsive

- Phones: breadcrumb shows the current page only; hero stacked; stats labels without icons; banner art above
  text; service contacts as 56px icons, four per row; comment search above an icon-only sort.
- Tablet (834): hero stacked with full-width «درباره من»; side-by-side hero from 1024.

## Edge cases

- Empty academic records → section hidden; no e-card link → «مشاهده کارت الکترونیکی» hidden.
- Profile load failure → `ErrorState` with retry; loading → `PanelLoadingOverlay`.
- Soft-deleted comments are visible to admins only.

## Known gaps

See [09-known-issues.md](../09-known-issues.md) → public panel rows.
