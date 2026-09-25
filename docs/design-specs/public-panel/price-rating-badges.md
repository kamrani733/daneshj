---
title: "Public panel — price, rating, time & view badges"
last_updated: "2026-09-25"
---

## Price display (`400:141367` ProductDiscountCard)

- Row `justify-between`, full width.
- Final: `text-lg font-bold text-primary` (۸۴,۰۰۰ تومان).
- Original: `text-label-medium text-outline line-through` (۱۲۰,۰۰۰ تومان).
- Optional `layout="row" | "stack"` — catalog uses **row**.

## Rating stars (`400:141377` News card Rate)

- Order (RTL): star icon → bold rating (`text-title-small font-bold text-on-surface-variant`) → review count `text-label-small text-on-surface-variant` e.g. `(۱۳۲ نظر)`.
- Star fill: `text-rating fill-rating`.

## Badge `time` (`400:141367` PurchaseChip)

- Pill `h-8 rounded-full bg-primary-container shadow-app-elevation-1`.
- Padding `ps-2 pe-2.5 py-2`, gap 1.
- Icon: clock `size-4 text-primary`.
- Text: `text-label-small font-medium text-primary`.

## Badge `viewcount` (`400:141377` view chip)

- Pill `h-8 rounded-full bg-secondary-container shadow-app-elevation-1`.
- Padding `ps-2 pe-3 py-1.5`, gap 2.
- Icon: eye `size-[18px] text-on-secondary-container`.
- Text: `text-label-large font-medium text-on-secondary-container`.
