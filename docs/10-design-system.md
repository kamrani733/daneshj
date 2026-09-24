---
title: "Design System"
description: "Tokens, status colors, typography, components and the consolidation plan — read before any UI work"
category: "architecture"
last_updated: "2026-09-25"
---

# Design System

Language: **Material Design 3 roles + shadcn/Radix + Tailwind v4. Never add MUI** or any other component library.

## Principles

1. **One source per value.** Every color, size, radius and shadow is a token; components never contain literals.
2. **Palette wins over screens.** If a Figma screen differs from the documented palette, the palette is right.
3. **One component per element.** A card, a badge, a list toolbar exists once and is configured by props.
4. **RTL by construction.** Logical properties only; directional icons mirror.
5. **Visual check first.** Every shared component is shown on `/dev/ui-kit` before it is used on a screen.
6. **No hex / arbitrary type or radius in new TSX.** Use M3 semantic tokens so dark mode follows automatically.

## Sources

| What | Where |
|---|---|
| Figma file | [Untitled](https://www.figma.com/design/aKH5AZkwgcEfmh96gHTTWE/Untitled?node-id=0-1) (public panel dark: `400-139432`) |
| CSS variables | `apps/usr/src/app/globals.css` — Tailwind v4 `@theme` + M3 roles from `docs/ai/m3-tokens.css` v2 |
| Theme / Tailwind mapping | `apps/usr/src/app/globals.css` (semantic tokens in `@theme`, dark flip in `.dark`) |
| Shared UI library | `apps/usr/src/components/ui/` (shadcn/Radix). **Never MUI.** |
| Icons | `apps/usr/src/components/icons/material-icons.tsx` (inline SVG components) + `lucide-react` icons |
| Fonts | **IRANSansX VF** — `apps/usr/public/fonts/IRANSansXVF.ttf`, loaded via `next/font/local` in `layout.tsx` |
| UI-kit route | `/dev/ui-kit` (dev only; `notFound()` in production) |

## Token architecture

```text
primitives   --color-green-500, --space-4, --radius-2       (raw values, from Figma variables)
    ↓
semantic     --bg-surface, --text-primary, --border-default, --status-success-fg / -bg
    ↓
components   use semantic tokens only (utility classes mapped to semantic tokens)
```

Naming: `--<category>-<role>[-<variant>]`. If Figma uses its own names (e.g. `BG1`, `TX2`), keep them as
primitives and map semantic tokens onto them, so Figma and code can still be compared by name.

## Color

| Semantic token | Role | Light | Dark | CSS variable | Class |
|---|---|---|---|---|---|
| `brand` / `primary` | Primary brand, primary buttons | `#008d63` | `#8dd5b2` | `--color-primary` | `bg-primary`, `text-primary` |
| `brand-hover` | Hover of brand surfaces | `#006c4b` | `#2ea377` | `--color-primary-hover` | — |
| `secondary` | Secondary accent | `#dee4de` | `#2c322e` | `--color-secondary` | `bg-secondary` |
| `bg-page` | App background | `#fafaf5` | `#0f1511` | `--color-background` | `bg-background` |
| `bg-surface` | **Cards, panels** (legacy name — not M3 page) | `#fffbff` | `#171d19` | `--color-surface` | `bg-surface` |
| `bg-subtle` | Table headers, zebra, inputs | `#eff1ed` | `#2c322e` | `--color-muted` | `bg-muted` |
| `text-primary` | Body text | `#171d19` | `#eff1ed` | `--color-foreground` | `text-foreground` |
| `text-secondary` | Secondary text | `#57605b` | `#8a938c` | `--color-content-muted` | `text-content-muted` |
| `text-muted` | Hints, placeholders | `#8a938c` | `#8a938c` | `--color-muted-foreground` | `text-muted-foreground` |
| `text-on-brand` / `on-primary` | Text on brand fill | `#ffffff` | `#003825` | `--color-on-primary` | `text-on-primary`, `text-primary-foreground` |
| `border-default` | Card/table borders | `#bfc9c1` | `#404943` | `--color-border` | `border-border` |
| `border-field` | Inputs | `#bfc9c1` | `#404943` | `--color-input` | `border-input` |
| `success` | Success fg + tint | `#008d63` / `#d3f4e1` | — | `--color-primary`, `--color-primary-subtle` | `text-primary`, `bg-primary-subtle` |
| `warning` | Warning fg + tint | `#e06333` / `#ffdbcf` | `#e06333` / `#72351f` | `--color-warning`, `--color-warning-subtle` | `text-warning`, `bg-warning-subtle` |
| `error` | Error fg + tint (borders, messages) | `#ba1a1a` / `#ffdad6` | `#ffb4ab` / `#93000a` | `--color-error`, `--color-error-subtle` | `text-error`, `bg-error-subtle` |
| `info` | Info / in-process fg + tint | `#244c5b` / `#c1e9fb` | `#567c8d` / `#073543` | `--color-info`, `--color-info-subtle` | `text-info`, `bg-info-subtle` |
| `disabled` | Disabled fill + text | opacity 50% via `disabled:opacity-50` | — | — | `disabled:opacity-50` |
| `overlay` | Modal / hover scrim | `rgb(0 0 0 / 0.32)` | same | `--color-overlay` | `bg-overlay` |
| `brand-secondary` | Logo orange, CTA, section bars | `#e06333` | `#ffb59b` | `--color-brand-secondary` | `bg-brand-secondary` |
| `rating` | Card stars | `#ffd393` | `#ffd393` | `--color-rating` | `text-rating` |
| `like-active` | Comment like (not stats bar) | `#f66060` | `#f66060` | `--color-like-active` | `text-like-active` |
| `featured` / `featured-container` | Featured comment | `#f59e0b` / `#fff5eb` | `#f59e0b` / `#211d18` | `--color-featured*` | `text-featured`, `bg-featured-container` |
| `surface-container-lowest` | New cards (M3) | `#ffffff` | `#0a0f0c` | `--color-surface-container-lowest` | `bg-surface-container-lowest` |

Public-panel pages use `bg-background` for the page and `bg-surface-container-lowest` for cards. Do not use `bg-surface` as the page wash — that token still means “card”. See [09-known-issues.md](./09-known-issues.md).

### Hardcoded colors in code (should map to tokens)

| File | Hardcoded values | Should use |
|---|---|---|
| `time-picker.tsx` | `#008D63`, `#EAE7E1`, `#707973`, `#C1E9FB`, `#244C5B`, `#D3F4E1`, `#005138` | `--color-primary`, `--color-muted`, `--color-border-strong`, `--color-info-subtle`, `--color-info`, `--color-primary-subtle`, `--color-accent-foreground` |
| `academic-record-card.tsx` | `#404943`, `#008D63`, `#8DD5B2`, `#D3F4E1`, `#ffdbcf`, `#72351f` | `--color-content-muted`, `--color-primary`, `--color-primary-200`, `--color-primary-subtle`, `--color-warning-50`, `--color-warning-700` |
| `stats-dialogs.tsx` | `#25D366`, `#2AABEE`, `#1877F2`, Instagram gradient, Google brand colors | Social brand colors — keep as-is or create `--color-social-*` tokens |
| `social-links-row.tsx` | `#2AABEE`, `#25D366`, Instagram gradient | Social brand colors — keep as-is or create tokens |
| `auth-shell.tsx` | `#fafaf7`, `#171d19`, `#72351F`, `#003825`, `#073543` | `--color-auth-panel`, `--color-surface-dark`, `--color-warning-700`, `--color-primary-700`, `--color-info-800` |
| `search-result-card.tsx` | `#FFC107`, `#707973` | Create `--color-rating-star` token; use `--color-neutral-600` |
| `content-card.tsx` | `#FAFAF5`, `rgba(0,0,0,0.35)` | `--color-neutral-white`, add overlay token |
| `login-form.tsx` | `#0b57d0` | Use `--color-info` or create `--color-link` |
| `session-management-form.tsx` | `#E3E0DA` | Create `--color-table-header` or use existing neutral |
| `badge.tsx` | `#005138` | Use `--color-accent-foreground` |
| `notifications-panel.tsx` | `#E0E0E0`, `#BDBDBD` | Use `--color-border` tokens |
| `user-profile-menu.tsx` | `#BFC9C1` | Use `--color-border` |
| `education-records-section.tsx` | `#171D19`, `#8DD5B2`, `#DBD8D1`, `#F8F8F0` | Use semantic tokens from globals.css |
| `visibility-field.tsx` | `#8DD5B2`, `#404943` | Use `--color-primary-200`, `--color-content-muted` |

## Status color map (SRS statuses)

One map for every service, so the same state always looks the same. **Proposal — confirm before use.**

| Tone | Token | Statuses |
|---|---|---|
| Positive | `success` | published, approved, active, registered, used-successfully |
| Waiting | `warning` | draft-submitted, pending publish, pending approval, pending edit approval, objection filed |
| Negative | `error` | rejected, suspended, cancelled, reported |
| Neutral | `text-secondary` on `bg-subtle` | unpublished, ended, archived, held (past event) |
| Removed | `text-muted` on `bg-subtle` + restore action | deleted (restorable) |
| In progress | `info` | processing payment, awaiting gateway |

`StatusBadge` takes a domain status and resolves tone through this map; screens never pick colors for statuses.

## Typography

M3 type scale is in `globals.css` (`text-display-large` … `text-label-small`, each with line-height).
Weights by convention: headings `font-bold`, titles/labels/buttons `font-medium`, body `font-normal`.
New UI uses these tokens, not `text-[28px]` / `text-[32px]`.

Font family: **IRANSansX VF** — variable font with weight range 100–900.  
Font stack: `var(--font-iran-sans), ui-sans-serif, system-ui, sans-serif` (defined in `@theme`).

Persian font with a fallback stack; line heights generous enough for Persian diacritics; Latin digits vs Persian
digits per the formatting util (`lib/jalali.ts` `toFaDigits`, `formatFaNumber`).

## Spacing, radius, elevation, breakpoints, z-index

| Scale | Tokens |
|---|---|
| Spacing | Tailwind 4-px base: `gap-1` (4px), `gap-2` (8px), `gap-3` (12px), `gap-4` (16px), `gap-6` (24px), etc. |
| Radius | M3: `rounded-extra-small` (4) … `rounded-extra-large` (28); `--radius: 0.5rem` remains the shadcn base |
| Shadow | `--shadow-app-elevation-1` through `--shadow-app-elevation-4` (Material 3 style); utility classes `shadow-app-elevation-1` … `shadow-app-elevation-4` |
| Breakpoints | Tailwind defaults + custom inline: `min-[720px]`, `min-[834px]`; standard `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px) |
| z-index | TBD (no explicit scale in globals.css — uses Tailwind defaults inline) |

## Dark mode

**In scope.** Components use semantic tokens only (they flip under `.dark`). Theme toggle is on desktop and mobile.
Do not add `dark:` color overrides except where a role does not exist yet.

## Icons

- **Primary icon library:** `lucide-react` (throughout `apps/usr`).
- **Custom icons:** `apps/usr/src/components/icons/material-icons.tsx` — inline SVG components wrapping Material Design icon paths (`FilterAltIcon`, `SortIcon`, `CheckIcon`, `ChipCheckIcon`).
- Directional icons (arrow, chevron, back/forward, send) mirror in RTL; others never mirror.
- Icon-only buttons: use `Button` with `size="icon"` and provide `aria-label`. No dedicated `IconButton` component exists.

## Component inventory

Status: ✅ exists and conforms · ⚠️ exists but needs consolidation · ❌ missing. Fill "Path" and "Status" from the
audit; the "SRS usage" column shows why each is needed.

### Primitives

| Component | Purpose | SRS usage | Path | Status |
|---|---|---|---|---|
| `Button` | Actions; variants primary/secondary/ghost/danger; sizes; loading | everywhere | `components/ui/button.tsx` | ✅ |
| `IconButton` | Icon-only actions | row actions, toolbars | (use `Button` with `size="icon"`) | ⚠️ no dedicated component |
| `Input` | Text fields | forms, search | `components/ui/input.tsx` | ✅ |
| `OutlinedField` | Labeled input with floating label | forms | `components/ui/outlined-field.tsx` | ⚠️ |
| `FloatingInput` | Another floating label input | forms | `components/ui/floating-input.tsx` | ⚠️ near-dup of OutlinedField |
| `UnderlineField` | Third field variant | forms | `components/ui/underline-field.tsx` | ⚠️ near-dup of OutlinedField |
| `SearchField` | Pill search input | search (≤ 50 chars) | `components/ui/search-field.tsx` | ✅ |
| `Select`, `Combobox` | Choice fields | filters, category picker | — | ❌ |
| `Checkbox`, `Radio`, `Switch` | Toggles | filters, settings | — | ❌ |
| `DatePicker` | Jalali date picker | events, reports | `components/ui/jalali-date-picker.tsx` | ✅ |
| `DateRangePicker` | Jalali date range | reports | — | ❌ |
| `FileUploader` | Format/size/dimension checks, preview | images, PDF, xlsx | `components/ui/upload-button.tsx` + feature `documents-panel.tsx` | ⚠️ |
| `RichTextEditor` / `RichTextView` | Editing + sanitized display | news, newsletters, events | — | ❌ |
| `Avatar` | User avatar | profiles | `components/ui/avatar.tsx` | ✅ |
| `Badge` | Counts (+99), tags | messaging, lists | `components/ui/badge.tsx` | ✅ |
| `StatusBadge` | Status with tone | lists | — | ❌ |
| `Tabs` | Tabbed UI | detail pages | `components/ui/tabs.tsx` | ✅ |
| `Accordion` | Collapsible sections | detail pages | `components/ui/accordion.tsx` | ✅ |
| `Popover` | Popover menus | row menus | `components/ui/popover.tsx` | ✅ |
| `Tooltip` | Tooltips | hints | — | ❌ |
| `DropdownMenu` | Dropdown menus | row menus | — | ❌ |
| `Dialog` | Modal dialogs | moderation actions | `components/ui/dialog.tsx` | ⚠️ |
| `AppDialog` | App-styled modal | moderation actions | `components/ui/app-dialog.tsx` | ⚠️ near-dup of Dialog |
| `AlertDialog` | Confirm dialogs | destructive actions | `components/ui/alert-dialog.tsx` | ✅ |
| `Drawer` | Slide-in panel | filters, mobile menus | — | ❌ |
| `Toast` | Feedback | SRS success/error texts | — | ❌ (no sonner/react-hot-toast) |
| `Spinner` | Loading spinner | all screens | `components/ui/spinner.tsx` | ✅ |
| `CircularProgress` | Circular progress | loading | `components/ui/circular-progress.tsx` | ✅ |
| `Progress` | Progress bar | loading | `components/ui/progress.tsx` | ✅ |
| `Skeleton` | Loading skeleton | all screens | — | ❌ |
| `Table` | Data tables | lists | `components/ui/table.tsx` | ✅ |
| `Card` | Card surfaces | panels | `components/ui/card.tsx` | ✅ |
| `Toggle`, `ToggleGroup` | Toggle buttons | filters | `components/ui/toggle.tsx`, `toggle-group.tsx` | ✅ |

### States

| Component | Purpose | Path | Status |
|---|---|---|---|
| `EmptyState` | No data (SRS text when given) | `components/panel/empty-state.tsx` | ✅ |
| `NoResultState` | Search/filter returned nothing | — | ❌ |
| `ErrorState` | Load failure with retry | — | ❌ (no `error.tsx` in app) |
| `NoPermissionState` | 403 / capability missing | — | ❌ |
| `GuestPromptState` | Guest tried an interactive action | — | ❌ |
| `FormErrorBanner` | Form-level/server errors above actions | inline `role="alert"` divs | ⚠️ not abstracted |
| `PanelLoadingOverlay` | Full-page loading | `components/panel/panel-loading-overlay.tsx` | ✅ |

### Patterns (shared across services)

| Component | Purpose | Services | Path | Status |
|---|---|---|---|---|
| `ListShell` | Toolbar + table/cards + pagination/infinite | all | feature `page-shell.tsx` files | ⚠️ per-feature |
| `DataTable` / `CardList` | Rows with responsive collapse | all panels | `notifications/components/inbox/table.tsx`, `card-list.tsx` | ⚠️ per-feature |
| `RowActionsMenu` | Actions from status × capability | all panels | — | ❌ |
| `ReasonPickerModal` | Reject / cancel / suspend / unpublish with reason | Dsc, Nws, Nwl, Cln | — | ❌ |
| `ApprovalDiffView` | Field-level approve/reject with replacement value | Dsc (Nws, Nwl) | — | ❌ |
| `CategoryManager` | Main/sub categories CRUD + restore | Dsc, Nws, Nwl, Cln | — | ❌ |
| `ReasonListManager` | Reason lists CRUD + restore | Dsc, Nws, Nwl, Cln | — | ❌ |
| `CategoryPicker` | Main → sub select | create/edit forms | notifications filter has category picker | ⚠️ |
| `SoftDeleteBanner` / restore action | Deleted-but-restorable display | all | — | ❌ |
| `ArchiveToggle` / archived tab | Archive views | all | — | ❌ |
| `ReportLayout`, `StatCard`, `ChartCard` | Reports, statistics, charts | all | `notifications/stats/`, `charts/` (recharts) | ⚠️ per-feature |
| `ServiceHome` blocks | Service landing: hero, featured list | SRV, all | `home/components/` | ⚠️ home-specific |
| `ProductCard`, `NewsCard`, `NewsletterCard`, `EventCard` | Content cards | Dsc, Nws, Nwl, Cln | `home/components/content-card.tsx`, `public-panel/catalog/*-card.tsx` | ⚠️ |
| `VoucherView` / `ReceiptView` | Discount voucher and receipt display | Dsc | — | ❌ |
| `ConversationList`, `MessageBubble`, `Composer` | Messaging | Msg | `public-panel/components/comments/` (prototype) | ⚠️ UI-only |
| `NotificationItem` | Notification rendering | platform | `notifications/components/inbox/notification-row.tsx` | ✅ |
| `ShareLink` | Copy / share referral link | Rfl | — | ❌ |
| `PaymentMethodPicker` | Free / wallet / gateway | Cln, Dsc | — | ❌ |
| `ProfileHeroCard` | Profile header card | panels | `components/panel/profile-hero-card.tsx` | ✅ |
| `SiteHeader` | Global navigation | site | `components/site/site-header.tsx` | ✅ (large: 676 lines) |
| `SiteShell` | Layout wrapper | site | `components/site/site-shell.tsx` | ✅ |
| `AuthShell` | Auth layout wrapper | auth | `components/auth/auth-shell.tsx` | ✅ |

### Near-duplicate components (consolidation needed)

| Pair | Issue | Recommendation |
|---|---|---|
| `dialog.tsx` vs `app-dialog.tsx` | Both provide modal dialogs | Keep one, migrate call sites |
| `outlined-field.tsx` vs `floating-input.tsx` vs `underline-field.tsx` | Three field variants | Consolidate to one configurable component |

## Consolidation plan

1. **Inventory** — fill the tables above from the codebase (Cursor prompt in the repo handover).
2. **Tokens** — map every hardcoded value found to a token; add missing tokens only after confirmation.
3. **Duplicates** — for each near-duplicate component pair, choose the survivor, list call sites, migrate, delete.
4. **Status map** — confirm the tone table above; implement `StatusBadge` on it.
5. **UI kit** — every shared component rendered on the UI-kit route with all variants and states, RTL + mobile.
6. **Patterns** — build the pattern components once, before the first SRS service that needs them.
7. **Lock** — lint rule or review check against raw colors / `ml-`/`mr-` utilities.
