---
title: "Product Overview"
description: "What Daneshjoam is, who uses it, and which services it contains"
category: "meta"
last_updated: "2026-09-25"
---

# Product Overview

## What this is

**Daneshjoam** (دانشجوام, "I am a student") is a Persian web platform that bundles services for university
students. Businesses and organisations join as service providers and offer discounts, publish newsletters and
news; admins moderate content; students consume services, register for events, message each other, earn rewards
and invite friends.

## Localization

RTL-first Persian. Numbers, codes and Latin text stay LTR inline. Jalali dates for display. ⟨FILL: is a second
locale planned? audit §6⟩

## Actors

| Actor | SRS code | Summary |
|---|---|---|
| Guest (کاربر میهمان) | — | Browses public pages; any interactive action triggers the guest-access error path |
| User / student (کاربر) | `Usr` | Uses services: vouchers, events, messaging, referrals, rewards, reporting content |
| Service provider (سرویس‌دهنده) | `ASR` | Business/organisation (natural or legal entity) that creates products, newsletters, news; sees own reports |
| Admin (راهبر) | `Adm` | Moderates and configures everything: approvals, categories, reasons, reports |
| System | `Sys` | Automatic behaviour: reward calculation, auto soft-delete of unused reasons |

Access matrix: [03-domain-and-rules.md](./03-domain-and-rules.md).

## Services in the SRS

| Code | Service | SRS status |
|---|---|---|
| SRV | General service pages (terms, help, providers, products, user services, admin approvals) | Specified, light |
| Rwd | Rewards (پاداش) | Partial; cash-out/wallet items pending decision |
| Dsc | Discounts on goods & services (products, vouchers, payment receipts) | Most detailed |
| Rfl | Invite friends | Specified |
| Msg | Messaging (conversations, messages) | Specified |
| Nws | News | Specified |
| Nwl | Newsletters | Specified |
| Cln | Calendar events (incl. registration, user suggestions) | Specified |
| — | Cashback, gift cards, courses, cross-border events, research, Patogh, jobs/internships/BID/military service | Headings only |

## Platform areas outside the SRS (already built from Figma)

Authentication, actor profiles, notifications and notification settings, operational panels, interactive
operations. ⟨FILL: exact list from audit §8 "screens with no SRS path code"⟩ These are documented from the code,
not the SRS. A separate SRS for them: TBD.

## Out of scope (current)

- Any service listed as "headings only" until specified
- Rewards cash-out / pay-to-wallet (flagged red in SRS)

## Status

[CURRENT-PROGRESS.md](./CURRENT-PROGRESS.md)
