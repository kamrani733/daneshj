---
title: "Project Progress"
description: "Canonical completion tracker for Daneshjoam frontend"
category: "meta"
last_updated: "2026-09-25"
---

# Current Progress

> **Source of truth** for status. Per-path SRS coverage lives in the SRS coverage table
> (`ai/00-project-audit.md` §8, to be moved to `srs-coverage.md`).

## Executive summary (2026-09-25)

Platform shell built from Figma (⟨FILL: auth, actor profiles, notifications, panels…⟩). SRS services: 0 of 557
paths DONE, 17 PARTIAL, 15 UI-ONLY, 525 MISSING. AI-first setup in progress: SRS in repo, docs kit, Cursor rules.

## Overall status

| Area | Status | Notes |
|------|--------|-------|
| SRS in repo (`docs/srs/`) | Done | Per-service Markdown + path index |
| Docs kit | In progress | `⟨FILL⟩` markers remain |
| Cursor rules / AGENTS.md | In progress | `.cursor/rules/` |
| Design system consolidation | In progress | [10-design-system.md](./10-design-system.md) |
| Platform shell | ⟨FILL⟩ | |
| Shared pattern libs | Not started | approval, soft delete, archive, categories, reasons, reports, uploader |
| SRV general pages | ⟨FILL from coverage⟩ | |
| Rwd | ⟨FILL⟩ | |
| Dsc | ⟨FILL⟩ | |
| Rfl | ⟨FILL⟩ | |
| Msg | ⟨FILL⟩ | |
| Nws | ⟨FILL⟩ | |
| Nwl | ⟨FILL⟩ | |
| Cln | ⟨FILL⟩ | |
| Tests | ⟨FILL⟩ | e2e target without project |
| Deployment | Partial | Vercel; env matrix TBD |

## Phases

### Phase 0 — AI-first foundation
- [x] SRS converted and in repo
- [x] Repo audit
- [ ] Docs kit filled (no `⟨FILL⟩` left)
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
