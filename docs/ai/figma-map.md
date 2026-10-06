---
title: "Figma map — public panel file"
description: "What each frame in the Figma file is, with node IDs, read via the Figma MCP"
category: "architecture"
last_updated: "2026-10-07"
---

# Figma map — public panel

File: https://www.figma.com/design/aKH5AZkwgcEfmh96gHTTWE/Untitled (one page, `0:1`). Link a node as
`…/Untitled?node-id=400-139432` (replace `:` with `-`). Groups come from the designer's annotation labels.

## Design system in Figma (libraries, not local)

The file uses **remote libraries** — no local variables or styles:
- `1Material 3 Design Kit RTL Persian-using` (collection `M3`) — main kit
- `M3 Design Kit RTL Persian admin` — admin kit
- `STU - Authentication`, `STU - Discount` (collection `material-theme`) — per-service libraries

Variable names are M3: `Schemes/Primary`, `Schemes/Secondary`, `Schemes/Surface Container Low`, … Text styles are
`M3/title/medium`, `M3/label/large-emphasized`, `M3/headline/Medium-Bold`, … Font family **IRANSansXFaNum**.
Values: `docs/ai/m3-tokens.css` v3.

## Frames by group

| Group (designer label) | Frames (node IDs) | Notes |
|---|---|---|
| پنل عمومی — سرویس‌دهنده انفرادی (individual provider) | `400:139432`, `400:139762` (row 1) · `400:139600`, `400:139930` (row 2) | main design; row 2 = variants (check owner vs visitor) |
| same, dark | `400:152711`, `400:153045` | height 6293 |
| پنل عمومی — غیر سرویس‌دهنده انفرادی (non-provider) | `400:140092`, `400:140219` | shorter page: no provider sections |
| پنل عمومی — از دید کاربر میهمان (guest; owner left «درباره من» empty) | `400:140940` · dark `400:153206`, `400:152884` | guest view |
| عملیات ثبت دیدگاه (composer) | `400:141108`, `400:141276`, `400:141444` | the 3 composer states |
| انتقال دیدگاه به پنل عمومی (transfer) | `400:142835` + quote dialogs `400:143004`, `400:143016`, `400:143061`, overlays `400:143029`, `400:143030` | |
| فرایند انتقال دیدگاه (transfer flow) | `400:141644`, `400:141858`, `400:142026`, `400:141813` (Discount card), overlays `400:143031`, `400:143032`, dialog `400:143074` | step by step |
| حذف و بازیابی دیدگاه (delete & restore) | `400:142331`, `400:142667`, `400:142499` + basic dialogs `400:143108`…`400:143111` | |
| برگزیدن یک دیدگاه (feature a comment) | `400:140346`, `400:140544`, `400:140742` | |
| Empty states | `400:142206` | |
| ورژن موبایل و تبلت (mobile & tablet) | mobile `400:152066` (393 wide) · tablet? `400:152184` (834 wide, named «Notifications» — confirm) · mobile dialogs `400:152228` be-liked, `400:152233` following, `400:152238` liked, `400:152243` follow, `400:152359` sharing, `400:152389` sorting | mobile exists — do not invent a mobile layout |
| Desktop dialogs & overlays | liked `400:143292`, disliked `400:143280`, follow `400:143304`, following `400:143538`, sharing `400:143550`, sorting `400:143264`, comment menus `400:143170`, `400:143241` (+ second row `400:143298`, `400:143286`, `400:143421`, `400:143544`, `400:143584`, `400:143272`, `400:143194`, `400:143218`) | row at y≈48k likely the dark versions — confirm |
| دیدگاه‌ها — کاربر / ویژه راهبر (comments system, user & admin) | `400:152398` (Comment), `400:151458` (General Comments) | admin comment management — out of this rebuild |
| Components | section `400:143618` «Assests & components», `400:152670` provider info, `400:152662` Recent Cards, `400:152630` panel title (component) | |

## How to use

- Read texts, sizes and spacing with `get_design_context` on the frame or a child node; do not guess from exports.
- For each implemented state, cite the node ID in the plan and in the PR description.

## Section node index (use these, never the whole frame or page)

Desktop main frame `400:139432` (individual provider, light):

| Section | Node | Size |
|---|---|---|
| Header (shared) | `400:139433` Top Navigation Bar | 1512×88 |
| Page title + breadcrumb | `400:139501` panel title | 1322×136 |
| Profile hero | `400:139504` main top frame | 1322×358 |
| Stats / interaction box | `400:139505` Ineraction box | 1312×157 |
| Promo banner | `400:139506` Banner | 1322×240 |
| Academic records accordion | `400:139507` Academic records | 1312×76 |
| Provider info title | `400:139509` title | 317×40 |
| Contact grid | `400:139510` Provider social media | 1512×238 |
| Tabs | `400:139513` tabs | 453×48 |
| «محصولات من» title | `400:139518` title | 190×40 |
| Discount cards | `400:139520` Discount | 1312×449 |
| News cards | `400:139530` News | 1312×569 |
| Newsletter cards | `400:139539` Newsletter | 1312×508 |
| Comments title | `400:139550` title | 139×40 |
| Comments intro | `400:139552` text frame | 946×32 |
| Composer (collapsed) | `400:139556` NewCommentInputContainer | 1216×56 |
| Transferred comments | `400:139558` Qouted | 1152×1012 |
| Registered comments | `400:139567` main comments | 1170×1132 |
| CTA band (shared) | `400:139435` Motivation box | 1512×362 |
| Footer (shared) | `400:139436` Footer | 1512×546 |
| Background pattern | `400:139437` BG Pattern | decorative, 60+ vectors — do not fetch |

Mobile frame `400:152066` (393 wide):

| Section | Node |
|---|---|
| Mobile top bar / header | `400:152183`, `400:152142` |
| Title | `400:152145` |
| Profile hero (mobile) | `400:152146` main top frame-Mobile |
| Interaction box | `400:152147` |
| Banner | `400:152148` |
| Academic records | `400:152149` |
| Contact grid | `400:152152` |
| Tabs | `400:152132` |
| Discount cards | `400:152156` |
| News cards | `400:152162` |
| Newsletters | `400:152174` |
| Comments | `400:152182` |
| CTA (mobile) + footer | `400:152131`, `400:152130` |

## Search results («نتایج جستجو») — filter frames

Shared by the owner on 2026-10-07 (desktop + tablet + mobile in each). Which node is which group was not
read (MCP limit): `422:60094`, `422:59793`, `422:59585`, `422:60438`, `422:60284` — محصولات, سرویس‌ها,
سرویس دهنده‌ها, کاربران. Spec: [design-specs/search/search-results.md](../design-specs/search/search-results.md).
