# AGENTS.md — Daneshjoam (دانشجوام)

Entry point for AI coding assistants (Cursor, Claude, Copilot, etc.).

## Read first, in order

1. `docs/PROJECT_CONTEXT.md` — stack, structure, status, non-negotiable rules
2. `docs/02-architecture.md` — monorepo layout, request flow, import direction
3. `docs/03-domain-and-rules.md` — actors, per-service access matrix, business rules
4. `docs/10-design-system.md` — tokens and shared components (any UI work)
5. `docs/srs/README.md` + the relevant `docs/srs/0X-*.md` — requirements (any feature work)

Status lives only in `docs/CURRENT-PROGRESS.md`. Known problems live in `docs/09-known-issues.md`.

## Enforced rules

`.cursor/rules/*.mdc` — `00-core.mdc` always applies; the rest attach by file glob or by topic.
If a rule and a doc disagree, the rule wins and the doc must be fixed in the same change.

## Working agreement

- Don't guess: missing requirement, token, icon, endpoint, role rule or copy text → stop and ask.
- A direct, explicit instruction from the owner is applied immediately.
- Fill `docs/templates/implementation-plan.md` before non-trivial work; update docs in the same change.
