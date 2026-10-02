---
title: "Project Context"
description: "Source of truth for AI assistants — stack, structure, conventions, status"
category: "meta"
last_updated: "2026-10-02"
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
| Monorepo | Nx **23.0.1** (`@daneshjoam/source`) |
| Framework | Next.js **~16.1.6**, **App Router** (`apps/usr`) |
| Language | TypeScript **~5.9.2**; `strict: true`, `noImplicitReturns`, `noUnusedLocals`, `noFallthroughCasesInSwitch`, `noImplicitOverride` (`tsconfig.base.json`) |
| Styling | Tailwind CSS **v4** (`@import "tailwindcss"`), design tokens in `apps/usr/src/app/globals.css`; shadcn/Radix-style UI in `apps/usr/src/components/ui/` |
| Server state | **TanStack Query v5** (`@tanstack/react-query`); defaults in `libs/shared-ui/src/lib/query-client.ts` |
| Client state | httpOnly session cookie + server `getSession`; **Zustand** auth wizard in `sessionStorage` (step tokens in httpOnly `auth_flow_step`, not `localStorage`) |
| Forms / validation | No `react-hook-form`; **Zod** for visibility fields (`visibility-validation.ts`); otherwise manual validation in controllers |
| i18n | **next-intl** ^4.13.1, locale fixed **`fa`** (`apps/usr/src/i18n.ts`, `apps/usr/messages/fa.json`) |
| Dates | In-house Jalali util `apps/usr/src/lib/jalali.ts`; display via `format-fa.ts` / `JalaliDatePicker` |
| Backend | Microservices: Auth, Actor, Notification, Interactive Ops (others planned) |
| Auth | httpOnly `session` cookie (base64 JSON `Session`); bearer `accessToken` passed to client queries; `loginType` / `User_` id prefix used ad hoc in `SiteShell` — RBAC TBD |
| Package manager | **pnpm** (workspace `apps/*`, `libs/*`) |
| Deployment | Vercel, **`apps/usr` only** (`vercel-build`) — domains/env matrix TBD |
| Tests | Jest on `usr`/`adm` (minimal); **no Playwright project** though CI runs `e2e` |

### Scripts / targets

| Command | What it does |
|---------|----------------|
| `pnpm exec nx dev usr` | Next.js dev server (`next dev` in `apps/usr`) |
| `pnpm exec nx build usr` | Production build |
| `pnpm exec nx start usr` | `next start` after build |
| `pnpm exec nx lint usr` | ESLint in `apps/usr` |
| `pnpm exec nx test usr` | Jest in `apps/usr` |
| `pnpm run vercel-build` | Builds `apps/usr` only (root or `apps/usr`) |
| CI | `nx run-many -t lint test build typecheck e2e` (`.github/workflows/ci.yml`) |

Root `package.json` has `vercel-build` (delegates to `apps/usr`); other work uses Nx targets above.

## Architecture overview

```text
daneshjoam/
├── apps/
│   ├── usr/          # main Persian RTL product (Next.js)
│   ├── adm/          # placeholder admin app — status undecided
│   └── bus/          # placeholder ASR app — status undecided
├── libs/
│   ├── api-client/   # Axios factory, ApiError, mock fallback
│   ├── auth/         # session cookie, login/logout, useAuthStore
│   ├── shared-types/ # User, Session
│   └── shared-ui/    # QueryProvider + query client defaults
├── docs/
│   ├── srs/          # verbatim SRS per service
│   └── …
└── .cursor/rules/
```

Full detail: [02-architecture.md](./02-architecture.md)

## Routes

See [04-routing.md](./04-routing.md).

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Auth MS base URL. Unset in dev → auth mocks (`isAuthApiMocked`). Production build requires this or `AUTH_API_URL`; mocks are compiled out |
| `NEXT_PUBLIC_ACTOR_API_URL` | Actor MS browser base (often `/api`); also gates `canQueryActor()` — see known issues |
| `NEXT_PUBLIC_NOTIFICATION_API_URL` | Notification MS browser base |
| `NEXT_PUBLIC_INTERACTIVE_OPS_API_URL` | Interactive Ops browser base |
| `NEXT_PUBLIC_FILE_UPLOAD_URL` | File upload endpoint for profile documents |
| `AUTH_API_URL` | Server rewrite target for `/api/auth/*` |
| `ACTOR_API_URL` | Server rewrite target for Actor paths |
| `NOTIFICATION_API_URL` | Server rewrite target for `/api/notification/*` |
| `INTERACTIVE_OPS_API_URL` | Server rewrite target for interactive-ops (default host if unset — debt) |
| `TEMP_ADMIN_ACCESS_TOKEN` | Dev/admin impersonation bypass |
| `NODE_ENV` | Cookie `secure` flag in auth actions |

Full detail: [08-configuration.md](./08-configuration.md)

## Integration progress

| Phase | Status |
|-------|--------|
| 0 Analysis & docs | Partial — SRS converted, audit done, docs kit in progress |
| 1 Platform shell (auth, actor, notifications, panels) | Partial — auth + profiles + notifications wired; home search mock; `/dashboard` broken |
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
