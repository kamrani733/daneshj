---
title: "Configuration"
description: "Environment variables, local setup, commands, production configuration"
category: "architecture"
last_updated: "2026-09-25"
---

# Configuration

## Environment variables

| Variable | Required | Client-exposed | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Production: this or `AUTH_API_URL` | Yes | Auth MS base URL. Unset in dev → auth mocks. Production builds never mock |
| `NEXT_PUBLIC_ACTOR_API_URL` | TBD in production | Yes | Actor MS browser base; also gates profile queries today |
| `NEXT_PUBLIC_NOTIFICATION_API_URL` | When using notification APIs | Yes | Notification MS browser base (often `/api`) |
| `NEXT_PUBLIC_INTERACTIVE_OPS_API_URL` | When using interactive ops | Yes | Interactive Ops browser base (often `/api`) |
| `NEXT_PUBLIC_FILE_UPLOAD_URL` | For document upload | Yes | Upload endpoint for profile files |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Optional | Yes | reCAPTCHA v2 (password login); test key fallback |
| `AUTH_API_URL` | Production: this or `NEXT_PUBLIC_API_URL` | No | Upstream Auth MS. Also satisfies the production build check |
| `ACTOR_API_URL` | For Actor rewrites | No | Upstream Actor MS |
| `NOTIFICATION_API_URL` | For `/api/notification` rewrites | No | Upstream Notification MS |
| `INTERACTIVE_OPS_API_URL` | Recommended in prod | No | Upstream Interactive Ops (default host in config if unset) |
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
| `pnpm exec nx lint usr` | ESLint |
| `pnpm exec nx test usr` | Jest |
| `pnpm exec nx affected -t lint test build` | Pre-merge checks (add `typecheck` if configured) |

Note: Nx target is **`dev`**, not `serve`, for `usr`.

## Production

Vercel (`vercel-build` → `next build`). Domains, env matrix per environment: TBD.
