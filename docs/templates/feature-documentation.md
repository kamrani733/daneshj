---
title: "Feature: [Feature Name]"
description: "Behavior, integration points, and verification for Feature A"
category: "feature"
last_updated: "YYYY-MM-DD"
---

# Feature: [Feature Name]

## Summary

One paragraph: what the feature does and who uses it.

## SRS coverage

| Path code | Name | Status (DONE / PARTIAL / UI-ONLY / MISSING) | Files |
|---|---|---|---|
| `Adm-Xxx-1N1` | ... | | |

SRS source: `docs/srs/0X-<Svc>-*.md` → section ...

## Actors

| Actor | Access |
|------|--------|
| Usr | ... |
| ASR | ... |
| Adm | ... |
| Guest | ... |

## Routes

| Route | Purpose | Guard |
|-------|---------|-------|
| `/path` | ... | server guard + capability |

## Data model

| Entity / Table | Purpose |
|----------------|---------|
| `entities` | ... |

Link to `docs/05-data-models.md` for full schema.

## Key modules

| Layer | Path | Responsibility |
|-------|------|----------------|
| Route | `apps/<app>/app/<route>/` | page + sections |
| Data | `.../api/`, `libs/<svc>/data-access` | client + hooks |
| Types | `libs/<svc>/types` | DTOs, status map |
| Shared patterns used | `libs/shared/patterns/...` | approval, soft delete, ... |

## Workflows

### Workflow 1 — [Name]

1. Step
2. Step
3. Step

## Integration points

- **Notifications:** how/when emitted
- **Email / webhooks:** if applicable
- **External Service:** if applicable

## Configuration

| Env var | Required | Purpose |
|---------|----------|---------|
| `EXAMPLE_KEY` | Yes/No | ... |

## Edge cases

- Every SRS E-path (list them)
- Guest / legal-entity provider restrictions
- Five UI states: loading, empty, error, no-permission, guest

## Testing

Manual smoke path:

1. ...
2. ...

Automated tests (if any): `path/to/test`

## Known gaps

- TBD

## Related docs

- [04-routing.md](../04-routing.md)
- ADRs in `docs/adr/`
