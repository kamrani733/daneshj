---
title: "Figma map — public panel file"
description: "What each frame in the Figma file is, with node IDs, read via the Figma MCP"
category: "architecture"
last_updated: "2026-09-25"
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
