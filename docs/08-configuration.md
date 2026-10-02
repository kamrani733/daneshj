---
title: "Configuration"
description: "Environment variables, local setup, commands, production configuration"
category: "architecture"
last_updated: "2026-10-02"
---

# Configuration

## Environment variables

| Variable | Required | Client-exposed | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Production: this or `AUTH_API_URL` | Yes | Auth MS base URL. Unset in dev → auth mocks. Production builds never mock |
| `NEXT_PUBLIC_ACTOR_API_URL` | No (defaults to `/api`) | Yes | Optional Actor MS browser base. Queries use same-origin `/api` when unset |
| `NEXT_PUBLIC_NOTIFICATION_API_URL` | When using notification APIs | Yes | Notification MS browser base (often `/api`) |
| `NEXT_PUBLIC_INTERACTIVE_OPS_API_URL` | When using interactive ops | Yes | Interactive Ops browser base (often `/api`) |
| `NEXT_PUBLIC_FILE_UPLOAD_URL` | For document upload | Yes | Upload endpoint for profile files |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Optional | Yes | reCAPTCHA v2 (password login); test key fallback |
| `AUTH_API_URL` | Production: this or `NEXT_PUBLIC_API_URL` | No | Upstream Auth MS. Also satisfies the production build check |
| `ACTOR_API_URL` | For Actor rewrites | No | Upstream Actor MS |
| `NOTIFICATION_API_URL` | For `/api/notification` rewrites | No | Upstream Notification MS |
| `INTERACTIVE_OPS_API_URL` | Recommended in prod | No | Upstream Interactive Ops (default host in config if unset) |
| `NEXT_PUBLIC_DEMO_MODE_ENABLED` | No | Yes | When `true`, enables the public-panel presentation demo toggle and lazy-loaded fixtures (dev/preview only; leave unset in production) |
| `TEMP_ADMIN_ACCESS_TOKEN` | Dev/admin only | No | Temporary admin impersonation |
| `NODE_ENV` | Automatic | No | Cookie `secure` on session |

Rule: only `NEXT_PUBLIC_*` reaches the browser; every variable is listed in `apps/usr/.env.example`.

## Local setup

```bash
pnpm install
cp apps/usr/.env.example apps/usr/.env.local   # adjust MS URLs for your environment
pnpm exec nx dev usr
```

Node **20** in CI; workspace uses **pnpm** (`pnpm-workspace.yaml`).

## Commands

| Command | What it does |
|---|---|
| `pnpm exec nx dev usr` | Next.js dev server (`next dev` in `apps/usr`) |
| `pnpm exec nx build usr` | Production build |
| `pnpm exec nx start usr` | Serve production build |
| `pnpm exec nx lint usr` | ESLint (`react-hooks/rules-of-hooks` is an error; `exhaustive-deps` is a warning) |
| `pnpm exec nx test usr` | Jest |
| `pnpm exec nx typecheck usr` | `tsc --noEmit -p tsconfig.json` in `apps/usr`. Library projects typecheck first (`tsc --build tsconfig.json --emitDeclarationOnly`) |
| `pnpm exec nx typecheck adm` / `nx typecheck bus` | Same `tsc --noEmit -p tsconfig.json` for those apps |
| `pnpm exec nx run-many -t lint test build typecheck` | Lint, test, build, and typecheck every project |
| `pnpm exec nx affected -t lint test build typecheck` | Pre-merge checks |

Note: Nx target is **`dev`**, not `serve`, for `usr`.

## Production

This repo has one Vercel project: **`apps/usr`**. `apps/adm` and `apps/bus` are not deployed.

In the Vercel dashboard, set **Root Directory** to `apps/usr` (Project Settings → General). That is
the supported way to pin a monorepo app. Repo files cover both dashboard setups:

| File | When it applies |
|---|---|
| Root `vercel.json` | Root Directory is the repository root (`.`) — install/build only `@daneshjoam/usr` |
| `apps/usr/vercel.json` | Root Directory is `apps/usr` |
| `.vercelignore` | Excludes `apps/adm` and `apps/bus` from the upload |
| `apps/usr/scripts/vercel-ignore.mjs` | Skips a deploy when `usr` and its workspace graph did not change |
| `apps/usr/scripts/vercel-build.mjs` | Runs `next build` |

On Vercel (`VERCEL=1`), missing build env vars fall back to the same dev Stella values as
`apps/usr/.env.example` (unless overridden in the project Environment Variables). Local
`nx build usr` / `next build` still requires `NEXT_PUBLIC_API_URL` or `AUTH_API_URL`. Production
deployments should set real MS URLs in the Vercel dashboard. Domains and full env matrix per
environment: TBD.
