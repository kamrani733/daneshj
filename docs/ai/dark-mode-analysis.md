---
title: "Dark mode analysis — designer's dark export vs Material 3"
description: "Light↔dark color pairs taken from the design exports, compared with the generated M3 dark scheme"
category: "architecture"
last_updated: "2026-09-25"
---

# Dark mode analysis

Input: `design/public-panel/dark.svg` (1512×6293, text outlined, 9 embedded photos) compared with
`Public_Panel۲۳.svg` (light, same composer state). 84 elements have identical geometry in both files, which gives
the designer's own light → dark mapping.

## Result

The dark design is the Material 3 dark scheme generated from `#008d63`, exactly. Every main dark color is an M3
role: `#0f1511` surface, `#171d19` / `#1b211d` / `#303632` surface containers, `#353b37` surface-bright,
`#dee4de` on-surface, `#bfc9c1` on-surface-variant, `#8a938c` outline, `#404943` outline-variant, `#8dd5b2` primary,
`#003825` on-primary, `#005138` / `#a9f2cd` primary container pair, `#ffb4ab` error.

## Light → dark pairs (from identical elements)

| Light | Dark | Role |
|---|---|---|
| `#008d63` | `#8dd5b2` | primary (brand green) |
| `#e06333` | `#ffb59b` | brand-secondary (brand orange); on-color in dark `#55200b` |
| `#404943` | `#bfc9c1` | on-surface-variant |
| `#707973` | `#8a938c` | outline |
| `#bfc9c1` | `#404943` | outline-variant |
| `#171d19` | `#dee4de` | on-surface |
| `#005138` | `#a9f2cd` | on-primary-container |
| `#d3f4e1` | `#005138` | primary-container |
| `#ba1a1a` | `#ffb4ab` | error |
| `#fafaf7` | `#0f1511` | surface (page) |
| `#fafaf5` | `#353b37` | surface-bright (header) |
| `#f8f8f0` | `#171d19` | surface-container-low |
| `#efede6` | `#1b211d` | surface-container |
| `#fff5eb` | `#211d18` | featured-container (featured comments) |
| `#f59e0b` | `#f59e0b` | featured star — unchanged |
| `#f66060` | `#f66060` | red action icon in comments — unchanged |

## What this settles

- **Dark mode is designed**, not an afterthought. Recommendation changes: keep dark mode, finish it on the token
  layer, and show the theme toggle on mobile too (today it is desktop-only).
- **Brand green in dark mode is `#8dd5b2`**, not `#008d63`. Current code keeps `#008d63` in dark (4.4:1 on the dark
  surface); the designer's choice gives 10.8:1.
- **Brand orange has a dark counterpart** `#ffb59b` (with `#55200b` text on it).
- Light surfaces are warm custom neutrals; their dark counterparts are the standard M3 surfaces. Tokens v2
  (`m3-tokens.css`) encode exactly this.

## Open points (confirm with the designer)

| Item | Why |
|---|---|
| `--color-rating` dark value | `#ffd393` stars do not appear in the dark export |
| `#ffdbcf` provider badge stays light in dark | Kept as-is on one element; token v2 uses the M3 dark pair instead |
| `#f66060` meaning | Same in both modes; looks like an "active like" state |
| Promo banner in dark (`#2c322e` bg, `#dce5e0` / `#b8c7bf` text) | Custom banner colors; map to inverse-on-surface / on-surface on implementation |
| Dark export is 730px shorter than light | Content differs (fewer items); layout otherwise identical — not a design difference |
| Light primary-container | Design uses `#d3f4e1`; generated M3 value is `#a9f2cd` (also present in light, 33×). Token v2 follows the design |
