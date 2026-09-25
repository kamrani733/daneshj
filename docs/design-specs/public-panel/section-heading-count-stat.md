---
title: "Public panel — section heading, count chip, stat item"
last_updated: "2026-09-25"
---

## Section heading (`section-heading.tsx`)

| Figma | Node |
|---|---|
| Comments section title | `400:139550` |
| Panel title (bar only) | `400:152657`–`400:152659` |

- Layout: inline row, gap 8px, px 8px, items center, RTL.
- Title: `text-headline-medium font-bold text-on-primary-container` (not `text-primary`).
- Accent bar (not underline): `rounded-[2px]` — **primary** tone: `h-8 w-3 bg-primary`; **secondary** tone: `h-6 w-2 bg-secondary`.
- Reuse: `SectionHeading` with `tone` prop.

## Count chip (`count-chip.tsx`)

| Figma | Node |
|---|---|
| Input chip-primary | `400:141412` |

- Pill: `rounded-full bg-primary-container px-3 py-1`.
- Text: `text-label-large font-medium text-on-primary-container`.
- Example copy: `۱۲ دیدگاه`.

## Stat item (`stat-item.tsx`)

| Figma | Node |
|---|---|
| Interaction box | `400:139505` (section — single stat cell matches pattern) |

- Column, center, gap 4px.
- Value: `text-headline-medium font-bold text-on-surface`.
- Label row: `text-label-large font-medium text-on-surface-variant`, optional Lucide icon `size-4`.

## Mobile

Same tokens; section heading centers on narrow viewports when `align="center"`.
