---
title: "Design audit — apps/usr"
description: "Read-only inventory of colors, typography, spacing, icons, forms, dark mode, dialogs"
category: "audit"
last_updated: "2026-09-25"
---

# Design audit — `apps/usr`

Read-only scan of `apps/usr/src` (+ `globals.css`). Method: ripgrep + scripted class/token counts on 2026-09-25.

---

## 1. Colors

### 1.1 Design tokens (`apps/usr/src/app/globals.css`)

**Primitives** (fixed in `@theme`, unchanged in `.dark`): green, primary, info, error, warning, neutral scales (~70 hex values).

**Semantics** (flip in `.dark`): `--color-background`, `--color-foreground`, `--color-surface`, `--color-primary`, `--color-border`, `--color-error`, `--color-warning`, `--color-info`, `--color-muted`, card/popover/destructive, etc.

**App / auth / chart aliases** (flip in `.dark`): e.g. `--color-app-scene`, `--color-app-header`, `--color-app-search-fill`, `--color-app-filter-*`, `--color-auth-*`, `--color-chart-series-a|b`, `--color-theme-toggle-*`, `--shadow-app-elevation-1` … `4`.

**Overlay:** modal backdrops use `bg-black/10` on Radix overlays, not `--color-overlay` (token absent).

### 1.2 Semantic & scale utility classes (TSX, top usage)

These map to `@theme` and are the **intended** styling path.

| Utility (sample) | Count | Typical role | Maps to token |
|------------------|------:|--------------|----------------|
| `text-primary` | 253 | Links, actions, accents | `--color-primary` |
| `text-app-filter-muted` | 155 | Secondary copy on filter surfaces | `--color-app-filter-muted` |
| `text-app-filter-ink` | 133 | Primary copy on filter surfaces | `--color-app-filter-ink` |
| `text-content` | 126 | Body on panels | `--color-content` |
| `bg-primary` | 113 | Buttons, fills | `--color-primary` |
| `bg-app-search-category` | 81 | Menus, dropdown surfaces | `--color-app-search-category` |
| `border-border` | 66 | Default borders | `--color-border` |
| `bg-app-search-fill` | 61 | Dialog shells, inputs | `--color-app-search-fill` |
| `bg-app-card` | 46 | Cards on home | `--color-app-card` |
| `text-warning` / `bg-warning` | 42 / 33 | Warning states | `--color-warning` |
| `text-error` / `border-error` | 34 / … | Errors | `--color-error` |
| `bg-app-stat-card` | 25 | KPI cards | `--color-app-stat-card` |

### 1.3 Default Tailwind palette classes (non–design-system scales)

`@theme` redefines `green-*` and `neutral-*`; usages still say `text-neutral-600` etc.

| Class | Count | Role | Token equivalent (if any) |
|-------|------:|------|---------------------------|
| `text-neutral-600` | 56 | Muted body (notifications inbox/reports, comments) | `--color-neutral-600` / `--color-content-muted` |
| `text-green-700` | 14 | Accent text | `--color-green-700` |
| `border-neutral-300` | 5 | Borders | `--color-neutral-300` |
| `border-green-400` | 4 | Borders | `--color-green-400` |
| `bg-neutral-100` / `200` / `600` / `800` | 3–3 | Surfaces, sheet handle | neutral scale |
| `bg-green-500` / `600` | 2 each | Accents | primary/green scale |
| Other (`text-sky-100`, `bg-sky-900/60`, opacity variants) | ≤2 each | One-offs | — |

### 1.4 Hardcoded hex / rgb in TSX (grouped)

Counts are **literal occurrences** in `.ts`/`.tsx` (case-normalized). Figma IDs like `#956` in comments excluded from product colors.

| Group / value | ≈Count | Role | Existing token | Example files |
|---------------|-------:|------|----------------|---------------|
| **Brand green** `#008d63` | 12+ | SVG stroke/fill, text | `--color-primary` | `notifications/.../time-picker.tsx`, `academic-record-card.tsx` |
| **On-surface ink** `#171d19` | 17+ | Text, fills | `--color-foreground` / `green-850` | `education-records-section.tsx`, `auth-shell.tsx` |
| **Muted ink** `#404943` | 13+ | Text, borders | `--color-green-700` / `neutral-700` | `academic-record-card.tsx`, `visibility-field.tsx` |
| **Surface white** `#fffbff` | 11+ | Backgrounds | `--color-surface` | scattered |
| **Muted surface** `#eff1ed` | 10+ | Backgrounds | `--color-muted` | scattered |
| **Accent dark green** `#005138` | 9+ | Text on tints | `--color-accent-foreground` | `time-picker.tsx`, `badge.tsx` |
| **Border gray** `#bfc9c1` | 8+ | Borders, text | `--color-border` | `search-filter-chip.tsx`, `search-field.tsx` |
| **Content muted** `#8a938c` | 8+ | Text | `--color-content-muted` | scattered |
| **Warning peach** `#ffdbcf` / `#72351f` | 7+ each | Chips, cards | `--color-warning-subtle` / `warning-700` | `search-filter-chip.tsx`, `academic-record-card.tsx` |
| **Page/card cream** `#fafaf5` / `#fafaf7` | 8+ | bg, text | `--color-background` / `--color-app-card` / `--color-auth-panel` | `content-card.tsx`, `auth-shell.tsx` |
| **Clock face gray** `#eae7e1` | 12+ | bg (time picker) | ≈ `--color-app-carousel-inactive` (`#e3e0da`) | `time-picker.tsx` |
| **Info tint** `#c1e9fb` / `#244c5b` | 7+ | Selected time states | `--color-info-subtle` / `--color-info` | `time-picker.tsx` |
| **Primary tint** `#d3f4e1` / `#8dd5b2` | 8+ | Selection, borders | `--color-primary-subtle` / `primary-200` | `time-picker.tsx`, `visibility-field.tsx` |
| **Auth/chip gray** `#707973` | 8+ | Borders, text | `--color-auth-input-border` / `neutral-600` | `time-picker.tsx`, `search-result-card.tsx` |
| **Deep green** `#003825` / `#073543` | 6+ | Dark auth tiles | `primary-800` / `info-800` | `auth-shell.tsx` |
| **Neutral UI** `#e3e0da` | 4+ | Table/header bg | `--color-app-carousel-inactive` | `session-management-form.tsx` |
| **Rating star** `#ffc107` | 2 | Icon fill | *none* (needs token) | `search-result-card.tsx` |
| **Link blue** `#0b57d0` | 2 | Text | ≈ `--color-info` | `login-form.tsx` |
| **Social brands** `#25d366`, `#2aabee`, `#1877f2`, `#4285f4`, `#34a853`, `#fbbc04` + gradients | 10+ | Share icons | *intentional brand* | `stats-dialogs.tsx`, `social-links-row.tsx` |
| **Legacy grays** `#e0e0e0`, `#bdbdbd` | 2 | Notification UI | `--color-border` / neutral | `notifications-panel.tsx` |
| **Misc** `#062c22`, `#1a6d61`, `#f8f8f0`, `#dbd8d1` | 1–2 each | Stat card, hero, search | `--color-app-stat-card`, `--color-app-hero`, etc. | `globals.css` + one-offs |

**Tailwind arbitrary colors** `[#…]` / `[rgba(…)]` (≈45 occurrences): dominated by `time-picker.tsx` (15), `academic-record-card.tsx` (9), `education-records-section.tsx` (6), `auth-shell.tsx` (5).

**RGBA literals:** mostly shadows and auth glass in `globals.css` utilities; TSX uses e.g. `rgba(0,0,0,0.35)` on `content-card.tsx` overlay.

### 1.5 `hsl()` / `rgb()` in components

No `hsl(` in TSX. RGBA in TSX is rare (overlays); bulk is in `globals.css` auth glass utilities.

---

## 2. Typography

### 2.1 Font family

- **IRANSansX VF** via `next/font/local` → `--font-sans` / `font-sans` on `<html>` (`app/layout.tsx`).

### 2.2 Font size classes (occurrence counts)

| Size class | Count | Typical use |
|------------|------:|-------------|
| `text-sm` | 249 | Default UI: buttons, table cells, labels, dialog copy, nav |
| `text-base` | 90 | Body, inputs, menu items |
| `text-xs` | 85 | Captions, meta, chips, timestamps |
| `text-lg` | 13 | Section titles, card titles |
| `text-xl` | 8 | Subheadings |
| `text-2xl` | 8 | Page/section headings |
| `text-3xl` | 3 | Hero stats |
| `text-4xl` | 2 | Display |
| `text-[11px]` | 17 | Dense metadata (notifications, filters) |
| `text-[10px]` | 8 | Micro labels |
| `text-[28px]` | 11 | Marketing/hero lines (home, auth aside) |
| `text-[32px]` | 5 | Large display numbers |
| `text-[22px]` / `[17px]` / `[13px]` / `[12.8px]` | 2–3 each | One-off Figma matches |
| `text-[45px]` / `[57px]` / `[34px]` | 1–3 | Hero display (home) |
| `text-[0.8rem]` | 1 | Legacy sizing |
| Arbitrary **color** on `text-[#…]` | 10+ | Should be tokens (see §1.4) |

### 2.3 Weight

| Class | Count | Use |
|-------|------:|-----|
| `font-medium` | 239 | Default emphasis: buttons, labels, table headers |
| `font-bold` | 115 | Headings, stats, marketing |
| `font-semibold` | 17 | Subheads |
| `font-normal` | 8 | Long body |

### 2.4 Line height

| Class | Count | Use |
|-------|------:|-----|
| `leading-6` | 80 | Body (pairs with `text-base`) |
| `leading-5` | 85 | Compact body (`text-sm`) |
| `leading-7` | 25 | Dialog titles, list rows |
| `leading-4` | 24 | Tight captions |
| `leading-8` / `leading-9` / `leading-10` | 6–13 | Headings |
| `leading-[52px]` / `[64px]` / `[49px]` | 1–6 | Hero/display (home) |
| `leading-none` | 3 | Single-line titles |
| `leading-snug` / `leading-tight` | 2–3 | Headings |

**Patterns (by intent):**

- **Page title:** `text-2xl`/`text-xl` + `font-bold` + `leading-8` — notifications `page-heading`, panel headers.
- **Card / section title:** `text-lg`/`text-base` + `font-bold` or `font-medium`.
- **Body:** `text-sm` or `text-base` + `leading-5`/`leading-6` + `text-content` or `text-app-filter-ink`.
- **Caption / meta:** `text-xs` + `text-neutral-600` or `text-app-filter-muted`.
- **Button:** `text-sm` + `font-medium` (see `button.tsx`, `AppDialog` pills).
- **Form label:** Outlined field notched label — `text-xs`/`text-sm`; Floating label animates on `floating-input.tsx`.

---

## 3. Radius, shadows, spacing

### 3.1 Border radius (class counts)

| Value | Count | Notes |
|-------|------:|-------|
| `rounded-full` | 105 | Pills, avatars, icon buttons |
| `rounded-xl` | 55 | Default shadcn `dialog.tsx` content |
| `rounded-lg` | 26 | Cards, inputs |
| `rounded-2xl` | 25 | Panels, large cards |
| `rounded-3xl` | 13 | Promo / hero blocks |
| `rounded-[28px]` | 5 | **Figma** dialogs (`AppDialog`, time picker) |
| `rounded-[24px]` / `[20px]` / `[30px]` | 2 each | Auth/marketing |
| `rounded-[12px]` / `[8px]` / `[3px]` / `[2px]` | 3–4 | Small controls |
| `rounded-md` | 13 | shadcn defaults |
| Directional (`rounded-t`, `rounded-b`, `rounded-s`, …) | 7+ each | Sheets, menus |

Theme default: `--radius: 0.5rem` (`rounded-lg` baseline).

### 3.2 Shadows

| Class | Count |
|-------|------:|
| `shadow-app-elevation-1` … `4` (prefix `shadow-app`) | 48 |
| `shadow-none` | 43 |
| Generic `shadow` / `shadow-sm` / `shadow-md` | 15+7+2 |
| `shadow-auth-panel` | 2 |
| Arbitrary `shadow-[0…]` | 16 (split across lines in source) |

### 3.3 Spacing — arbitrary / non-scale only

Standard Tailwind spacing (`p-4`, `gap-6`, `px-6`, etc.) is used throughout; **arbitrary** values:

| Class | Count | Where |
|-------|------:|-------|
| `pb-[max(1.25rem,env(safe-area-inset-bottom))]` | 1 | `AppDialog` sheet variant |
| `pb-[max(1rem,env(safe-area-inset-bottom))]` | 1 | Mobile footers |
| `pb-[max(0.75rem,env(safe-area-inset-bottom))]` | 2 | Safe area |
| `p-[3px]` | 1 | `theme-toggle.tsx` track |
| `ms-[117px]` | 1 | Layout offset |
| `px-[30px]` … `px-[576px]` | 1 each | Auth/marketing absolute layouts (`auth-shell`, hero) |

---

## 4. Icons

| Source | Files importing | Import statements | Notes |
|--------|----------------:|------------------:|-------|
| **lucide-react** | **57** | **58** | Default icon set across app |
| **@/components/icons/material-icons** | **5** | **8** symbols used | Inline SVG, `currentColor` |

### Material icons (`material-icons.tsx`)

| Export | Screens |
|--------|---------|
| `FilterAltIcon` | Home search filter bar; notifications inbox toolbar |
| `SortIcon` | Home search sort menu |
| `CheckIcon` / `ChipCheckIcon` | Home search filter chips; home sort menu |
| (Reports toolbar imports filter/sort set) | Notifications reports toolbar |

### Lucide by area (files with ≥1 `lucide-react` import)

| Area | Files |
|------|------:|
| `components/site`, `components/panel`, `components/ui`, `components/auth` | ~25 |
| `notifications/` | 14 |
| `private-panel/` | 10 |
| `public-panel/` | 9 |
| `home/` | 3 |
| `(auth)/` | 1 (`session-management-form.tsx`) |

**Examples:** `site-header.tsx` (nav, menu), `dialog.tsx` (`X`), `outlined-field.tsx` (`Calendar`, `ChevronDown`), notifications toolbars/filters, profile stats, comments, upload/actions.

---

## 5. Form fields

| Component | Definition | JSX usage count (approx.) | Screens / features |
|-----------|------------|---------------------------:|---------------------|
| **Outlined** (`OutlinedTextField`, `OutlinedTextareaField`, `OutlinedSelectField`, `OutlinedDateField`, `OutlinedFieldShell`) | `components/ui/outlined-field.tsx` | **~35** field instances across 5 feature files | **Private panel:** profile `view-field.tsx` (dynamic fields), `visibility-field.tsx`, `review-pending-list.tsx`, `location-list-picker.tsx`, `academic-record-modal.tsx` |
| **FloatingInput** | `components/ui/floating-input.tsx` | **9** inputs | **Auth:** `auth-forms.tsx` (login, OTP, password, register flows) |
| **UnderlineField** | `components/ui/underline-field.tsx` | **3** inputs | **Home:** `home-search-filter-bar.tsx` (search + filter fields) |

No other screens use `UnderlineField` or `FloatingInput`. Auth does **not** use outlined fields; private panel does **not** use floating/underline.

---

## 6. Dark mode

### Wiring

| Piece | Location |
|-------|----------|
| `ThemeProvider` (`next-themes`, `attribute="class"`, `defaultTheme="system"`) | `app/layout.tsx` wraps entire app |
| **User control** | `ThemeToggle` in **`site-header.tsx` desktop row only** (`lg:flex`, hidden on mobile header row) |
| Token flip | `.dark { … }` in `globals.css` |

### Exposure gap

- **Auth routes** (`(auth)/layout`): no theme toggle in auth chrome.
- **Mobile site header:** compact row has menu + logo + search — **no** `ThemeToggle` (toggle only on `lg+` desktop header).

### Correct vs risky in `.dark` (by inspection)

| Area | Assessment |
|------|------------|
| **Site shell, notifications** (inbox, settings, reports, charts using `dark:` + semantic/`app-*` tokens) | Generally **OK** — heavy `dark:` usage |
| **Private / public panels** (fields, tabs, comments) | **Mostly OK** — widespread `dark:` pairs |
| **`auth-shell.tsx`** | **OK** — explicit `dark:bg-[#171d19]`, `dark:bg-[#003825]/80`, etc. |
| **`AppDialog` / alerts** | **OK** — `dark:bg-app-stat-card`, `dark:text-primary-50` |
| **Home `search-filter-chip.tsx`** | **Weak** — hardcoded light chip colors, **no** `dark:` |
| **Home `content-card.tsx`** | **Partial** — `bg-[#FAFAF5]` + overlay; limited dark handling |
| **`time-picker.tsx`** | **Partial** — many `bg-[#EAE7E1]` etc. with matching `dark:bg-*` on same nodes; dialog shell `bg-[#FAFAF5]` → `dark:bg-app-search-fill` |
| **`academic-record-card.tsx`** | **Partial** — many arbitrary light hexes; some `dark:` on borders/text |
| **`education-records-section.tsx`** | **Partial** — arbitrary hex with some `dark:` |
| **`stats-dialogs.tsx`** | **OK for app chrome**; social brand hex **unchanged** in dark (expected) |
| **`notifications-panel.tsx`** | **Partial** — `#E0E0E0` / `#BDBDBD` grays |
| **`text-neutral-600` without `dark:`** | **Risk** on a few inbox lines (`card-list.tsx` some spans) — low contrast on dark surface |

Charts (Recharts) rely on CSS variables `--color-chart-series-*` that **do** flip in `.dark`.

---

## 7. Dialogs — `dialog.tsx` vs `app-dialog.tsx`

### `components/ui/dialog.tsx` (shadcn-style Radix Dialog)

- **API:** Compound primitives — `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogOverlay`, `DialogClose`.
- **Visuals:** Centered sheet, `max-w-sm`, `rounded-xl`, `bg-popover`, `ring-foreground/10`, overlay `bg-black/10` + blur; optional ghost **X** close (`showCloseButton` default **true**).
- **Direct call sites:**
  - `academic-record-modal.tsx` — custom wide content, own title inside.
  - `notifications/settings/time-picker.tsx` — custom `rounded-[28px]`, Figma layout.
  - Wrapped internally by `app-dialog.tsx` for `content` / `sheet` variants.

### `components/ui/app-dialog.tsx` (product wrapper)

- **API:** Single `AppDialog` with `open`, `onOpenChange`, `variant`: `'confirm' | 'content' | 'sheet'`, `title`, `description`, `icon`, `primaryAction` / `secondaryAction`, `actionsStyle`, `dir` (default RTL).
- **Visuals:**
  - **`confirm`:** Uses **`AlertDialog`** (not `Dialog`) — `rounded-[28px]`, `bg-app-search-fill`, `shadow-app-elevation-2`, RTL title, pill primary / ghost secondary.
  - **`content`:** `Dialog` + `bg-app-search-fill`, max width 560px, title/desc often `sr-only`.
  - **`sheet`:** Bottom sheet, `bg-app-header`, `rounded-t-3xl`, drag handle `bg-neutral-300 dark:bg-neutral-600`.
- **Call sites (feature):** `unsaved-changes-guard.tsx`, `fields-section.tsx`, `ops-confirm-dialog.tsx`, `notifications-panel.tsx`, `session-management-form.tsx`, `notifications/.../mobile-menu.tsx`, `public-panel/.../comments/card.tsx`, `transfer-flow.tsx`, `stats-dialogs.tsx`.

**Relationship:** `AppDialog` is the **product** pattern for confirms and sheets; raw `Dialog` is for bespoke modals (time picker, academic record).

---

## Obvious inconsistencies (short list)

1. **Three form field systems** (outlined / floating / underline) tied to **different surfaces** (panel vs auth vs home) with no shared abstraction.
2. **Colors:** Large **token set in `globals.css`**, but **50+ files** still use hex or `[#…]` arbitrary utilities; `text-neutral-600` used heavily alongside semantic `text-app-filter-muted`.
3. **Two dialog stacks:** shadcn `Dialog` (`rounded-xl`, `popover`) vs Figma `AppDialog` (`rounded-[28px]`, `app-search-fill`) vs `AlertDialog` for confirms.
4. **Icons:** Mostly Lucide; **filter/sort/check** on home + notifications use **duplicate Material SVGs** instead of Lucide equivalents.
5. **Dark mode:** Implemented at token level, but **theme toggle only on desktop header**; home filter chips and some notification grays lack consistent dark pairing.
6. **Typography:** Stable **sm/base/xs** core, but **many one-off pixel font sizes** (`text-[28px]`, `[11px]`, etc.) for Figma parity.
7. **Radius:** **28px** product modals vs **12px (`rounded-xl`)** generic dialog default.
8. **Overlay:** No shared **`--color-overlay`**; overlays mix `black/10`, elevation shadows, and rgba scrims.
