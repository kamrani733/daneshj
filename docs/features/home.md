---
title: "Feature: Home page (صفحه اصلی)"
description: "Landing page: hero slider, intro, special services, categories, discounts, businesses, search"
category: "feature"
last_updated: "2026-10-02"
---

# Feature: Home page (صفحه اصلی)

## Summary

`/` is the public landing page (home Figma, light + dark, desktop and mobile): hero slider, intro box,
«سرویس‌های ویژه برای شما» promo slider, categories, «تخفیف‌ها» (product discount cards), «کسب و کار ها»
carousel, then the shared CTA band and footer. The category search bar under the header switches the feed to
mock search results.

## SRS coverage

| Path code | Name | Status | Files |
|---|---|---|---|
| SRV general pages (home / search) | Landing + search | UI-ONLY (mock data) | `app/(public)/home/` |

## Sections

| Section | Component | Notes |
|---|---|---|
| Hero | `home-hero-banner.tsx`, `data/hero-banner.ts` | slide 1 students artwork; slides 2–3 photos with scrim |
| Intro | `home-introduction.tsx` | — |
| Special services | `home-promo-banner.tsx` | bar heading |
| Categories | `home-categories-section.tsx` | `ScrollCarousel` from 834; phones 3-column grid «دسته بندی تخفیف‌ها» |
| Discounts | `home-discounts-section.tsx` | shared `DiscountCard`; 4×2 desktop · 2 cols tablet · scroll on phones |
| Businesses | `home-businesses-section.tsx` | shared `BusinessCard` in `ScrollCarousel` |
| Search results | `home-search-results.tsx` | shared `DiscountCard` with rating always + sell / address chips |

Section titles: `home/components/section-title.tsx` → `SectionHeading` (secondary bar, responsive size);
«مشاهده همه» in the same row (`home-carousel-section-header.tsx`).

## Data

Mock only: `data/home-content.ts` (discounts, businesses), `data/hero-banner.ts`, `data/search-mock.ts`.
Photos: `public/images/home/photos/` and `public/images/public-panel/catalog/` (Unsplash License; credits in
the data files).

## Known gaps

- Search is mock (`search-mock.ts`); no SRV search API yet.
- The category search bar is kept although the home Figma does not show it (search results depend on it).
