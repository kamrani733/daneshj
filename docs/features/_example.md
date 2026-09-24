---
title: "Feature: [Service] — [Feature name]"
description: "Convention example for per-feature docs, mapped to SRS path codes"
category: "feature"
last_updated: "2026-09-25"
---

# Feature: Dsc — Product operations (example)

> Convention example. Copy `../templates/feature-documentation.md`, name it `<svc>-<feature>.md`
> (e.g. `dsc-product-operations.md`).

## Summary

Providers and admins create, edit, copy, archive and delete discount products; admins approve publishing and
field-level edits. SRS: `srs/03-Dsc-discount.md` → 2-10-2, feature `Dsc-2`.

## SRS coverage

| Path code | Name | Status | Files |
|---|---|---|---|
| `ASR-Dsc-2N1`, `Adm-Dsc-2N1` | Create product | MISSING | — |
| `ASR-Dsc-2E4` | Duplicate title in one business | MISSING | — |
| … | | | |

## Actors

| Actor | Access |
|---|---|
| ASR | Own products: create, edit, copy, archive, request delete/restore/publish |
| Adm | All products: approve/unpublish, field-level edit approval, delete/restore |

## Routes · Key modules · Workflows · Edge cases · Known gaps

(see template)
