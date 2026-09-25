---
title: "Public panel — comment item & thread"
last_updated: "2026-09-25"
---

## Comment item (`400:141432` Pinned comment)

- Card: `rounded-medium p-4 shadow-app-elevation-2`.
- **Featured**: `bg-featured-container border-s-[3px] border-featured`.
- **Default**: `bg-surface border border-outline-variant`.
- Header: menu (start), meta (end): featured badge, time, date, @username, display name `text-title-small font-bold`.
- Body: `text-title-small text-on-surface`.
- Divider: `border-t border-outline-variant`.
- Actions row: gap 12px, interactive chips — presentational `actions` slot.

## Comment thread (`400:141436` Group comments)

- Root list stacks items with gap.
- Replies: `padding-inline-start: 48px` (`ps-12`), optional `border-s-3 border-primary` on reply cards (transfer/deleted variants in feature layer later).
- `CommentThread`: optional `repliesToggle` between parent body and nested `replies` slot.

## Reuse

- `FeaturedBadge`, `RepliesToggle` in thread UI; `CommentItem` is presentational only (no Interactive Ops).
