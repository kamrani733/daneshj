---
title: "Public panel — comment composer"
last_updated: "2026-09-25"
---

| State | Node |
|---|---|
| Collapsed | `400:139556` |
| Focused / empty | `400:141399` (in frame `400:141276`) |
| Typing / counter | `400:141567` (in frame `400:141444`) |

## Collapsed

- Row gap 16px with avatar (feature wrapper, not in shared component).
- Field: min-h 56px, p 12px, `rounded-medium bg-on-primary border border-outline-variant shadow-app-elevation-2`.
- Placeholder: `text-label-medium text-outline`.

## Expanded

- min-h 120px, border `primary`, same fill.
- Counter bottom-end: `text-label-small text-outline` — `{count} از {max}` (max 1500).
- Actions row gap 8px: filled primary «ارسال» (disabled when empty), text «انصراف».

## Tokens

- No hex; use M3 roles only.
