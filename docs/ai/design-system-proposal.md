---
title: "Design system proposal — Material Design 3"
description: "Evidence that the Figma design is M3, the proposed token set, migration map, and decisions for the owner"
category: "architecture"
last_updated: "2026-09-25"
---

# Design system proposal — Material Design 3

Status: **Proposed** — needs owner decisions (end of file). After approval, the accepted parts move into
`docs/10-design-system.md` and `globals.css`, and `10-design-system.mdc` is updated.

## 1. Finding: the design already is Material Design 3

The Figma file has no documented styles, but its values come from Material Design 3 (Material Theme Builder,
source color `#008d63`, *Tonal Spot* scheme). Verified by regenerating the scheme with
`@material/material-color-utilities` and comparing with the hardcoded values found in `design-audit.md`:

| Hardcoded in code | Count | Exact M3 role (generated from `#008d63`) |
|---|---:|---|
| `#171d19` | 17+ | light `on-surface` / dark `surface-container-low` |
| `#404943` | 13+ | light `on-surface-variant` / dark `outline-variant` |
| `#707973` | 8+ | light `outline` |
| `#bfc9c1` | 8+ | light `outline-variant` / dark `on-surface-variant` |
| `#8a938c` | 8+ | dark `outline` |
| `#005138` | 9+ | light `on-primary-container` / dark `primary-container` |
| `#8dd5b2` | 8+ | light `inverse-primary` / dark `primary` |
| `#c1e9fb` / `#244c5b` | 7+ | `tertiary-container` / `on-tertiary-container` |
| `#003825` / `#073543` | 6+ | dark `on-primary` / dark `on-tertiary` |
| `#ffdbcf` / `#72351f` | 7+ each | M3 custom color group (hue 37, chroma 36): container tone 90 / on-container tone 30 |

The type sizes confirm it: `57/64`, `45/52`, `28px`, `32px`, `22px`, `11px` in the code are the M3 type scale
exactly. `rounded-[28px]` dialogs are the M3 extra-large corner. Outlined and floating-label fields are the two
M3 text-field types. The `app-elevation-1…4` shadows are M3 elevation levels.

Remaining non-M3 values (`#fffbff`, `#fafaf5`, `#eae7e1`, `#e3e0da`, `#d3f4e1`) are warm neutrals / leftovers from
the M3 kit defaults; they map to existing `app-*` tokens or to M3 surface roles (table §4).

**Consequence:** we don't need to invent a design system. We adopt M3 officially — its color roles, type scale,
shape scale and elevation — and every future screen from Figma will already match it.

## 2. Token set

Ready-to-paste additive block: [`m3-tokens.css`](./m3-tokens.css) (light + dark). It adds, without redefining any
existing token:

- **Color roles**: `on-surface`, `on-surface-variant`, `outline`, `outline-variant`, `surface-container-*`,
  `primary-container`, `on-primary-container`, `secondary-*`, `tertiary-*`, `error-container`, `inverse-*`,
  `warning-container`, `on-warning-container`, `overlay`, `rating`. Names that already exist in the app
  (`primary`, `surface`, `error`, `secondary`, `warning`) get an `md-` prefix for the M3 value.
- **Type scale**: `text-display-large` … `text-label-small` (15 styles, size + line height).
- **Shape**: `rounded-extra-small` (4) · `small` (8) · `medium` (12) · `large` (16) · `large-increased` (20) ·
  `extra-large` (28) · `full`.
- **Elevation**: keep `shadow-app-elevation-1…4` (already M3 levels).
- **Brand**: `--color-primary` stays `#008d63` (see decision D2).

## 3. Typography map (current → M3)

Weights stay as today by convention: headings `font-bold`, titles/labels/buttons `font-medium`, body `font-normal`.

| Current | Count | M3 token | Note |
|---|---:|---|---|
| `text-sm leading-5` | 249 | `text-body-medium` / `text-label-large` (buttons) / `text-title-small` | exact |
| `text-base leading-6` | 90 | `text-body-large` / `text-title-medium` | exact |
| `text-xs leading-4` | 85 | `text-body-small` / `text-label-medium` | exact |
| `text-[11px]` | 17 | `text-label-small` | exact |
| `text-[10px]` | 8 | `text-label-small` | 10px is below M3 minimum → becomes 11px (check in Figma) |
| `text-[22px]` | 2–3 | `text-title-large` | exact |
| `text-lg` (18) | 13 | `text-title-large` (22) or `text-title-medium` (16) | **no M3 18px** — check Figma per case |
| `text-xl` (20) | 8 | `text-title-large` (22) | check Figma |
| `text-2xl` (24) | 8 | `text-headline-small` | exact |
| `text-[28px]` | 11 | `text-headline-medium` | exact |
| `text-3xl` (30) / `text-[32px]` | 3 / 5 | `text-headline-large` | 30 → 32 |
| `text-[34px]` / `text-4xl` (36) | 1–3 | `text-display-small` | |
| `text-[45px]` / `text-[57px]` | 1–3 | `text-display-medium` / `text-display-large` | exact |
| `text-[17px]`, `[13px]`, `[12.8px]`, `[0.8rem]` | 1–3 | nearest token | one-offs, check Figma |

## 4. Color map (hardcoded → token)

| Hardcoded | Use token |
|---|---|
| `#008d63` | `primary` (existing) |
| `#171d19` | `on-surface` (text) · `foreground` (existing, if equal) |
| `#404943` | `on-surface-variant` |
| `#707973` | `outline` |
| `#bfc9c1` | `outline-variant` (borders) |
| `#8a938c` | dark mode only → handled by `outline` flipping; in light code use `on-surface-variant` |
| `#005138` | `on-primary-container` |
| `#8dd5b2` | `inverse-primary` (light) — in dark it is `md-primary` |
| `#d3f4e1` | `secondary-container` (`#cfe9d9`) — near match, confirm visually |
| `#c1e9fb` / `#244c5b` | `tertiary-container` / `on-tertiary-container` |
| `#003825` / `#073543` | dark-only values → replace `dark:bg-[#…]` with the role that flips |
| `#ffdbcf` / `#72351f` | `warning-container` / `on-warning-container` |
| `#fffbff` | `surface-container-lowest` |
| `#eff1ed` | `muted` (existing) or `surface-container-low` |
| `#fafaf5` / `#fafaf7` | `app-card` / `background` (existing app tokens) |
| `#eae7e1`, `#e3e0da`, `#dbd8d1` | `app-carousel-inactive` (existing) — one token for all three |
| `#e0e0e0`, `#bdbdbd` | `outline-variant` / `outline` |
| `#0b57d0` | `tertiary` or `info` (existing) — link color, confirm |
| `#ffc107` | `rating` (new) |
| Social brand colors (`#25d366`, `#1877f2`, …) | **exception** — allowed only inside `social-links-row` / share components |
| `bg-black/10` overlays, `rgba(0,0,0,0.35)` | `overlay` (new, M3 scrim 32%) |
| `text-neutral-600` (56) | `on-surface-variant` |

## 5. Shape map

| Current | M3 token |
|---|---|
| `rounded-full` | `rounded-full` (keep) |
| `rounded-[28px]`, `rounded-3xl` (24), `[24px]`, `[30px]` | `rounded-extra-large` (28) — dialogs, sheets, hero blocks |
| `rounded-2xl` (16) | `rounded-large` — cards, panels |
| `[20px]` | `rounded-large-increased` |
| `rounded-xl` (12), `[12px]` | `rounded-medium` |
| `rounded-lg`, `[8px]`, `rounded-md` | `rounded-small` — inputs, small cards |
| `[3px]`, `[2px]` | `rounded-extra-small` |

## 6. Components aligned with M3

| M3 component | Today | Proposal |
|---|---|---|
| Text field (outlined) | `outlined-field.tsx` (private panel) | `TextField variant="outlined"` |
| Text field (filled, underline indicator) | `underline-field.tsx` (home), `floating-input.tsx` (auth) | `TextField variant="filled"` — floating label is behaviour, not a separate component. Check in Figma whether auth fields are filled or outlined |
| Basic dialog (28px) | `AppDialog` confirm/content | **Survivor.** `dialog.tsx` becomes an internal primitive used only by `AppDialog`; `academic-record-modal` and `time-picker` move to `AppDialog variant="content"` on touch |
| Bottom sheet | `AppDialog variant="sheet"` | keep |
| Chips (filter) | `search-filter-chip.tsx` (hardcoded colors, no dark) | rebuild on `secondary-container` / `outline` roles |
| Buttons (filled / tonal / outlined / text) | `button.tsx` variants | map variants to M3 names in docs; no visual change |
| Icons | Material Symbols in Figma (M3 default) vs Lucide in code | decision D3 |

## 7. Accessibility finding

`#008d63` is used as **text** 253 times (`text-primary`). Its contrast is **4.0:1** on the light page background and
**4.2:1** with white text on it — below WCAG AA (4.5:1) for normal-size text. M3's own primary for this seed
(`#206a4e`) or `on-primary-container` (`#005138`) pass comfortably. In dark mode `#008d63` on the dark surface is
4.4:1, while M3's dark primary `#8dd5b2` is 10.8:1. See decision D2.

## 8. Decisions for the owner

| # | Decision | Recommendation |
|---|---|---|
| D1 | Adopt Material Design 3 as the official design system (roles, type scale, shape, elevation) | **Yes** — it is what the designer already used |
| D2 | Brand color for small text and dark mode | Keep `#008d63` for fills, buttons and large text. Use `on-primary-container` (`#005138`) or M3 `md-primary` (`#206a4e`) for small link/text; use `#8dd5b2` as primary in dark mode. Needs designer/owner OK because it changes how `text-primary` looks |
| D3 | Icon library | Check the Figma: if icons are Material Symbols (M3 default), move to Material Symbols via one `Icon` wrapper component, migrating on touch. If Figma icons are generic, keep Lucide. Either way, introduce the `Icon` wrapper so the choice lives in one file |
| D4 | Dark mode | Now cheap: M3 generates the dark scheme and roles flip automatically. Options: (a) keep it, add the toggle to mobile, fix the few "weak/partial" screens; (b) lock light and hide the toggle until a designer reviews dark. Recommendation: (b) now, (a) after the color migration |
| D5 | Ambiguous sizes (`text-lg`, `text-xl`, `rounded-3xl`) | Resolve per screen against Figma during migration; default to the nearest M3 token |

## 9. Migration plan (after approval)

1. Paste `m3-tokens.css` into `globals.css` (additive). No visual change.
2. Add a `/dev/ui-kit` page showing roles, type scale and shapes in light/dark.
3. Mechanical sweep: replace hardcoded hex and arbitrary sizes/radii using §3–§5. Visual diff per screen.
4. Components: `TextField` (outlined/filled), `AppDialog` survivor, filter chip on roles, `Icon` wrapper.
5. Update `docs/10-design-system.md` and `10-design-system.mdc` to reference M3 roles; add a lint check against
   `[#`, `text-[`, `rounded-[` in TSX.
