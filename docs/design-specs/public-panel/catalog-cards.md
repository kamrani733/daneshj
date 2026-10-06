---
title: "Public panel — catalog cards (discount, news, newsletter)"
last_updated: "2026-10-06"
---

Source: owner screenshots of the current public-panel Figma (section nodes `400:139520` / `400:139530` / `400:139539` are gone from the file). Reuse `HoverMediaCard`, `Badge` `time`/`viewcount`/`warning`, `RatingStars`.

## Shared card chrome

- `rounded-xl`, `bg-surface-container-lowest`, `shadow-app-elevation-1`.
- Image chips sit at **physical start of the photo in the screenshot = `end` in RTL** (`end-2.5 top-2.5`).
- Body `p-4`, gap 8px. Section footer: «مشاهده همه» `text-secondary font-bold`.

## Discount (`تخفیف کالا و خدمات`)

- Time chip `Badge time`: clock + «دو ساعت پیش».
- Title: business name `text-title-small font-bold text-on-surface`.
- Subtitle: product name `text-body-small text-on-surface-variant`.
- No divider, no rating on this frame.
- Row: `۳۰٪ تخفیف` (`Badge warning`) + original `text-label-medium text-outline line-through` on the start; final `text-title-semi-large font-bold text-primary` on the end.

## News (`خبر`)

- View chip `Badge viewcount`: eye + ۲۱۵. No scope / category chips / event range on the card.
- Title `text-title-small font-bold`.
- Publisher `text-label-medium text-on-surface-variant` («منتشر کننده»).
- Row: `RatingStars` (۴ · (۱۳۲ نظر)) at start, «تاریخ انتشار» at end.
- Summary `text-label-medium text-on-surface-variant`, two lines.

## Newsletter (`خبرنامه`)

- Header **above** the image: 32px avatar + «نام منتشر کننده» + date `۱۴۰۵/۱۲/۰۵`.
- View chip on the image (۲۱۵).
- Title + optional description.
- Row: `RatingStars` at start, «دوره انتشار» at end.
