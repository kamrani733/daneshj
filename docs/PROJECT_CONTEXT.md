---
title: "Project Context"
description: "Source of truth for AI assistants — stack, structure, conventions, status"
category: "meta"
last_updated: "2026-09-25"
---

# Project Context

> **Project:** Daneshjoam (دانشجوام)
> **Purpose:** Student-services platform: discounts from businesses, news, newsletters, calendar events,
> messaging, rewards, referrals, and (later) jobs/internships — for students, service providers and admins.
> See [01-overview.md](./01-overview.md).
> **Integration status:** Frontend largely built from Figma (platform shell: auth, actor profiles, notifications,
> panels). SRS services are mostly not implemented yet: of 557 SRS paths, 0 DONE, 17 PARTIAL, 15 UI-ONLY,
> 525 MISSING (see SRS coverage in `ai/00-project-audit.md` §8).

## Detected tech stack

| Layer | Detected |
|-------|----------|
| Monorepo | Nx ⟨FILL: version, audit §1⟩ |
| Framework | Next.js ⟨FILL: version, router type, audit §1⟩ |
| Language | TypeScript ⟨FILL: strict flags, audit §1⟩ |
| Styling | ⟨FILL: audit §5⟩ |
| Server state | ⟨FILL: audit §4⟩ |
| Client state | ⟨FILL: audit §4⟩ |
| Forms / validation | ⟨FILL: audit §7⟩ |
| i18n | ⟨FILL: audit §6⟩ |
| Dates | ⟨FILL: Jalali library, audit §5⟩ |
| Backend | Microservices: Auth, Actor, Notification, Interactive Ops (others planned) |
| Auth | ⟨FILL: token/cookie model, `loginType`, audit §3⟩ |
| Package manager | ⟨FILL: audit §1⟩ |
| Deployment | Vercel (per `vercel-build` script) — domains/env matrix TBD |
| Tests | ⟨FILL: audit §10⟩; CI has an `e2e` target but no Playwright project |

### Scripts / targets

⟨FILL: table of package scripts and main Nx targets, audit §1⟩

## Architecture overview

```text
⟨FILL: top-level tree, depth 2, audit §2⟩
apps/
  ⟨main app⟩
  adm/          # status undecided — see 09-known-issues
  bus/          # status undecided — see 09-known-issues
libs/
  ⟨FILL⟩
docs/
  srs/          # verbatim SRS per service
.cursor/rules/
```

Full detail: [02-architecture.md](./02-architecture.md)

## Routes

See [04-routing.md](./04-routing.md).

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_ACTOR_API_URL` | Actor MS base URL — whether required in production is TBD |
| ⟨FILL: others, audit §1⟩ | |

Full detail: [08-configuration.md](./08-configuration.md)

## Integration progress

| Phase | Status |
|-------|--------|
| 0 Analysis & docs | Partial — SRS converted, audit done, docs kit in progress |
| 1 Platform shell (auth, actor, notifications, panels) | Partial — ⟨FILL⟩ |
| 2 Shared patterns (approval, soft delete, categories, reasons, reports) | Not started as shared libs |
| 3 SRS services | Mostly missing — see coverage |
| 4 Design system consolidation | In progress — [10-design-system.md](./10-design-system.md) |
| 5 Tests / CI | Partial — e2e target without project |
| 6 Deployment | Partial — Vercel, env matrix TBD |

Canonical tracker: [CURRENT-PROGRESS.md](./CURRENT-PROGRESS.md)

## Non-negotiable rules

- **Never** trust client-side actor/role gating — backend enforces every action ([03-domain-and-rules.md](./03-domain-and-rules.md)).
- **Never** accept actor type, provider id or permission flags from the client as authority.
- **Never** compute prices, discounts, wallet balances or rewards client-side for submitted operations.
- **Always** implement SRS exception paths with their normal paths; SRS texts verbatim.
- **Always** build cross-service behaviours (approval, soft delete, archive, categories, reasons, reports) once,
  as shared libs.
- **Always** RTL Persian, Jalali display dates, logical CSS properties.

Engineering conventions: `.cursor/rules/`. Design system: [10-design-system.md](./10-design-system.md).
