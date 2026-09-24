---
title: "How to use this docs kit"
description: "What goes where, naming, and update discipline for Daneshjoam docs"
category: "meta"
last_updated: "2026-09-25"
---

# How to use this docs kit

Every doc answers exactly one question:

| Question | Where it lives |
|---|---|
| What is this project, at a glance? | `README.md`, `01-overview.md` |
| Current state of the codebase / stack, machine-readable? | `PROJECT_CONTEXT.md` |
| What's done, what's left, right now? | `CURRENT-PROGRESS.md` (status) + SRS coverage table (per path code) |
| How is the system built? | `02-architecture.md` |
| Who can do what, and which business rules apply? | `03-domain-and-rules.md` |
| How does a URL map to a screen? | `04-routing.md` |
| What does the data look like? | `05-data-models.md` |
| How does client/server state work? | `06-state-management.md` |
| What are the backend / microservice contracts? | `07-integrations.md` |
| What env vars / config does it need? | `08-configuration.md` |
| What's broken, blocked, or deferred? | `09-known-issues.md` |
| What do tokens and shared components look like? | `10-design-system.md` |
| What are the requirements? | `srs/` (verbatim SRS, one file per service) |
| How does one feature work end-to-end? | `features/<service>-<feature>.md` |
| How do I plan / test / decide / deploy? | `templates/*.md` → copy, fill in, rename |
| Raw audit input used to write these docs | `ai/00-project-audit.md` |

## Markers

- `⟨FILL: …⟩` — a fact that exists in the repo but was not yet copied here. Fill it from the code or from
  `ai/00-project-audit.md` (the section is named in the marker). Never leave a guess.
- `TBD` — genuinely undecided; must have a matching row in `09-known-issues.md`.

## Frontmatter

```yaml
---
title: "Human title"
description: "One sentence — what this covers and when to read it"
category: "meta | architecture | feature | operations | plan | testing"
last_updated: "YYYY-MM-DD"
---
```

## Update discipline

- `CURRENT-PROGRESS.md` is the only source of truth for status; don't write "this is now done" elsewhere.
- Every merged feature gets a row in `README.md` → Features.
- Fill `templates/implementation-plan.md` before non-trivial work.
- Write an ADR for hard-to-reverse decisions (data shape, auth model, a pattern many services will copy).
- `09-known-issues.md` holds "we know this is wrong but are shipping anyway".
- `srs/` is read-only requirements. SRS errors are documented in `srs/README.md`, not silently corrected.
