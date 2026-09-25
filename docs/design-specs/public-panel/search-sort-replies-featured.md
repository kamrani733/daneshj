---
title: "Public panel — search, sort, replies toggle, featured badge"
last_updated: "2026-09-25"
---

## Search field variant `panelComments` (`400:141415`)

- Height 48px, full width pill `rounded-full`.
- `bg-surface-container-low border border-outline-variant`.
- Placeholder: `text-body-large text-on-surface-variant`.
- Icon leading (start): Search `size-6`, inset area 48px; input padding `ps-12 pe-5`.
- Copy: `جستجوی دیدگاه‌های ثبت شده`.

## Sort menu (`400:143264` overlay + control bar button pattern)

- Trigger: native `<select>` h-12, rounded-full, border `outline-variant`, icon start, `text-label-large text-on-surface-variant`.
- Options (fa): تاریخ ثبت دیدگاه (پیش‌فرض)، تعداد پسندیدن، تعداد نپسندیدن، تعداد پاسخ.

## Replies toggle (`400:141436` thread)

- Pill h-9, border `outline-variant`, `text-label-large text-on-surface-variant`.
- Chevron rotates when expanded.

## Featured badge (`400:141432` pinned header)

- `text-label-medium font-bold text-featured` + filled star `size-3.5 fill-featured`.
