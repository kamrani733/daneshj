---
title: "Implementation Plan: OpenAPI → TypeScript types"
description: "Plan only — generate types from docs/api specs and migrate handwritten DTOs gradually"
category: "plan"
last_updated: "2026-09-25"
owner: "owner"
---

# Implementation Plan: OpenAPI → TypeScript types

Status: **Plan only** (no codegen in repo yet). Specs: [`docs/api/`](../api/).

## Goal

Generate strict TypeScript types from the checked-in OpenAPI files (`auth-ms.openapi.yaml`, `actor-ms.openapi.yaml`) so feature code stops duplicating request/response shapes. Keep runtime HTTP in `@daneshjoam/api-client` (axios today); types live in `@daneshjoam/shared-types` (or a thin generated subpath) and are adopted **per endpoint cluster**, without a big-bang rewrite.

## SRS scope

Not an SRS feature. Touches auth, actor profiles, and future guards that consume `get_access_actor` / `get_access_guest`.

Red/yellow SRS flags touched: **none** (actor-type naming mismatch is documented in [09-known-issues.md](../09-known-issues.md) Resolved).

## Acceptance criteria (when implemented)

- [ ] `nx` target regenerates types from `docs/api/*.openapi.yaml` with a single command; CI fails if generated output is stale (optional `git diff` check on PR).
- [ ] Generated files are committed (not produced only on developer machines).
- [ ] At least one real call site (e.g. `get_token_info` or `profiles_base/get_actor_info`) uses generated operation/response types end-to-end.
- [ ] Handwritten duplicates in touched modules are removed or narrowed to **view models** (UI-only fields).
- [ ] `nx affected -t lint test build typecheck` passes.

## Non-goals

- Generating a full typed HTTP client for every path in Auth/Actor (hundreds of admin/IPC routes).
- Replacing `Session` / cookie shape in `libs/shared-types` with OpenAPI in the first pass.
- OpenAPI for Notification / Interactive Ops until specs land in `docs/api/`.
- Resolving SRS vs API actor-type naming in codegen (handled in domain docs and manual mapping types).

## Dependencies

| Dependency | Status | Owner |
|---|---|---|
| OpenAPI files in `docs/api/` | Ready (Auth v6, Actor v1) | — |
| Owner confirms actor-type → SRS mapping for guards | Documented; product alignment TBD | owner |
| Consolidated `ApiError` / envelope helpers | Medium debt ([09-known-issues.md](../09-known-issues.md)) | — |

## Assumptions

- Specs in `docs/api/` are updated when backend ships contract changes; frontend bumps YAML then regenerates.
- Django-style envelopes (`success`, `message`, `status_code`, `errors`, `data`) match what features already assert — generated `data` schemas are the valuable part.
- `openapi-typescript` (v7+) is sufficient; no need for `openapi-fetch` until we want path-param inference on the client.

## Approach summary

Use **openapi-typescript** to emit declaration-only modules per service. Export stable aliases from `libs/shared-types/src/index.ts` for the shapes apps import. Migrate feature `types/api.ts` files by **replacing** interfaces that mirror OpenAPI components with `import type` from generated schemas, keeping mappers/transformers where the UI needs a different shape.

## Proposed layout

```
docs/api/
  auth-ms.openapi.yaml          # source of truth (already present)
  actor-ms.openapi.yaml
libs/shared-types/
  src/
    generated/
      auth-ms.d.ts              # generated — do not edit
      actor-ms.d.ts
    openapi/
      auth.ts                   # thin re-exports + OperationId aliases (handwritten)
      actor.ts
    lib/user.ts                 # Session, User — stay handwritten until deliberate merge
  package.json                  # script: "codegen:api-types"
```

Alternative (if generated files are huge): separate package `@daneshjoam/api-types` with only `.d.ts` output. Prefer staying in `shared-types` until size or Nx boundary pain justifies a split.

## Tooling

1. Add devDependency at repo root: `openapi-typescript`.
2. Scripts (root `package.json` or `libs/shared-types/package.json`):

   ```bash
   openapi-typescript docs/api/auth-ms.openapi.yaml -o libs/shared-types/src/generated/auth-ms.d.ts
   openapi-typescript docs/api/actor-ms.openapi.yaml -o libs/shared-types/src/generated/actor-ms.d.ts
   ```

3. Nx: `shared-types:codegen` target running both commands; `shared-types:build` depends on `codegen` (or document “run codegen before commit” until wired).
4. `.gitattributes` / Prettier: exclude generated `*.d.ts` from manual formatting if noisy, or run Prettier once after generate.

### Recommended `openapi-typescript` options

- `--export-type` — use `export type` for cleaner ESLint.
- If schemas use `nullable: true`, confirm output matches existing `| null` usage in mappers.
- For very large specs, consider splitting generation later; start with full file.

### Optional second step (not phase 1)

- **openapi-typescript-helpers** or **openapi-fetch** with `paths` from the same output for typed `GET`/`POST` paths — only after `@daneshjoam/api-client` exposes a generic `request<Path, Method>(...)`.

## Public API surface

Generated `paths` and `components['schemas']` are verbose. Handwritten barrels should expose only what apps need:

```ts
// libs/shared-types/src/openapi/auth.ts (example)
import type { components, paths } from '../generated/auth-ms.js';

export type AuthApiEnvelope<T> = components['schemas']['...']; // if a shared envelope exists in spec
export type GetTokenInfoResponse =
  paths['/auth/get_token_info']['get']['responses']['200']['content']['application/json'];
```

Use OpenAPI `operationId` in comments when adding aliases so grep stays easy.

## Migration phases

### Phase 0 — Bootstrap (small PR)

| Step | Task |
|------|------|
| 0.1 | Add `openapi-typescript`, codegen scripts, empty or first generated files |
| 0.2 | Document in [05-data-models.md](../05-data-models.md) that codegen exists and where imports come from |
| 0.3 | ESLint: allow `generated/**` only for restricted rules if needed |

### Phase 1 — Auth MS (highest duplication today)

| Area | Handwritten today | Target |
|------|-------------------|--------|
| `(auth)/api/types.ts` | `SendCodeData`, `VerifyCodeData`, `RefreshTokenData`, `TokenInfoData`, … | Types from `auth-ms` components/paths for endpoints already called in `auth.ts` |
| `(auth)/api/transformers.ts` | Maps API → `Session` | Keep; input types become generated |
| `libs/shared-types` `Session` / `User` | Cookie + client session | **Unchanged** — app contract, not 1:1 with a single schema |

Order: endpoints already wired in `auth.ts` (send/verify code, refresh, token info, sessions, logout) before admin-only routes.

### Phase 2 — Actor MS profiles

| Area | Handwritten today | Target |
|------|-------------------|--------|
| `public-panel/types/api.ts`, `private-panel/types/api.ts` | Large visitor/owner/admin DTOs | Generated schemas for `profiles_*` retrieve/submit responses used in `profiles-*.ts` |
| `service-titles.ts` | List/retrieve shapes | `service_titles/*` from actor spec |
| Mappers (`pending-mappers`, `submit-mappers`) | UI pending-field structs | Keep as **view types**; map from generated `data` types |

Start with **read** paths: `GET /profiles_base/get_actor_info`, `GET .../retrieve-for-visitor`, `GET .../retrieve-for-owner`. Writes/submits second (more validation surface).

### Phase 3 — Permissions

| Step | Task |
|------|------|
| 3.1 | Generate types for `get_access_actor` and `get_access_guest` responses |
| 3.2 | New module e.g. `libs/auth` or `apps/usr` guard helper that loads and caches access payload |
| 3.3 | Replace ad hoc `loginType` / `User_` prefix checks in shell where access matrix is authoritative |

### Phase 4 — Remaining services

When Notification / Interactive Ops YAML lands in `docs/api/`, repeat Phase 0–1 for each file; merge envelope handling in `@daneshjoam/api-client` if still duplicated.

## Gradual migration rules

1. **One endpoint cluster per PR** — easier review and rollback.
2. **Delete, don’t alias forever** — when a handwritten interface matches a generated schema, remove the duplicate and fix imports; avoid `type Foo = components['schemas']['Foo']` re-export chains unless they improve names.
3. **Mappers stay** when UI needs flattened fields, Persian labels, or union narrowing the spec leaves as `string`.
4. **Mocks** (`(auth)/api/mock.ts`, panel mocks) — update fixtures to satisfy generated types; keeps mock and real aligned.
5. **Breaking spec changes** — CI typecheck fails; fix call sites or pin YAML until backend is corrected.

## Risks

| Risk | Mitigation |
|------|------------|
| Huge `.d.ts` slows IDE | Barrel exports; import only needed types |
| Spec drift vs production | Version field in YAML; note in PR when bumping |
| Five API actor types vs three SRS roles | Explicit `SrsActorRole` + mapping table in domain doc, not in generated files |
| Duplicate `ApiResponse<T>` per feature | Later: single envelope type from Auth spec `components` |

## Verification

- `pnpm exec nx run shared-types:codegen` (once added) then `nx affected -t lint test build typecheck`.
- Manual: login + public profile load still work after first migrated endpoint cluster (owner checklist — not claimed by agent).

## Work breakdown estimate

| Phase | Estimate |
|-------|----------|
| 0 Bootstrap | 2–4h |
| 1 Auth endpoints in use | 1–2 days |
| 2 Actor read paths | 2–4 days |
| 3 Permissions | 1–2 days (depends on guard design) |

Total incremental; phases can pause between PRs.
