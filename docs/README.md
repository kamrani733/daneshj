---
title: "Documentation Index"
description: "Master index for Daneshjoam frontend documentation"
category: "meta"
last_updated: "2026-09-25"
---

# Documentation Index

> **Project:** Daneshjoam (دانشجوام) — Persian, RTL-first student-services platform
> **Stack:** Nx monorepo · Next.js · backend microservices

Rules behind this structure: [00-HOW-TO-USE-THIS-DOCS-KIT.md](./00-HOW-TO-USE-THIS-DOCS-KIT.md)

## Start here

| File | What it covers |
|------|----------------|
| [CURRENT-PROGRESS.md](./CURRENT-PROGRESS.md) | Status tracker |
| [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) | AI / dev snapshot of the repo |
| [LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md) | First-launch steps |

## Core concepts

| File | What it covers |
|------|----------------|
| [01-overview.md](./01-overview.md) | Product, actors, services |
| [02-architecture.md](./02-architecture.md) | Monorepo layout, request flow, import direction |
| [03-domain-and-rules.md](./03-domain-and-rules.md) | Actors, access matrix, business rules |
| [04-routing.md](./04-routing.md) | Routes, guards, caching |
| [05-data-models.md](./05-data-models.md) | Shared entity shapes and contracts |
| [06-state-management.md](./06-state-management.md) | Server/client/URL state |
| [07-integrations.md](./07-integrations.md) | Microservices and endpoints |
| [08-configuration.md](./08-configuration.md) | Env vars, commands |
| [09-known-issues.md](./09-known-issues.md) | Blockers, open questions, debt |
| [10-design-system.md](./10-design-system.md) | Tokens, components, RTL visuals |
| [conventions-large-feature-ui.md](./conventions-large-feature-ui.md) | Splitting large screens |

## Requirements

| File | What it covers |
|------|----------------|
| [srs/README.md](./srs/README.md) | SRS index, glossary, code format, known SRS errors |
| [srs/path-index.md](./srs/path-index.md) | Every SRS path code |

## Features

| File | What it covers |
|------|----------------|
| [features/_example.md](./features/_example.md) | Convention for a per-feature doc (SRS-mapped) |
| [features/public-panel.md](./features/public-panel.md) | Public panel: role-based views, demo personas, responsive |
| [features/home.md](./features/home.md) | Home page sections, shared cards, mock data |

Add one row per feature as it's built.

## Templates

| File | Use it for |
|------|-------------|
| [templates/implementation-plan.md](./templates/implementation-plan.md) | Planning non-trivial work |
| [templates/feature-documentation.md](./templates/feature-documentation.md) | Documenting a feature |
| [templates/architecture-documentation.md](./templates/architecture-documentation.md) | Documenting an architectural area |
| [templates/technical-decision-record.md](./templates/technical-decision-record.md) | ADRs |
| [templates/testing-checklist.md](./templates/testing-checklist.md) | Verification before merge/release |
| [templates/deployment-checklist.md](./templates/deployment-checklist.md) | Release verification |

## AI resources

- [AGENTS.md](../AGENTS.md) — entry point for AI assistants
- [.cursor/rules/](../.cursor/rules/) — enforced rules (`00-core.mdc` always applies)
- [ai/00-project-audit.md](./ai/00-project-audit.md) — raw repo audit
