---
title: "Project Progress"
description: "Canonical completion tracker for Daneshjoam frontend"
category: "meta"
last_updated: "2026-10-02"
---

# Current Progress

> **Source of truth** for status. Per-path SRS coverage lives in the SRS coverage table
> (`ai/00-project-audit.md` §8, to be moved to `srs-coverage.md`).

## Executive summary (2026-10-02)

Platform shell built from Figma: **auth** (OTP/password/sessions), **actor profiles** (private + public panels),
**notifications** (inbox, stats, charts, reports, settings), **home** (mock search), **cooperation** page,
**interactive ops** on public profiles. **Public panel** rebuilt to the Figma exports for owner / user / guest /
admin on individual-provider and non-provider panels, desktop + tablet + mobile
([features/public-panel.md](./features/public-panel.md)). **Home** rewritten with shared cards
([features/home.md](./features/home.md)). Shared card family with one hover in `components/cards/`.
SRS services: **0** of **557** paths DONE, **17** PARTIAL, **15** UI-ONLY, **525** MISSING.

## Overall status

| Area | Status | Notes |
|------|--------|-------|
| SRS in repo (`docs/srs/`) | Done | Per-service Markdown + path index |
| Docs kit | Done | Kit placeholders filled; design TBDs in `09-known-issues.md` |
| Cursor rules / AGENTS.md | Done | `.cursor/rules/` — reconcile with code ongoing |
| Design system consolidation | In progress | [10-design-system.md](./10-design-system.md); shared cards, `ScrollCarousel`, `SectionHeading` sizes, `SortMenu` popover done |
| Public panel | UI done (mock catalog / comments) | Role-based views, 8 demo personas, responsive — [features/public-panel.md](./features/public-panel.md) |
| Home page | UI done (mock) | Shared cards, carousels, new photos — [features/home.md](./features/home.md) |
| Private panel | Not started (redesign) | Figma exports received; work paused by owner |
| Platform shell | Partial | `/dashboard` missing; actor query gating; auth dev shortcuts |
| Shared pattern libs | Not started | approval, soft delete, archive, categories, reasons, reports, uploader |
| SRV general pages | Partial | 0 DONE, 9 PARTIAL, 26 MISSING (mock home search) |
| Rwd | Not started | 26 MISSING |
| Dsc | Not started | 0 DONE, 4 PARTIAL, 3 UI-ONLY, 129 MISSING |
| Rfl | Not started | 0 DONE, 4 PARTIAL, 19 MISSING |
| Msg | Not started | 0 DONE, 4 UI-ONLY (comments UI), 28 MISSING |
| Nws | Not started | 0 DONE, 4 UI-ONLY, 99 MISSING |
| Nwl | Not started | 0 DONE, 4 UI-ONLY, 117 MISSING |
| Cln | Not started | 81 MISSING |
| Tests | Partial | Jest: capabilities + comment sorting specs (45 tests pass); CI `e2e` without Playwright project |
| Deployment | Partial | Vercel; env matrix TBD |

## Phases

### Phase 0 — AI-first foundation
- [x] SRS converted and in repo
- [x] Repo audit
- [x] Docs kit filled (no placeholder markers left)
- [ ] Rules reconciled with the codebase
- [ ] Design system inventory + consolidation plan

### Phase 1 — Shared foundations
- [ ] Actor/permission helper (single source)
- [ ] Shared HTTP client + error normalization
- [ ] Formatting utils (Jalali, digits, money, text normalization)
- [ ] Shared states (loading, empty, error, no-permission, guest)
- [ ] Shared patterns: list shell, approval, soft delete, archive, categories, reasons, uploader, reports

### Phase 2 — SRS services (order TBD)
- [ ] ⟨service⟩ — one line per service, link to its feature docs

### Phase 3 — Integration & hardening
- [ ] Replace mocks per service
- [ ] Security review
- [ ] Tests + CI green
- [ ] Production deployment
