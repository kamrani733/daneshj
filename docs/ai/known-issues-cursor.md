---
title: "Known Issues & TBD Items"
description: "Open questions, undetermined facts, and technical debt"
category: "audit"
last_updated: "2026-09-25"
---

# Known Issues & TBD Items

## TBD Items (facts not determined)

| ID | Item | Context | Source |
|----|------|---------|--------|
| 1 | Figma file URL / page names | Design system sources | Audit §5 — external URLs not committed |
| 2 | Display typography token scale | No explicit tokens defined | globals.css uses Tailwind defaults |
| 3 | h1–h4 typography token scale | No explicit tokens defined | globals.css uses Tailwind defaults |
| 4 | z-index scale | No explicit scale in globals.css | Uses Tailwind defaults inline |
| 5 | Overlay color token | No explicit token for modal backdrop | Need to define `--color-overlay` |
| 6 | Permission source of truth | JWT claims / `loginType` / actor type | Audit §3 — no centralized RBAC |
| 7 | Conversations/messages actor access | TBD for ASR, Adm | SRS Msg capability matrix |
| 8 | Production deployment target | Vercel per `vercel-build` | Audit §13 — domains/env matrix |
| 9 | `apps/adm` and `apps/bus` plans | Planned frontends or deprecated? | Audit §13 |
| 10 | OpenAPI spec locations | External swagger URLs not committed | Audit §12 |
| 11 | Dark mode decision | Partial `.dark` implementation exists | Components have dark variants but no explicit decision |

## Technical Debt (from audit §11)

| Issue | Location | Severity | Suggested fix |
|-------|----------|----------|---------------|
| `NEXT_PUBLIC_ACTOR_API_URL` gate disables queries when using `/api` proxy only | `private-panel/api/react-query.ts`, `public-panel/api/react-query.ts` | **High** | Enable when `accessToken` + same-origin `/api`, or set public env |
| Hardcoded default interactive-ops backend host in `next.config.js` | `apps/usr/next.config.js` | **High** | Require env in prod; redact in docs |
| `/dashboard` protected but no page | `middleware.ts`, `auth-routes.ts` | **High** | Add page or remove links/guard |
| Auth OTP dev shortcuts / client-side OTP storage | `auth-forms.tsx`, `auth-flow.ts` | **High** | Remove before production |
| `TEMP_ADMIN_ACCESS_TOKEN` bypass | `temporary-admin-login.ts` | **High** | Restrict to non-prod or remove |
| Duplicated API error/HTTP layers | multiple `http.ts` files | Medium | Consolidate in `@daneshjoam/api-client` |
| No global toast / error boundary | app-wide | Medium | Add `error.tsx` + toast pattern |
| Comments/messaging without API | `comments/section.tsx` | Medium | Wire Msg service or mark UI-only |
| Home search entirely mock | `home/data/search-mock.ts` | Medium | Integrate SRV search API |
| Large unmaintainable files (>300 lines) | Multiple — see audit | Medium | Split by tab/section |
| usr unit test imports non-existent page | `apps/usr/specs/index.spec.tsx` | Medium | Point at real route component |
| CI runs `e2e` with no Playwright project | `.github/workflows/ci.yml` | Medium | Add e2e app or drop target |
| Tailwind version mismatch in package.json | `apps/usr/package.json` vs root | Low | Align declarations |

## Component Consolidation Needed

| Pair | Issue |
|------|-------|
| `dialog.tsx` vs `app-dialog.tsx` | Both provide modal dialogs |
| `outlined-field.tsx` vs `floating-input.tsx` vs `underline-field.tsx` | Three field variants |

## Hardcoded Colors Needing Token Migration

See [10-design-system.md](../files/10-design-system.md#hardcoded-colors-in-code-should-map-to-tokens) for the full list.

## Open Questions (from audit §13)

1. Where is the authoritative **SRS** (`docs/srs/` is absent)?
2. What is the **production deployment** target (confirm domains and env matrix)?
3. Are **`apps/adm` and `apps/bus`** planned separate frontends or deprecated scaffolding?
4. What is the **source of truth for roles/permissions** beyond ad hoc checks?
5. Where are **OpenAPI specs** hosted for Auth, Actor, Notification, Interactive Ops MS?
6. Should **`/dashboard`** exist, or should menu links point elsewhere?
7. Is **`NEXT_PUBLIC_ACTOR_API_URL` required in production** or should same-origin `/api` rewrites suffice?
8. What is the **backend readiness** for Msg, Dsc, Nws, Nwl, Cln, Rwd services?
9. **CI `e2e`**: is it expected to pass? No Playwright project is defined.
10. Are **notification settings** categories/channels fully backend-driven or permanently hybrid with `settings-mock.ts`?
