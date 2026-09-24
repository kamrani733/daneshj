---
title: "Architecture: [Area Name]"
description: "Structure, data flow, and constraints for [Module / Layer]"
category: "architecture"
last_updated: "YYYY-MM-DD"
---

# Architecture: [Area Name]

## Purpose

What this architectural area covers and why it exists.

## Scope

**In scope:**
- Item

**Out of scope:**
- Item

## High-level diagram

```text
[Client] → [Route] → [Feature UI] → [Server Action] → [Database]
```

Optional: add mermaid if helpful.

## Folder layout

```text
src/
  relevant/
    paths/
```

## Component / module responsibilities

| Module | Responsibility |
|--------|----------------|
| Module A | ... |
| Service B | ... |

## Data flow

### Read path

1. ...
2. ...

### Write path

1. ...
2. ...

## State and caching

- Server-rendered data: ...
- Client cache: ...
- Invalidation rules: ...

## Security

- Auth requirements
- RLS / authorization notes
- Privileged operations (if any)

## Dependencies

| Dependency | Usage |
|------------|-------|
| Library / Service | ... |

## Extension guidelines

How to add new capabilities in this area without breaking patterns.

## Related decisions

- [ADR-XXXX: Title](../adr/0000-title.md)

## References

- `.cursor/rules/20-architecture.mdc`
- `docs/02-architecture.md`
