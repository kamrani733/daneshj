---
title: Service contact grid — public panel
last_updated: 2026-09-25
---

# Service contact grid — node 400:139509 · grid 400:139510

Section title + wrapped row of contact icon buttons above catalog tabs.

## Texts

- Section title: `publicPanel.serviceInfo` («اطلاعات سرویس دهندگی»)
- Icon `aria-label`: `panel.social.<network>`

## Layout (desktop)

- Section: `flex flex-col items-center gap-6` (24px)
- Title: centered `SectionTitle`
- Grid: two rows (`layout="serviceGrid"`) — row 1: six social icons; row 2: four (github · mobile · phone · website), each row `flex-nowrap justify-center gap-4` (16px vertical between rows)
- Button: 56×56 (`size-14`), circular, `variant="filled"` → `bg-primary` + white icon mask

## Networks (order)

1. email · telegram · instagram · x · whatsapp · linkedin  
2. github · mobile · phone · website  

Hero card keeps row 1 only; service grid shows all present links in this order.

## Tokens

- Filled circle: `primary` / `primary-foreground`
- Popover open: per-network brand tint (`SocialLinksRow` `BRAND_STYLES`)

## Components

- **Reuse:** `SectionTitle`, `SocialLinksRow` (`size="lg"`, `variant="filled"`, `layout="serviceGrid"`)
- **Data:** `PANEL_SERVICE_SOCIAL_NETWORKS` + Actor `contact_info_*` (`git_link`, `mobile`, `landline_phone`, …)

## States shown in Figma

- Default: all icons primary-filled (`400:139510`)
- Popover: copy pill (existing `SocialLinksRow` behavior)

## Mobile

- Same wrap grid; gap and 56px targets unchanged in spec cache.
