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
| `NEXT_PUBLIC_ACTOR_API_URL` | TBD in production | Yes | Actor MS base URL (or rely on `/api` rewrites) |
| ⟨FILL: all others, audit §1⟩ | | | |

Rule: only `NEXT_PUBLIC_*` reaches the browser; every variable is listed in `.env.example`.

## Local setup

⟨FILL: install + run commands, audit §1⟩

## Commands

| Command | What it does |
|---|---|
| `nx serve <app>` | Dev server ⟨FILL: exact⟩ |
| `nx affected -t lint test build` | Pre-merge checks |
| ⟨FILL⟩ | |

## Production

Vercel (`vercel-build`). Domains, env matrix per environment: TBD.
