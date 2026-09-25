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
| Frame index | `docs/ai/figma-map.md` — node IDs, groups, dialog map |
| [Figma Untitled `0-1`](https://www.figma.com/design/aKH5AZkwgcEfmh96gHTTWE/Untitled?node-id=0-1) | Readable via MCP; link nodes as `…?node-id=400-139432` (`:` → `-`) |
| Figma MCP | `get_design_context` on the frame or child — do not guess text/size/spacing |
| Token paste target | `docs/ai/m3-tokens.css` **v3** (official Figma library values). v3 renames vs v2: `brand-secondary` → `secondary`; `warning-container` → `secondary-container`; `like-active` → `like`. Surface `#fafaf5`, background `#fafaf7` |
| Dark values | `docs/ai/dark-mode-analysis.md` (Figma libraries did not expose dark modes) |
| Desktop exports (not in git; never copy SVGs/photos into the repo) | Fallback only if MCP fails; list every estimated value |
| Typography rule | Figma **IRANSansXFaNum** in file; app stays **IRANSansX VF** + `formatFaNumber` until a separate font decision (see §5.15). **Do not apply Figma letter-spacing** to Persian text (`m3-tokens.css` v3 note) |

SVGs have outlined (not live) text. Visible strings below come from PNGs + `apps/usr/messages/fa.json` `publicPanel`. Composer geometry from SVGs: collapsed height **55** / `outline-variant` border; focused height **119** / `primary` border; counter «۲۸۰ از ۱۵۰۰» → max **1500**.

## SRS scope

Path codes covered (normal + exception):

- **Usr-Prf-6 / 6N1 / 6N2** — visitor public panel (user / individual / business retrieve)
- **USR1-53-1N1…1N13** — Interactive Ops follow / like / dislike / share / score (already wired; keep)
- Catalog cards: **Usr-Dsc-1N8**, **Usr-Nws-1N1 / 1N6**, newsletter UI — remain **UI-ONLY** (no product APIs)
- Panel comments — **SRS: TBD (profile SRS not in `docs/srs`)**. These are **not** the Msg service (Msg = private conversations). Do not tag them `Usr-Msg-*`.

Red/yellow SRS flags touched: **none**

## Acceptance criteria

- [ ] Page matches Figma frames cited in §1 (light `400:139432` + composer trio; dark `400:152711` / `400:153045`; guest / non-provider / empty / mobile per §5)
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
| Figma MCP | Available — use `figma-map.md` + MCP | — |

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

Figma authority: implement what each cited frame shows; ask only when a state has **no** frame in `figma-map.md`.

**Page-level frames (full scroll):**

| View | Node IDs |
|---|---|
| Individual provider (visitor) | `400:139432`, `400:139762` |
| Individual provider (owner vs visitor row 2) | `400:139600`, `400:139930` |
| Non-provider (no provider-only sections) | `400:140092`, `400:140219` |
| Guest (owner «درباره من» empty; composer gate) | `400:140940` · dark `400:153206`, `400:152884` |
| Dark desktop | `400:152711`, `400:153045` |
| Mobile / tablet | `400:152066` (393px) · `400:152184` (834px — frame name «Notifications»; confirm with design) |
| Empty states (catalog / comments / records) | `400:142206` |

| # | Section | Figma ref (node IDs) | Current files | What changes | Data | Endpoint |
|---|---|---|---|---|---|---|
| 1 | **Header** | Chrome in `400:139432` (+ dark `400:152711`) | `components/site/site-header.tsx` | Theme toggle on mobile. `surface-bright` = app header. | REAL session | Auth session cookie |
| 2 | **Breadcrumb** | `400:139432` | `heading.tsx` → `panel-breadcrumb.tsx` | M3 `text-label-large` / `on-surface-variant`. Variant only; private-panel default unchanged. | HARDCODED i18n | — |
| 3 | **Title + subtitle** | Panel title component `400:152630`; page `400:139432` | `heading.tsx` + `title-underline.tsx` | Bar heading (`primary`). «پنل عمومی» + display name. Headline tokens only. | REAL name | Actor retrieve-for-visitor (guests after 2.0) |
| 4 | **Profile hero** | Component `400:152670`; provider page `400:139432`; non-provider `400:140092`; guest `400:140940` | `profile-hero-card.tsx` | `public` variant. Provider badge = **`secondary-container`** / **`on-secondary-container`**. Hide electronic card CTA when no href (frame-dependent). | REAL identity / bio / social / card href | `GET …/retrieve-for-visitor` |
| 5 | **Stats bar** | `400:139432` / `400:139762` (visitor); owner row `400:139600` / `400:139930` (stats hidden); dialogs desktop `400:143264` (sort), `400:143292` (liked), `400:143280` (disliked), `400:143304` / `400:143538` (follow / following), `400:143550` (sharing); mobile dialogs `400:152228`…`400:152389` | `stats-bar.tsx`, hook, `stats-dialogs.tsx` | Visitor: follow / like / dislike / share. Own panel: hide bar actions. Stats like stays **primary** (not `like` red). Split dialogs (§7). | REAL | Interactive Ops (unchanged) |
| 6 | **Promo banner + dots** | `400:139432` | `info-banner.tsx` | Carousel + dots per frame. | HARDCODED i18n + local image | No API |
| 7 | **«سوابق تحصیلی»** | `400:139432`; empty → hidden per `400:142206` | `records-accordion.tsx` | Hide section when records empty. | REAL | same retrieve |
| 8 | **Contact grid** | `400:139432` | `service-info-section.tsx` + `SocialLinksRow` | Filled icon buttons. **No phone** until Actor MS returns it. | REAL contact | same retrieve |
| 9 | **Tabs** | `400:139432` · dark `400:152711` | `tabs.tsx` | Underline light; filled primary chip dark (per frame). | catalog totals | — |
| 10–12 | **Catalog cards** | Recent cards `400:152662`; populated `400:139432`; empty/hidden `400:142206` | `catalog/*` | Token restyle. **Hide «مشاهده همه»** until routes exist. Empty subsection → **hidden**. | MOCK | `api/` + `mock/` |
| 13 | **«سایر اطلاعات»** | Non-provider `400:140092`, `400:140219` | `other-info-panel.tsx` | Match shorter non-provider layout. | PARTIAL REAL | individual retrieve |
| 14 | **Comments intro** | `400:139432` | `comments/section.tsx` | Heading + intro. **SRS: TBD.** | i18n + username | — |
| 15 | **Composer (3 states)** | `400:141108`, `400:141276`, `400:141444`; guest prompt `400:140940` | `section.tsx` → `comment-composer.tsx` | Collapsed 55 / focused 119 / max 1500. «ارسال» disabled when empty. Guest → `GuestPromptState` per guest frame. | Client-only | No comment API |
| 16 | **Registered list + owner actions** | Lists in `400:139432`; feature `400:140346`, `400:140544`, `400:140742`; delete/restore `400:142331`, `400:142667`, `400:142499` + dialogs `400:143108`…`400:143111`; menus `400:143170`, `400:143241` (+ dark row in map) | `section.tsx`, `card.tsx` | Featured badge, reply, delete/restore, like = **`like`** on comment only. Empty → `400:142206`. | MOCK / client | Interactive Ops like only for real numeric ids |
| 17 | **Transferred list + transfer flow** | Flow `400:141644`, `400:141858`, `400:142026`, card `400:141813`; quote/transfer `400:142835`, dialogs `400:143004`…`400:143074`, overlays `400:143029`…`400:143032` | `transfer-flow.tsx`, `section.tsx` | UI per transfer frames; keep client-side behaviour where frames match today. | MOCK / client | No comment API |
| 18 | **CTA band** | `400:139432` (all full-page frames) | `site-motivation-box.tsx` | **`secondary`** pill. Guest «ثبت نام» / signed-in «ارتقا عضویت». M3 type tokens. | HARDCODED i18n + session | — |
| 19 | **Footer** | Same full-page frames | `site-footer.tsx` | Underline **`secondary`**; M3 type tokens. | HARDCODED i18n | — |

**Page chrome:** `page.tsx` → `view.tsx`. Loading overlay stays. **Profile load failure → page `ErrorState`** (no dedicated Figma frame — keep §5.1). Guest may view the panel; composer is the guest gate (`400:140940`).

---

## 2. Components — reuse / extend / create

Canonical UI library: `apps/usr/src/components/ui/`. Every **create** or **extend** gets a `/dev/ui-kit` demo in the same commit. `/dev/ui-kit` is created in commit 0 (dev-only, 404 in production).

| Element | Decision | Path / notes |
|---|---|---|
| Section heading with bar | **Create** | `section-heading.tsx` — `primary` / `secondary` |
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

`docs/ai/m3-tokens.css` **v3** vs `apps/usr/src/app/globals.css`. Until globals are aligned, map v3 names in new TSX to existing utilities or add v3 aliases in the same commit that renames tokens.

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

**Naming mismatch (known issues):** existing `bg-surface` means **card** (`#fffbff` / `#171d19`). M3 v3 `surface` is `#fafaf5` (not the page wash). Public-panel uses `background` (`#fafaf7`) for the page and `surface-container-lowest` for cards.

**v3 renames (deprecate old utility names when touching globals):** `brand-secondary` → `secondary`; `on-brand-secondary` → `on-secondary`; `warning-container` / `on-warning-container` (provider badge) → `secondary-container` / `on-secondary-container`; `like-active` → `like`.

### Additive (no existing-screen change until used)

`primary-container`, `on-primary-container`, `secondary`, `on-secondary`, `secondary-container`, `on-secondary-container`, `surface-bright`, `surface-container-*`, `inverse-surface`, `inverse-on-surface`, `on-surface-variant`, `outline`, `outline-variant`, `error-container`, `on-error-container`, `tertiary-container`, `on-tertiary-container`, `featured`, `featured-container`, `rating` (`#ffd393` both modes), `like` (`#f66060` both), `overlay`, M3 type scale (no Persian letter-spacing from Figma), M3 radii.

After commit 0: list every screen whose **dark** look changed (primary fills/text + error).

---

## 4. Shared shell — approved changes

Changing these files changes **home, cooperation, private-panel, notifications, public-panel**.

**Header** — add theme toggle on mobile (commit 0). No other header redesign.

**CTA** (step 2.9) — `warning` → **`secondary`** on the pill; M3 type tokens; copy «ثبت نام» (guest) / «ارتقا عضویت» (signed-in).

**Footer** (step 2.9) — underline **`secondary`**; arbitrary title sizes → M3 headline tokens.

**Not in this rebuild:** `SiteBgPattern`, `SiteShell` structure, footer link destinations.

---

## 5. Decisions (answered 2026-09-25; Figma-backed update 2026-09-25)

1. **Owner vs visitor** — Keep current rules. Visitors see follow / like / dislike / share. Own panel hides those and shows owner actions (feature, reply as owner, transfer, delete). **Figma:** visitor `400:139432` / `400:139762`; owner row `400:139600` / `400:139930`.
2. **States** — **Implement per Figma frames** (`figma-map.md`): guest panel `400:140940` (dark `400:153206`, `400:152884`); non-provider `400:140092`, `400:140219`; empties `400:142206`; composer states `400:141108`, `400:141276`, `400:141444` + guest gate on `400:140940`. Profile load failure → page `ErrorState` (no frame — keep). `ErrorState` / `GuestPromptState` once in `components/ui`.
3. **Mobile** — **Do not invent layout.** Match `400:152066` (mobile) and `400:152184` (tablet — confirm frame label). Dialogs: `400:152228`, `400:152233`, `400:152238`, `400:152243`, `400:152359`, `400:152389`.
4. **«مشاهده همه»** — Hide until destination routes exist.
5. **«مشاهده کارت الکترونیکی»** — Hide when there is no card link.
6. **«ارسال»** — Stays disabled when empty.
7. **«منتقل‌شده»** — **Implement transfer UI from** `400:141644`, `400:141858`, `400:142026`, `400:142835`, Discount card `400:141813`, overlays/dialogs in `figma-map.md` §transfer. Keep client-side transfer logic where frames match existing behaviour; remaining product gaps → known issues.
8. **Rating in dark** — Keep `#ffd393`.
9. **`like` red** — Comments only; stats-bar like stays primary.
10. **Tokens** — v3 in `docs/ai/m3-tokens.css`; overwrites in §3. Not overwriting legacy card `surface` / `on-surface` / `app-scene` in commit 0; page wash uses v3 `background`.
11. **Shared shell** — Mobile theme toggle; CTA/footer use **`secondary`**; M3 type tokens; CTA copy guest vs signed-in as in §4.
12. **Phone** — Drop until Actor MS returns it.
13. **Provider badge in dark** — **`secondary-container`** / **`on-secondary-container`** (v3).
14. **Figma** — MCP + `figma-map.md`; cite node IDs in section commits and PR.
15. **Font** — Figma uses **IRANSansXFaNum**; app keeps **IRANSansX VF** + `formatFaNumber` for this rebuild. Switch assessment below — **do not switch yet**.

### 5.1 Font switch assessment (IRANSansX VF → IRANSansXFaNum) — hold

| Area | Risk if we switch now | Recommendation |
|---|---|---|
| **Displayed counts / stats / ratings** | FaNum maps ASCII `0-9` to Persian glyphs; `formatFaNumber` already emits Unicode `۰-۹`. Likely **redundant** but should still render; verify no double-width or font-feature clash in ui-kit. | Safe after visual pass; could simplify call sites later. |
| **`formatFaNumber` / charts** | Still correct with FaNum; removing formatters later is optional, not required for switch. | Keep `formatFaNumber` through rebuild. |
| **OTP / numeric inputs** | `digitsOnly` uses `/\D/g` (ASCII digits only). Persian digit **input** would be stripped; keyboards usually send `0-9`. FaNum display of stored ASCII digits would look Persian — **desired** for auth UI. | Low risk; smoke-test login/register OTP after any switch. |
| **`dir="ltr"` blocks** | Used for layout (carousels, tables, footer columns), not for Latin-only font. FaNum affects digits inside LTR spans, not Latin letters. | Safe; spot-check session table IPs and transfer-flow LTR row. |
| **`tracking-widest` on OTP** | Letter-spacing on Persian breaks joining (rule: never apply Figma tracking on Persian). OTP field is Latin digits — OK today. | Do not add tracking to Persian labels when switching. |
| **Variable font** | App uses single **VF** file (`100 900`). FaNum is typically **static cuts** (multiple files) — bundle and `font-weight` mapping need a deliberate change in `layout.tsx`. | Main blocker; needs font files + loading plan. |
| **Private-panel / notifications** | Global `html` font — switch is app-wide, not public-panel-only. | Treat as separate ADR + full-app regression. |

**Verdict:** Switch is **probably safe functionally** for digits and LTR islands, but **not** a drop-in swap (VF vs FaNum files, global blast radius). Stay on VF + `formatFaNumber` for Phase 2; revisit with static FaNum files and an app-wide visual QA checklist.

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
| 2.1 | Breadcrumb + title (`400:152630`, `400:139432`) | section commit |
| 2.2 | Profile hero variant | |
| 2.3 | Stats bar + split dialogs | |
| 2.4 | Promo + dots | |
| 2.5 | Academic accordion (hide if empty) | |
| 2.6 | Service contact + tabs (no phone) | |
| 2.7 | Catalog cards; hide «مشاهده همه» | |
| 2.8 | Comments (3 composer states, both lists, split card, guest prompt) | `feat(ui): …` — **not** `msg` |
| 2.9 | CTA + footer (`secondary`, type tokens, guest/signed-in CTA copy) | `feat(ui): …` |
| 3 | `docs/features/public-panel.md`, `CURRENT-PROGRESS.md`, routing, SRS coverage if needed | `docs: …` |

After each commit: `pnpm exec nx run-many -t lint test build typecheck`.

## Risks

| Risk | Mitigation |
|---|---|
| Dark `primary` / `error` overwrite restyles the whole app | List screens after commit 0; owner visual pass |
| Shared hero/social/breadcrumb restyles private-panel | Variants; default unchanged |
| Guest fetch without token | 2.0; Actor retrieve-for-visitor must allow unauthenticated read |
| Comment like against mock ids | Don’t call Interactive Ops unless the id is a real server id |
| Tablet frame `400:152184` mislabeled in Figma | Confirm with design before 2.7+ layout |

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
