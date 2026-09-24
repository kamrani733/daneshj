---
title: "Implementation Plan: public panel rebuild"
description: "Approved plan — rebuild /public-panel to the M3 Figma in light and dark, keep Actor + interactive-ops integrations"
category: "plan"
last_updated: "2026-09-25"
owner: "owner"
---

# Implementation Plan: public panel rebuild

Status: **Approved 2026-09-25.** Phase 2 is in progress on `feat/public-panel`.

## Goal

Rebuild `/public-panel` (`apps/usr/src/app/(public)/(site)/public-panel/`) to match the new
Figma, in **light and dark**, using Material Design 3 roles on shadcn/Radix + Tailwind v4.
Keep working integrations: Actor MS visitor profile, Interactive Ops follow / like / score / share.
Do not add MUI or any other component library.

## Design sources used for this plan

| Source | Status |
|---|---|
| [Figma Untitled `0-1`](https://www.figma.com/design/aKH5AZkwgcEfmh96gHTTWE/Untitled?node-id=0-1) | Primary when MCP is signed in (before step 2.1) |
| [Figma node `400-139432`](https://www.figma.com/design/aKH5AZkwgcEfmh96gHTTWE/Untitled?node-id=400-139432) | Dark frame (pattern IDs in `dark.svg` are `400_*`) |
| Figma MCP | Owner signs in before 2.1. If still unavailable, continue from exports and list every text/size estimated |
| Desktop exports (not in git; never copy SVGs/photos into the repo) | `Public Panel۲۳.svg` (composer collapsed), `Public Panel.svg` (focused empty), `Public Panel۲.svg` (typing), `dark.svg`, plus the three PNGs |
| Token docs | `docs/ai/m3-tokens.css` v2, `docs/ai/dark-mode-analysis.md`, `docs/ai/design-system-proposal.md` §3–§5 |

SVGs have outlined (not live) text. Visible strings below come from PNGs + `apps/usr/messages/fa.json` `publicPanel`. Composer geometry from SVGs: collapsed height **55** / `outline-variant` border; focused height **119** / `primary` border; counter «۲۸۰ از ۱۵۰۰» → max **1500**.

## SRS scope

Path codes covered (normal + exception):

- **Usr-Prf-6 / 6N1 / 6N2** — visitor public panel (user / individual / business retrieve)
- **USR1-53-1N1…1N13** — Interactive Ops follow / like / dislike / share / score (already wired; keep)
- Catalog cards: **Usr-Dsc-1N8**, **Usr-Nws-1N1 / 1N6**, newsletter UI — remain **UI-ONLY** (no product APIs)
- Panel comments — **SRS: TBD (profile SRS not in `docs/srs`)**. These are **not** the Msg service (Msg = private conversations). Do not tag them `Usr-Msg-*`.

Red/yellow SRS flags touched: **none**

## Acceptance criteria

- [ ] Page matches the light Figma (three composer states) and the dark frame (`400-139432` / `dark.svg`)
- [ ] No hex and no arbitrary `text-[…]` / `rounded-[…]` in new or rewritten public-panel TSX; semantic tokens only
- [ ] Actor retrieve-for-visitor loads for **guests** via same-origin `/api` (no `NEXT_PUBLIC_ACTOR_API_URL` gate)
- [ ] Interactive Ops follow/like/score/share still work
- [ ] Comments stay behind `api/` + `mock/` with the real UI shape; no invented endpoints; not tagged as Msg
- [ ] Strings in `fa.json` namespace `publicPanel`; Persian digits via `formatFaNumber`
- [ ] Path-alias imports; logical CSS properties; theme toggle visible on **mobile too**
- [ ] Shared shell updates per §4 (approved)
- [ ] After each Phase 2 commit: `pnpm exec nx run-many -t lint test build typecheck`

## Non-goals

- Inventing comment / catalog / electronic-card / phone endpoints
- Copying Desktop SVGs or their embedded photos into the repo
- Mass token rewrite of home, auth, private-panel, notifications beyond the approved commit-0 overwrites
- Changing `ProfileHeroCard` / `SocialLinksRow` defaults so private-panel shifts — new variants only
- Owner/admin retrieve and public-panel status mutations (APIs exist; this rebuild is the visitor page)
- Overwriting `--color-surface` / `--color-on-surface` / `--color-background` / `--color-app-scene`

## Dependencies

| Dependency | Status | Owner |
|---|---|---|
| Token overwrites (primary / on-primary / error) | **Approved** — commit 0 | owner |
| Shared header / CTA / footer | **Approved** — mobile toggle in commit 0; CTA/footer in 2.9 | owner |
| §5 product rules | **Answered** below | owner |
| Comment / catalog / card APIs | Not available — stay mock | — |
| Figma MCP | Owner signs in before 2.1 | owner |

## Assumptions

- Branch: `feat/public-panel`.
- Design language is M3 on shadcn/Radix + Tailwind v4.
- Catalog and comments keep today’s TypeScript shapes; mocks move under `mock/` with `api/` wrappers.
- Existing mock images stay; no SVG dumps.
- In public-panel, page wash uses `background`; cards use `surface-container-lowest`. Do **not** use `bg-surface` for the page (`bg-surface` stays “card” — see known issues).

## Approach summary

Rebuild top-to-bottom as shared M3 pieces first (`components/ui` + `/dev/ui-kit`), then section commits.
Fix guest Actor fetch first (step 2.0). Keep `page.tsx` thin. Do not touch Interactive Ops or Actor retrieve
contracts. Split the three oversized files in the first section commit that touches them.

---

## 1. Section inventory (top to bottom)

| # | Section | Current files | What changes | Data | Endpoint |
|---|---|---|---|---|---|
| 1 | **Header** | `components/site/site-header.tsx` | Add theme toggle on mobile. `surface-bright` already matches `app-header`. | REAL session | Auth session cookie |
| 2 | **Breadcrumb** | `heading.tsx` → `panel-breadcrumb.tsx` | M3 type (`text-label-large` / `on-surface-variant`). Extend via props/variant; private-panel default unchanged. | HARDCODED i18n | — |
| 3 | **Title + subtitle** | `heading.tsx` + `title-underline.tsx` | Bar heading (primary). Title «پنل عمومی» + display name. Map arbitrary sizes → headline tokens. | REAL name | Actor retrieve-for-visitor (guests too after 2.0) |
| 4 | **Profile hero** | `profile-hero-card.tsx` | New `public` variant. Provider badge = `warning-container` pair (incl. dark). Hide «مشاهده کارت الکترونیکی» when there is no card link. | REAL identity / bio / social / card href | `GET …/retrieve-for-visitor` |
| 5 | **Stats bar** | `stats-bar.tsx`, hook, dialogs | Visitors: follow / like / dislike / share. Own panel: hide those; owner actions live on comments. Stats like stays **primary** (not like-active red). Split dialogs (§7). | REAL | Interactive Ops paths (unchanged) |
| 6 | **Promo banner + dots** | `info-banner.tsx` | Carousel + dots. Dark custom banner → `inverse-surface` / `on-surface`. | HARDCODED i18n + local image | No API |
| 7 | **«سوابق تحصیلی»** | `records-accordion.tsx` | Hide the whole section when records are empty. | REAL | same retrieve |
| 8 | **Contact grid** | `service-info-section.tsx` + `SocialLinksRow` | Filled icon buttons. **No phone** until Actor MS returns it. | REAL contact | same retrieve |
| 9 | **Tabs** | `tabs.tsx` | Underline light; filled primary chip dark. | catalog totals | — |
| 10–12 | **Catalog cards** | `catalog/*` | Token restyle. **Hide «مشاهده همه»** until destination routes exist. Empty subsection → **hidden**. | MOCK | No list API — `api/` + `mock/` |
| 13 | **«سایر اطلاعات»** | `other-info-panel.tsx` | Empty tab can keep EmptyState. | PARTIAL REAL | individual retrieve |
| 14 | **Comments intro** | `comments/section.tsx` | Heading + intro. **SRS: TBD (profile SRS not in docs/srs).** | i18n + username | — |
| 15 | **Composer (3 states)** | inline in `section.tsx` → shared composer | Collapsed 55 / focused 119 / counter max 1500. «ارسال» disabled when empty. Guest focus → `GuestPromptState` «برای ثبت دیدگاه وارد شوید». | Client-only | No comment API |
| 16–17 | **Transferred / registered lists** | `section.tsx`, `card.tsx`, `transfer-flow.tsx` | Keep current client transfer behaviour; product rule TBD (known issues). Empty list → EmptyState «دیدگاهی ثبت نشده است». Owner: feature / reply / transfer / delete. like-active red on comment like only. | MOCK / client | No comment API. Comment like → Interactive Ops only for real numeric ids |
| 18 | **CTA band** | `site-motivation-box.tsx` | `brand-secondary` pill. Copy: «ثبت نام» for guests, «ارتقا عضویت» for signed-in. M3 type tokens. | HARDCODED i18n + session | — |
| 19 | **Footer** | `site-footer.tsx` | Underline `brand-secondary`; arbitrary sizes → M3 type tokens. | HARDCODED i18n | — |

**Page chrome:** `page.tsx` → `view.tsx`. Loading overlay stays. **Profile load failure → page `ErrorState`.** Guest may view the panel; composer is the guest gate.

---

## 2. Components — reuse / extend / create

Canonical UI library: `apps/usr/src/components/ui/`. Every **create** or **extend** gets a `/dev/ui-kit` demo in the same commit. `/dev/ui-kit` is created in commit 0 (dev-only, 404 in production).

| Element | Decision | Path / notes |
|---|---|---|
| Section heading with bar | **Create** | `section-heading.tsx` — `primary` / `brand-secondary` |
| Count chip | **Create** | `count-chip.tsx` |
| Stat item | **Create** | `stat-item.tsx` |
| Content card(s) | **Extend** then feature wrappers | Restyle `CatalogOfferCardShell` or one `product-card` with variants; no third family |
| Price display | **Create** | `price-display.tsx` |
| Rating | **Create** | `rating-stars.tsx` — `text-rating` (`#ffd393` in both modes) |
| View-count badge | **Extend** | `Badge` variant `viewcount` |
| Time chip | **Extend** | `Badge` variant `time` |
| Contact icon button | **Extend** | `SocialLinksRow` — no `phone` |
| Comment composer | **Create** | `comment-composer.tsx` |
| Comment item / thread / replies toggle / featured badge | **Create** | `comment-item`, `comment-thread`, `replies-toggle`, `featured-badge` |
| Search field | **Reuse** | `search-field.tsx` — new variant only if needed |
| Sort menu | **Create** | `sort-menu.tsx` |
| Button / Tabs / Accordion / Avatar / Badge / AppDialog / EmptyState | **Reuse / extend** | Tabs: new appearance variant |
| ErrorState / GuestPromptState | **Create** (commit 1) | `components/ui/error-state.tsx`, `guest-prompt-state.tsx` + ui-kit demos |
| Carousel dots | **Extract** if public-panel uses them | `components/ui/carousel-dots.tsx` |
| Profile hero | **Extend** | variant `public` |
| Breadcrumb | **Extend** | token classes or `tone` prop |

---

## 3. Token application — approved set

`docs/ai/m3-tokens.css` vs `apps/usr/src/app/globals.css`.

### Commit 0 overwrites (approved)

| Token | Was | Becomes |
|---|---|---|
| `--color-primary` `.dark` | `#008d63` | `#8dd5b2` |
| `--color-on-primary` light | `#fffbff` | `#ffffff` |
| `--color-on-primary` `.dark` | unset (`#fffbff`) | `#003825` |
| `--color-error` `.dark` | `#de3730` | `#ffb4ab` |
| `--color-on-error` `.dark` | unset (`#fffbff`) | `#690005` |

`--color-primary-foreground` is synced to `--color-on-primary` so `Button` / `Badge` actually pick up the pair.

**Do not overwrite:** `--color-surface`, `--color-on-surface`, `--color-background`, `--color-app-scene`.

**Naming mismatch (known issues):** existing `bg-surface` means **card** (`#fffbff` / `#171d19`). M3 v2 `surface` means **page**. Public-panel uses `background` for the page and `surface-container-lowest` for cards.

### Additive (no existing-screen change until used)

`primary-container`, `on-primary-container`, `brand-secondary`, `on-brand-secondary`, `surface-bright`, `surface-container-*`, `inverse-surface`, `inverse-on-surface`, `on-surface-variant`, `outline`, `outline-variant`, `error-container`, `on-error-container`, `warning-container`, `on-warning-container`, `tertiary-container`, `on-tertiary-container`, `featured`, `featured-container`, `rating` (`#ffd393` both modes), `like-active` (`#f66060` both), `overlay`, M3 type scale, M3 radii.

After commit 0: list every screen whose **dark** look changed (primary fills/text + error).

---

## 4. Shared shell — approved changes

Changing these files changes **home, cooperation, private-panel, notifications, public-panel**.

**Header** — add theme toggle on mobile (commit 0). No other header redesign.

**CTA** (step 2.9) — `warning` → `brand-secondary` on the pill; M3 type tokens; copy «ثبت نام» (guest) / «ارتقا عضویت» (signed-in).

**Footer** (step 2.9) — underline `brand-secondary`; arbitrary title sizes → M3 headline tokens.

**Not in this rebuild:** `SiteBgPattern`, `SiteShell` structure, footer link destinations.

---

## 5. Decisions (answered 2026-09-25)

1. **Owner vs visitor** — Keep current rules. Visitors see follow / like / dislike / share. Own panel hides those and shows owner actions (feature, reply as owner, transfer, delete).
2. **States** — Profile load failure → page `ErrorState`. Empty catalog subsections and empty academic records → **hidden**. Empty comment lists → `EmptyState` «دیدگاهی ثبت نشده است». Guests can view; focusing the composer → `GuestPromptState` «برای ثبت دیدگاه وارد شوید». Create `ErrorState` / `GuestPromptState` once in `components/ui`.
3. **Mobile** — Default convention: stack sections, single-column cards, full-width composer.
4. **«مشاهده همه»** — Hide until destination routes exist.
5. **«مشاهده کارت الکترونیکی»** — Hide when there is no card link.
6. **«ارسال»** — Stays disabled when empty.
7. **«منتقل‌شده»** — Keep current client-side behaviour; product rule TBD (known issues).
8. **Rating in dark** — Keep `#ffd393`.
9. **like-active red** — Comments only; stats-bar like stays primary.
10. **Tokens** — Overwrites listed in §3. Not surface / on-surface / background / app-scene.
11. **Shared shell** — Yes to mobile theme toggle; yes to `warning` → `brand-secondary` on CTA and footer underline; yes to M3 type tokens on those; CTA copy guest vs signed-in as in §4.
12. **Phone** — Drop until Actor MS returns it.
13. **Provider badge in dark** — Use the `warning-container` token pair.
14. **Figma** — Owner signs in before 2.1; if MCP is still down, continue from exports and list estimates.

---

## 6. Backend — no invented endpoints

| Capability | Today | Contract to keep |
|---|---|---|
| Visitor profile | REAL only when token + `NEXT_PUBLIC_ACTOR_API_URL` | Same retrieve paths. **Step 2.0:** enable for guests via `/api` rewrite (no public Actor URL required; token optional) |
| Academic / address / bio / social / card | REAL via mappers | same retrieve |
| Individual resume / portfolio | REAL | individual retrieve |
| Certificates | empty | no field mapped |
| Catalog | MOCK / EMPTY | `api/catalog.ts` + `mock/catalog.ts` |
| Promo | HARDCODED | no API |
| Comments | Client state | `api/comments.ts` + `mock/comments.ts`. **Not Msg.** SRS TBD |
| Comment like | Interactive Ops if id is numeric | keep; mock ids must not call the API |
| Follow / like / share / people / score | REAL | existing Interactive Ops only |

---

## 7. Split plan for oversized files

Unchanged. Split `comments/card.tsx` (776), `stats-dialogs.tsx` (435), `api/react-query.ts` (448) when first touched. `public-panel-mock.ts` (477) → `mock/profile.ts` + `mock/catalog.ts` + `mock/comments.ts`.

---

## Work breakdown

### Phase 1 — Plan

Done. Approved 2026-09-25.

### Phase 2

| Step | Task | Commit |
|---|---|---|
| 0 | Additive M3 tokens + approved overwrites; `10-design-system.md` + `10-design-system.mdc` → “M3 roles + shadcn, never MUI”; `/dev/ui-kit` (roles, type, shapes, light/dark); known-issues (surface name + transferred TBD); mobile theme toggle | `feat(ui): adopt M3 tokens and ui-kit` |
| 1 | Shared components + demos (incl. ErrorState / GuestPromptState) | `feat(ui): public-panel shared components` |
| 2.0 | Guest visitor profile via `/api` (drop `NEXT_PUBLIC_ACTOR_API_URL` gate; token optional on visitor query) | `fix(actor): load visitor profile without public actor URL` |
| 2.1 | Breadcrumb + title (after Figma sign-in) | section commit |
| 2.2 | Profile hero variant | |
| 2.3 | Stats bar + split dialogs | |
| 2.4 | Promo + dots | |
| 2.5 | Academic accordion (hide if empty) | |
| 2.6 | Service contact + tabs (no phone) | |
| 2.7 | Catalog cards; hide «مشاهده همه» | |
| 2.8 | Comments (3 composer states, both lists, split card, guest prompt) | `feat(ui): …` — **not** `msg` |
| 2.9 | CTA + footer (`brand-secondary`, type tokens, guest/signed-in CTA copy) | `feat(ui): …` |
| 3 | `docs/features/public-panel.md`, `CURRENT-PROGRESS.md`, routing, SRS coverage if needed | `docs: …` |

After each commit: `pnpm exec nx run-many -t lint test build typecheck`.

## Risks

| Risk | Mitigation |
|---|---|
| Dark `primary` / `error` overwrite restyles the whole app | List screens after commit 0; owner visual pass |
| Shared hero/social/breadcrumb restyles private-panel | Variants; default unchanged |
| Guest fetch without token | 2.0; Actor retrieve-for-visitor must allow unauthenticated read |
| Comment like against mock ids | Don’t call Interactive Ops unless the id is a real server id |
| Figma MCP still down at 2.1 | Exports + list every estimated text/size |

## Testing plan

- Unit: comment filter/sort; composer states; Actor query enabled without `NEXT_PUBLIC_ACTOR_API_URL`.
- Integration: Interactive Ops hooks — no signature change.
- Manual smoke (owner): visitor + owner + guest; light/dark; follow/like/share; composer 3 states; featured + replies. Auth/payment/permission **not** claimed verified by the agent.

## Rollout

- Feature flag: No
- Migration order: tokens → ui-kit → shared components → guest fetch → sections top to bottom → docs
- Backfill: none

## Documentation updates

- [x] This plan (approval + §5)
- [ ] `docs/09-known-issues.md` — surface naming; transferred TBD (commit 0)
- [ ] `docs/10-design-system.md` + `10-design-system.mdc` (commit 0)
- [ ] `docs/04-routing.md` — `/dev/ui-kit` (commit 0)
- [ ] `docs/08-configuration.md` — Actor gate note (step 2.0)
- [ ] `docs/features/public-panel.md` (commit 3)
- [ ] `CURRENT-PROGRESS.md` (commit 3)
- [ ] SRS coverage — remove false Usr-Msg UI-ONLY rows for panel comments (commit 3)

## Open questions

None blocking Phase 2. Remaining TBDs are recorded in `docs/09-known-issues.md` (transferred product rule; profile comment SRS).
