# Daneshjoam — Frontend Project Audit (AI Setup Context)

Generated: 2025-09-25 (read-only audit).  
Primary app: `apps/usr`. Placeholder apps: `apps/adm`, `apps/bus`.

---

## 1. Snapshot

| Item | Value | Source |
|------|--------|--------|
| Monorepo | Nx 23.0.1 workspace `@daneshjoam/source` | `package.json`, `nx.json` |
| Framework | Next.js ~16.1.6 (App Router) | `package.json`, `apps/usr/package.json` |
| React | ^19.0.0 | `package.json` |
| Rendering | **Hybrid SSR/RSC + client components** (async server pages/layouts; `'use client'` for interactive UI) | e.g. `apps/usr/src/app/layout.tsx`, `apps/usr/src/app/(public)/(site)/private-panel/page.tsx` |
| Bundler | Next.js toolchain (not Vite); Nx runs `next dev` / `next build` | `nx.json` plugin `@nx/next` |
| Package manager | **pnpm** (workspace `apps/*`, `libs/*`) | `pnpm-workspace.yaml`, `.github/workflows/ci.yml` |
| Node version | **20** in CI; no `.nvmrc` in repo | `.github/workflows/ci.yml` |
| TypeScript | ~5.9.2 | `package.json` |
| i18n | `next-intl` ^4.13.1, locale fixed `fa` | `apps/usr/src/i18n.ts`, `apps/usr/package.json` |

### Dependency table (workspace + `apps/usr`)

Dependencies are hoisted at workspace root unless noted. **Purpose** = primary use in this repo.

| Package | Version (declared) | Purpose | Where used |
|---------|-------------------|---------|------------|
| `next` | ~16.1.6 | App framework, routing, SSR | All `apps/*` |
| `react` / `react-dom` | ^19.0.0 | UI | All apps |
| `axios` | ^1.18.1 | HTTP (via `@daneshjoam/api-client`) | `libs/api-client`, `apps/usr` API modules |
| `@tanstack/react-query` | ^5.101.2 | Server-state caching, mutations | `libs/shared-ui`, feature `api/react-query.ts` files |
| `zustand` | ^5.0.14 | Client auth user snapshot | `libs/auth/src/lib/auth-store.ts` |
| `next-intl` | ^4.13.1 | Persian UI strings | `apps/usr` layouts/components |
| `next-themes` | ^0.4.6 | Light/dark class theming | `apps/usr/src/components/theme-provider.tsx` |
| `zod` | ^4.4.3 | Visibility field validation | `apps/usr/.../visibility-validation.ts` |
| `recharts` | ^2.15.4 | Notification charts | `apps/usr/.../notifications/components/charts/*` |
| `class-variance-authority`, `clsx`, `tailwind-merge` | various | shadcn-style UI utilities | `apps/usr/src/components/ui/*`, `apps/usr/src/lib/utils.ts` |
| `lucide-react` | ^1.23.0 | Icons | Throughout `apps/usr` |
| `@radix-ui/react-slot`, `radix-ui` | various | Headless primitives | UI components |
| `shadcn`, `tw-animate-css` | various | Component scaffolding / animation | `apps/usr` UI |
| `@daneshjoam/api-client` | workspace | Axios factory, `ApiError`, mock fallback | `libs/api-client`, HTTP clients |
| `@daneshjoam/auth` | workspace | Session cookie, login/logout server actions | `apps/usr`, `libs/auth` |
| `@daneshjoam/shared-types` | workspace | `User`, `Session` types | Auth, session |
| `@daneshjoam/shared-ui` | workspace | `QueryProvider` | `apps/usr/src/app/layout.tsx` |
| `tailwindcss` | ^4.3.2 (root/adm/bus); **^3.4.19 also in `apps/usr/package.json` devDeps** | Styling | `apps/usr/src/app/globals.css` uses Tailwind v4 `@import "tailwindcss"` |
| `@tailwindcss/postcss` | ^4.3.2 | PostCSS plugin | `apps/usr/postcss.config.js` |
| `nx`, `@nx/*` | 23.0.1 | Monorepo tasks, lint, jest plugin | Workspace |
| `eslint`, `typescript-eslint`, `eslint-config-next` | various | Lint | `eslint.config.mjs`, per-app configs |
| `jest`, `@testing-library/react` | various | Unit tests (minimal) | `apps/usr/specs`, `apps/adm/specs` |
| `@playwright/test`, `@nx/playwright` | various | **Declared; no Playwright project/files found** | `package.json`, CI |
| `prettier` | ~3.6.2 | Formatting | `.prettierrc` |

### Scripts

| Command | What it does |
|---------|----------------|
| Root `package.json` `scripts` | **Empty** `{}` | `package.json` |
| `pnpm exec nx dev usr` | Next dev server (`apps/usr`) | `nx show project usr` |
| `pnpm exec nx build usr` | Production build | same |
| `pnpm exec nx start usr` | `next start` after build | same |
| `pnpm exec nx lint usr` | ESLint in `apps/usr` | same |
| `pnpm exec nx test usr` | Jest in `apps/usr` | same |
| `pnpm run vercel-build` (in `apps/usr`) | `next build` for Vercel | `apps/usr/package.json` |
| CI: `nx run-many -t lint test build typecheck e2e` | Full pipeline | `.github/workflows/ci.yml` |

### TypeScript config

| Setting | Value |
|---------|--------|
| `strict` | `true` | `tsconfig.base.json` |
| Other strictness | `noImplicitReturns`, `noUnusedLocals`, `noFallthroughCasesInSwitch`, `noImplicitOverride` | `tsconfig.base.json` |
| `allowJs` | `true` in `apps/usr` only | `apps/usr/tsconfig.json` |
| Workspace path aliases | `@daneshjoam/api-client`, `@daneshjoam/auth`, `@daneshjoam/shared-types`, `@daneshjoam/shared-ui` | `tsconfig.base.json` |
| App path aliases | `@/*`, `@auth/*`, `@home/*`, `@messages/*`, `@notifications/*`, `@public-panel/*`, `@private-panel/*` | `apps/usr/tsconfig.json` |

### Environment variables (names only)

| Variable | Read in |
|----------|---------|
| `NODE_ENV` | `libs/auth/src/lib/actions.ts` (cookie `secure`) |
| `NEXT_PUBLIC_API_URL` | `apps/usr/src/shared/api/usr-http.ts`, `libs/api-client/src/lib/create-api-client.ts`, `apps/usr/src/app/(public)/(auth)/api/mock.ts` (`isAuthApiMocked`) |
| `NEXT_PUBLIC_ACTOR_API_URL` | `apps/usr/src/shared/api/actor-http.ts`, `private-panel` / `public-panel` `react-query.ts` (`canQueryActor`) |
| `NEXT_PUBLIC_NOTIFICATION_API_URL` | `apps/usr/src/shared/api/notification-http.ts` |
| `NEXT_PUBLIC_INTERACTIVE_OPS_API_URL` | `apps/usr/src/shared/api/interactive-ops-http.ts` |
| `NEXT_PUBLIC_FILE_UPLOAD_URL` | `apps/usr/.../private-panel/api/upload.ts` |
| `AUTH_API_URL` | `apps/usr/next.config.js` rewrites |
| `ACTOR_API_URL` | `apps/usr/next.config.js` rewrites |
| `NOTIFICATION_API_URL` | `apps/usr/next.config.js` rewrites |
| `INTERACTIVE_OPS_API_URL` | `apps/usr/next.config.js` rewrites (default host if unset — see §11) |
| `TEMP_ADMIN_ACCESS_TOKEN` | `apps/usr/src/app/(public)/(auth)/lib/temporary-admin-login.ts` |
| `TEMP_ADMIN_ACCESS_TOKEN` / server-only auth | Dev admin impersonation | same |

---

## 2. Directory Structure

### Tree (depth ≤ 4, excludes `node_modules`, `.git`, `.next`, `dist`, `.pnpm-store`)

```
daneshjoam/
├── .github/workflows/
├── apps/
│   ├── adm/          src/app, src/components, public, specs
│   ├── bus/          src/app, src/components, public
│   └── usr/          messages/, public/, specs/, src/
│       └── src/
│           ├── app/(public)/(auth)| (site)| home/
│           ├── components/   ui, site, panel, auth, icons
│           ├── hooks/
│           ├── lib/
│           └── shared/api/
├── libs/
│   ├── api-client/src/
│   ├── auth/src/
│   ├── shared-types/src/
│   └── shared-ui/src/
├── docs/ai/          (this file)
├── eslint.config.mjs
├── nx.json
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

### Top / second-level responsibilities

| Path | Responsibility |
|------|----------------|
| `apps/usr` | **Main Persian RTL product** — auth, home, profiles, notifications |
| `apps/usr/src/app` | Next.js App Router routes and feature colocated code |
| `apps/usr/src/components` | Shared UI (shadcn-style), site chrome, panel widgets |
| `apps/usr/messages` | `next-intl` message catalogs (`fa.json`) |
| `apps/usr/src/shared/api` | HTTP client instances per microservice |
| `apps/adm` | Placeholder admin Next app (single landing page) |
| `apps/bus` | Placeholder business (ASR) Next app (single landing page) |
| `libs/api-client` | Axios `createApiClient`, `ApiError`, `withMockFallback` |
| `libs/auth` | Cookie session, Zustand user store, server `login`/`logout` |
| `libs/shared-types` | `User`, `Session` |
| `libs/shared-ui` | React Query provider + client defaults |
| `.github/workflows` | CI (pnpm, nx run-many) |

### Structure pattern

**Mixed feature-first + shared layers.**

- **Feature-first (colocated):** `apps/usr/src/app/(public)/(site)/{notifications,private-panel,public-panel}/` each contain `api/`, `components/`, `hooks/`, `types/`, `data/`.
- **Route groups:** `(public)/(auth)`, `(public)/(site)`, `(public)/home` under `app/`.
- **Shared cross-cutting:** `apps/usr/src/components/*`, `libs/*`.
- **Empty placeholder:** `apps/usr/src/features/` exists but has **no files**.

Examples: notifications inbox at `notifications/components/inbox/`; auth API at `(auth)/api/auth.ts`.

---

## 3. Architecture

### Routing (all `apps/usr` pages)

| Route | Page file | Layout chain | Guard / role | SRS / domain notes |
|-------|-----------|--------------|--------------|-------------------|
| `/` | `app/(public)/(site)/page.tsx` → `@home/home-page` | `root` → `(public)` → `(site)` → `SiteShell` | Guest OK | Home / search (mock); **SRV**-like UI, no SRS doc in repo |
| `/cooperation` | `(site)/cooperation/page.tsx` | SiteShell | Guest OK | Static i18n page; **no SRS code in repo** |
| `/login` | `(auth)/login/page.tsx` | `root` → `(public)` → `(auth)` → `AuthFlowClientLayout` | Guest-only layout redirect if session | **USR-Aut** (comments in `auth.ts`) |
| `/login/otp`, `/login/password`, `/login/totp`, `/login/sessions` | matching `page.tsx` under `(auth)/login/` | Auth layout | Guest (except sessions flow) | Auth |
| `/forgot-password`, `/forgot-password/otp`, `/forgot-password/reset` | `(auth)/forgot-password/...` | Auth layout | Guest | Auth |
| `/public-panel` | `(site)/public-panel/page.tsx` | SiteShell | Guest OK (API uses token if present) | **Usr-Prf-6** (visitor profile); catalog cards for Nws/Dsc/Nwl UI |
| `/private-panel` | `(site)/private-panel/page.tsx` | SiteShell | **Middleware:** session required; optional `?actor_id=` admin view | **USR-Prf-2**, **Adm-Prf-2** |
| `/notifications` | `(site)/notifications/page.tsx` | SiteShell | No middleware; **de facto** needs `accessToken` for data | **USR-Ntf** |
| `/notifications/stats` | `(site)/notifications/stats/page.tsx` | SiteShell | Token for API | **Adm-Ntf-6N10** (comment) |
| `/notifications/charts` | `(site)/notifications/charts/page.tsx` | SiteShell | Token for API | **Adm-Ntf-6N11** |
| `/notifications/reports` | `(site)/notifications/reports/page.tsx` | SiteShell | Token for API | **Usr-Ntf-6N5** |
| `/notifications/settings` | `(site)/notifications/settings/page.tsx` | SiteShell | Token for API | **USR-Ntf-5** |
| `/dashboard` | **No `page.tsx` found** | N/A | Listed as protected in middleware | **Broken route** — menu links in `user-profile-menu.tsx` |
| `/register` | Redirect → `/login` | `next.config.js` | — | — |

`apps/adm` → `/` placeholder (`apps/adm/src/app/page.tsx`).  
`apps/bus` → `/` placeholder (`apps/bus/src/app/page.tsx`).

### Layouts and shells

| Shell | File | Used for |
|-------|------|----------|
| Root RTL + fonts + theme + i18n + React Query | `apps/usr/src/app/layout.tsx` | Entire app |
| Public pass-through | `apps/usr/src/app/(public)/layout.tsx` | Route group wrapper |
| Site chrome (header, footer, session keep-alive) | `apps/usr/src/app/(public)/(site)/layout.tsx` → `SiteShell` | Marketing + logged-in site pages |
| Auth chrome (no site header) | `apps/usr/src/app/(public)/(auth)/layout.tsx` | Login / forgot-password |
| Notifications sub-nav | `notifications/components/layout/page-shell.tsx` | Notifications subsection pages |

**Panels:** There is **no separate deployable** admin or ASR app UI; admin flows are embedded in `usr` via `targetActorId` / temporary admin token and notification stats routes.

### Authentication flow

1. **Login/register OTP** → `apps/usr/src/app/(public)/(auth)/api/auth.ts` → `usrHttpClient` → `/auth/*` (rewritten to `AUTH_API_URL`).
2. **Session storage:** httpOnly cookie `session`, base64 JSON `Session` (`libs/auth/src/lib/actions.ts`, `libs/auth/src/lib/session.ts`).
3. **Client refresh:** `SessionKeepAlive` → server action `ensureFreshSession` → `get_token_info` + `refresh_token` (`apps/usr/src/app/(public)/(auth)/lib/auth-actions.ts`).
4. **Logout:** `clearSession` → `actor_logout` + cookie delete.
5. **Guest auth routes:** `(auth)/layout.tsx` redirects to `/public-panel` if `accessToken` present; middleware also redirects authenticated users away from `/login`, `/forgot-password`, `/register` (`apps/usr/src/middleware.ts`).
6. **Mocks:** If `NEXT_PUBLIC_API_URL` unset, `isAuthApiMocked()` uses mocks / `withMockFallback` (`apps/usr/src/app/(public)/(auth)/api/mock.ts`).
7. **Dev admin:** `TEMP_ADMIN_ACCESS_TOKEN` → `loginAsTemporaryAdmin` (`temporary-admin-login.ts`).

### Authorization (Guest / Usr / ASR / Adm)

| Mechanism | Behavior |
|-----------|----------|
| Middleware | Protects `/private-panel` and `/dashboard` by cookie `accessToken` (`middleware.ts` L5–68) |
| Auth layout | Blocks logged-in users from starting guest auth flows |
| `SiteShell` | Derives `userType` `user` vs `admin` from `session.user.id` prefix `User_` or `loginType === 1` (`site-shell.tsx` L17–19) |
| Private panel | `targetActorId` query → admin editing mode (`private-panel/components/view.tsx` L53) |
| Actor APIs | Owner vs admin endpoints (`submit-by-owner` vs `submit-by-admin`, etc.) in `profiles-user.ts` |
| **ASR** | `actor_type` / `profiles_business` / `profiles_individual` supported in public panel; **no dedicated bus app features** |

No centralized RBAC module; role checks are **per-feature** and API-side assumptions.

### Errors, 404, loading

| Concern | Status |
|---------|--------|
| `not-found.tsx` | **Not found** in repo |
| `error.tsx` | **Not found** |
| `loading.tsx` | **Not found** |
| Loading UX | `PanelLoadingOverlay`, `Spinner`, React Query `isFetching` / `placeholderData` |
| Suspense | Used on login page only (`login/page.tsx` L1–9) |
| Lazy loading | **No** `next/dynamic` / `React.lazy` usage found |

---

## 4. Data Layer

### State management

| Layer | Technology | What lives there |
|-------|------------|------------------|
| Server state | TanStack Query v5 | Profiles, notifications, auth mutations, interactive ops |
| Client session | httpOnly cookie + server `getSession` | Tokens, user identity |
| Client UI user | Zustand `useAuthStore` | Optional `user` mirror (minimal usage) |
| Local UI state | `useState` / `useReducer` in large components | Auth forms, comments, filters |
| URL state | `searchParams` | `actor_id`, `actor_type`, `next`, referral codes |

Defaults: `staleTime: 30_000`, `retry: 1`, `refetchOnWindowFocus: false` (`libs/shared-ui/src/lib/query-client.ts`).

### HTTP clients

| Client | File | Base URL | Notes |
|--------|------|----------|-------|
| `usrHttpClient` | `apps/usr/src/shared/api/usr-http.ts` | `NEXT_PUBLIC_API_URL ?? '/api'` | Auth MS |
| `actorHttpClient` | `apps/usr/src/shared/api/actor-http.ts` | `NEXT_PUBLIC_ACTOR_API_URL \|\| '/api'` | Strips `Accept-Language` (Actor MS quirk) |
| `notificationHttpClient` | `notification-http.ts` | `NEXT_PUBLIC_NOTIFICATION_API_URL ?? ''` | Empty base = relative broken unless rewrite |
| `interactiveOpsHttpClient` | `interactive-ops-http.ts` | env or `/api` | Default rewrite in `next.config.js` |
| `createApiClient` | `libs/api-client` | Configurable | Request bearer injection; response → `ApiError` |

**Error normalization:** `{ success, message, errors }` envelope + `assertApiSuccess` / `formatApiResponseError` duplicated per feature (`private-panel/api/http.ts`, `public-panel/api/http.ts`, `notifications/api/errors.ts`, etc.).

**Retry:** React Query `retry: 1` only; no axios retry interceptor.

### Endpoint inventory (summary tables)

**Auth** (`apps/usr/src/app/(public)/(auth)/api/auth.ts`) — types in `(auth)/api/types.ts`

| Method | Path | Defining file | Consumers | REAL / MOCK |
|--------|------|---------------|-----------|-------------|
| POST | `/auth/actor_send_code` | `auth.ts` | Auth forms, mutations | MOCK if no `NEXT_PUBLIC_API_URL`; else REAL |
| POST | `/auth/actor_verify_code` | `auth.ts` | OTP flow | same |
| POST | `/auth/refresh_token` | `auth.ts` | `ensureFreshSession` | same |
| GET | `/auth/get_token_info` | `auth.ts` | Session refresh | same |
| POST | `/auth/actor_send_otp_for_login` | `auth.ts` | Password login | same |
| POST | `/auth/actor_verify_password` | `auth.ts` | Login | same |
| POST | `/auth/actor_login_by_identity_and_password` | `auth.ts` | Login | same |
| GET | `/auth/display_active_sessions` | `auth.ts` | Sessions UI | same |
| GET | `/auth/display_active_sessions_for_limit_reached` | `auth.ts` | Session limit | same |
| PATCH | `/auth/inactive_session_for_limit_reached` | `auth.ts` | Session limit | same |
| PATCH | `/auth/inactive_session` | `auth.ts` | Session mgmt | same |
| POST | `/auth/actor_logout` | `auth.ts` | Logout | REAL (no-op mock) |
| PATCH | `/auth/inactive_session_then_get_token` | `auth.ts` | Session limit login | MOCK path exists |
| GET | `/auth/public_security_questions_content` | `auth.ts` | Forgot password | REAL |
| POST | `/auth/actor_reset_password` | `auth.ts` | Reset | MOCK fallback |
| POST | `/auth/actor_change_password` | `auth.ts` | Change password | REAL |

**Actor / profiles** — `private-panel/api/profiles-*.ts`, `public-panel/api/profiles-*.ts`

| Method | Path (pattern) | Defining file | Consumers | REAL / MOCK |
|--------|----------------|---------------|-----------|-------------|
| GET | `/profiles_base/get_actor_info` | `private-panel/api/profiles-base.ts` | Private panel queries | REAL if Actor MS up; queries **disabled** unless `NEXT_PUBLIC_ACTOR_API_URL` set (see §11) |
| GET/PUT/PATCH/POST | `/profiles_*/*` (owner/admin/visitor/submit/review/change-status) | `profiles-user.ts`, `profiles-base.ts`, `profiles-individual.ts`, `profiles-business.ts` | Public/private panel | REAL |
| GET | `/service_titles/service-title/list-to-all` | `private-panel/api/service-titles.ts` | Service title pickers | REAL |

**Notifications** (`notifications/api/notifications.ts`)

| Method | Path | Consumers | REAL / MOCK |
|--------|------|-----------|-------------|
| GET | `/notification/actor-notifications/last5` | Header panel | REAL (needs token + notification base URL) |
| GET | `/notification/actor-notifications/list` | Inbox | REAL |
| POST | `/notification/actor-notifications/{id}/read` | Inbox | REAL |
| POST | `/notification/actor-notifications/read-all` | Inbox | REAL |
| POST | `/notification/actor-notifications/read-last-5` | Inbox | REAL |
| GET | `/notification/actor-notifications/unread-count` | Header | REAL |
| GET | `/notification/report/detailed_status_report` | Reports | REAL |
| GET | `/notification/report/charts_report` | Charts | REAL |
| GET | `/notification/report/statistics_report` | Stats | REAL |
| GET | `/notification/actor-settings/list` | Settings | REAL |
| POST | `/notification/actor-settings/create` | Settings | REAL |

Settings UI also uses **HARDCODED** category/channel metadata in `notifications/data/settings-mock.ts` merged with API in transformers.

**Interactive ops** (`public-panel/api/interactive-ops.ts`)

| Method | Path | Consumers | REAL / MOCK |
|--------|------|-----------|-------------|
| POST | `/interactive-ops/follow` | Stats bar | REAL |
| GET | `/interactive-ops/follow/followers/` etc. | Stats dialogs | REAL |
| POST | `/interactive-ops/like` | Reactions | REAL |
| GET | `/interactive-ops/like/*` | Stats dialogs | REAL |
| POST | `/interactive-ops/score` | Rating | REAL |
| GET | `/interactive-ops/score/average` | Stats | REAL |
| POST | `/interactive-ops/share` | Share | REAL |

**Home search** — **MOCKED** `apps/usr/src/app/(public)/home/data/search-mock.ts` (no API module).

**Public panel profile** — REAL mapper from Actor MS; **placeholder** `EMPTY_PUBLIC_PANEL` / `MOCK_PUBLIC_PANEL` when loading (`public-panel/data/public-panel-mock.ts`).

**Comments (Msg-like)** — **HARDCODED** initial data from profile mapper; mutations are **client-only state** (`public-panel/components/comments/section.tsx`).

### Types / DTOs

- **Handwritten** TypeScript in feature `types/api.ts` files (notifications types ~490 lines).
- **No OpenAPI codegen** found in repo.
- Shared minimal types: `libs/shared-types` (`User`, `Session` only).

### Caching, pagination, filtering, search

| Pattern | Implementation |
|---------|----------------|
| Pagination | Notifications list: `page` query + `NotificationsPagination`; mobile `useMobilePagedItems` |
| Infinite scroll | `useNotificationsListInfiniteQuery` (`notifications/api/react-query.ts`) |
| Filters | URL-local state → query params (`notifications-filter-data.ts`, inbox `filter-panel.tsx`) |
| Search | Debounced/local query string → API `search` param (notifications); home search **client filter on mock array** |
| Sort | Reports toolbar maps to API ordering (`reports/toolbar.tsx` comment Usr-Ntf-6N5) |

### File upload

| Rule | Location |
|------|----------|
| Max 1 MiB per file, max 5 files | `documents-panel.tsx` L18–19, L88–96 |
| Types: pdf, images | `detectKind` in `documents-panel.tsx` |
| Avatar field 2 MiB | `view-field.tsx` L274 |
| Upload URL | `NEXT_PUBLIC_FILE_UPLOAD_URL` required; else `FILE_UPLOAD_UNAVAILABLE` | `upload.ts`, `use-fields-section-controller.ts` |
| SRS upload error paths | Represented as `errorKey: 'maxSize' \| 'uploadFailed'` on drafts (`types/documents.ts`) |

---

## 5. UI System (from Figma)

### Styling approach

- **Tailwind CSS v4** with `@theme` design tokens in `apps/usr/src/app/globals.css`.
- **shadcn/radix**-style components under `apps/usr/src/components/ui/`.
- **CSS modules:** not used for main app (Nx generator default `style: css` but implementation is Tailwind).
- **Figma references** appear in comments (e.g. notifications pages, auth shell).

### Design tokens

| Token class | Defined in | Notes |
|-------------|------------|-------|
| Color scales (green, primary, info, error, warning, neutral) | `globals.css` `@theme` L12–89 | Figma-aligned naming |
| Semantic (`background`, `foreground`, `surface`, `primary`, …) | `globals.css` L91+ | Light defaults |
| Dark mode | `.dark` overrides in `globals.css` (file continues past L120) | `next-themes` `attribute="class"` |
| Typography | `--font-iran-sans` from `next/font/local` | `layout.tsx` L10–15 |
| Radius, shadows, breakpoints | Tailwind theme extensions in `globals.css` | Custom breakpoints e.g. `min-[834px]` used inline in components |

**Hardcoded colors bypassing tokens:** ~30+ TSX files contain literal `#hex` (grep on `apps/usr/src/**/*.tsx`). Examples: `notifications/components/settings/time-picker.tsx` (12 matches), `public-panel/.../stats-dialogs.tsx` (7), `auth-shell.tsx` (4).

### Theme support

- **Light / dark / system** via `ThemeProvider` (`theme-provider.tsx`) and `ThemeToggle` component.
- Semantic tokens flip under `.dark` in `globals.css`.

### RTL

| Topic | Implementation |
|-------|----------------|
| Document direction | `<html lang="fa" dir="rtl">` (`layout.tsx` L30) |
| Panel pages | Explicit `dir="rtl"` on `<main>` in public/private panel views |
| Logical CSS | Partial; many physical `left`/`right` and `text-start`/`text-end` usages |
| Icons | Lucide; limited mirroring logic |
| Known backend RTL issue | Actor MS + `Accept-Language` → middleware and axios strip header (`middleware.ts` L7–14, `actor-http.ts` L20–27) |
| Jalali calendar header | Sat-first labels documented (`jalali.ts` L20–21) |

### Fonts and Persian digits

- Font: **IRANSansX VF** `apps/usr/public/fonts/IRANSansXVF.ttf`.
- Digits: `toFaDigits`, `formatFaNumber` (`jalali.ts`, `lib/format-fa.ts`); `toLocaleString('fa-IR')`.
- Jalali: **in-house** `apps/usr/src/lib/jalali.ts` (no `moment-jalaali` / `date-fns-jalali`).
- UI: `jalali-date-picker.tsx` component.

### Shared component inventory (selected)

Usage counts are approximate (ripgrep filename references in `apps/usr/src`; inflated for short names). **Dupes flagged.**

| Name | Path | Purpose | Key props / variants | Used-in (approx) | Notes |
|------|------|---------|----------------------|------------------|-------|
| `Button` | `components/ui/button.tsx` | Primary actions | variants via CVA | High (~40 imports) | Standard |
| `Card` | `components/ui/card.tsx` | Surfaces | subcomponents | High | Standard |
| `AppDialog` | `components/ui/app-dialog.tsx` | App-styled modal | — | ~9 | **Near-dup** of `dialog.tsx` |
| `Dialog` | `components/ui/dialog.tsx` | Radix dialog | — | ~18 | **Near-dup** of `app-dialog` |
| `AlertDialog` | `components/ui/alert-dialog.tsx` | Confirmations | — | Low | Used in destructive flows |
| `OutlinedField` / `FloatingInput` / `UnderlineField` | `components/ui/*` | Form fields | — | Medium | **Three field styles** |
| `SearchField` | `components/ui/search-field.tsx` | Search inputs | — | ~6 | |
| `JalaliDatePicker` | `components/ui/jalali-date-picker.tsx` | Date picking | — | ~2 | |
| `Table` | `components/ui/table.tsx` | Tables | — | Notifications, reports | |
| `Tabs` | `components/ui/tabs.tsx` | Tabbed UI | — | Panels, notifications | |
| `Spinner` | `components/ui/spinner.tsx` | Loading | — | Notifications | |
| `SiteHeader` | `components/site/site-header.tsx` | Global nav | auth props | 1 (shell) | Large file (676 lines) |
| `SiteShell` | `components/site/site-shell.tsx` | Layout wrapper | — | 1 | |
| `ProfileHeroCard` | `components/panel/profile-hero-card.tsx` | Profile header | profile object | 2 panels | |
| `EmptyState` | `components/panel/empty-state.tsx` | Empty lists | — | Several | |
| `PanelLoadingOverlay` | `components/panel/panel-loading-overlay.tsx` | Full-page load | `message` | Panels | |
| `AuthShell` | `components/auth/auth-shell.tsx` | Auth layout | aside content | Auth flows | |

### Standard patterns for UI primitives

| Concern | Standard component |
|---------|-------------------|
| Modals | Mix of `AppDialog`, `Dialog`, `AlertDialog`, feature-specific `ops-confirm-dialog.tsx` |
| Toasts | **None** — no sonner/react-hot-toast; inline errors / banners |
| Tables | `ui/table.tsx` + feature tables (`notifications/.../table.tsx`) |
| Filters | `notifications/components/shared/filter-primitives.tsx`, per-page `filter-panel.tsx` |
| Tabs | `ui/tabs.tsx` |
| Pagination | `notifications/components/layout/pagination.tsx` |
| Empty states | `panel/empty-state.tsx` |

---

## 6. Text, i18n, Messages

| Topic | Detail |
|-------|--------|
| i18n system | **next-intl** with single locale `fa` (`i18n.ts` L3–6) |
| Message files | `apps/usr/messages/fa.json` (~1203 lines, 16 top-level namespaces) |
| Server translations | `getTranslations` on cooperation page |
| Client translations | `useTranslations` widespread in panels, auth, notifications, home |

### Hardcoded Persian in components

- **33** `.tsx` files contain Persian Unicode characters (**51** total character-match lines via ripgrep).
- Examples: `private-panel/components/view.tsx` (`کاربر ${actorId}`), `temporary-admin-login.ts` error strings, metadata in `layout.tsx` is English (`Daneshjo`).
- Majority of user-facing copy is in **`fa.json`**; hardcoded Persian is mostly fallbacks, dev labels, or placeholders.

### SRS system messages

- API `message` fields surfaced through `formatApiResponseError` and thrown `Error` messages.
- UI success/error strings predominantly from **`fa.json`** keys (e.g. `privatePanel`, `notifications`, `auth`).
- No separate SRS message catalog in repo (`docs/srs/` **missing**).

---

## 7. Forms and Validation

| Topic | Choice |
|-------|--------|
| Form library | **None** (no `react-hook-form`) |
| Validation library | **Zod** for visibility fields only (`visibility-validation.ts`); otherwise manual validation in controllers |
| Schema location | `private-panel/utils/visibility-validation.ts`, field defs in `data/visibility-config.ts` |

### Patterns

| Pattern | Implementation |
|---------|----------------|
| Required fields | Zod `.min(1)` + error keys; manual checks in `use-fields-section-controller.ts` |
| Server-side errors | API `errors` map → `formatApiResponseError` → UI alerts (`role="alert"`) |
| Duplicate name | **UNKNOWN** SRS-specific handling not found |
| Multi-tab forms | `PrivatePanelTabs` + per-tab submit endpoints (`submit-by-owner` tab vs state) |
| Approve/reject with reason | `review-pending-list.tsx`, `review-by-admin` / `review-by-owner` API pairs |
| Confirm modals | `ops-confirm-dialog.tsx`, `AlertDialog` |

Auth forms (`auth-forms.tsx`, ~906 lines) use local state + imperative API calls.

---

## 8. SRS Feature Map

SRS source: `docs/srs/README.md`, `docs/srs/path-index.md` (~557 path codes). Glossary, code format, and known SRS code corrections are in the README **Known issues** section.

Status legend: **DONE** = SRS operation implemented end-to-end with real backend integration; **PARTIAL** = subset of operation or mock/generic substitute; **UI-ONLY** = screen/widget without service API; **MISSING** = no matching frontend.

### SRV — general service pages

| Feature code | Path code | Feature name | Status | Files | Notes |
|--------------|-----------|--------------|--------|-------|-------|
| Act(SRV)-503 | Usr(Rfl)-503N1 | نمايش صفحه شرايط ما سرويس | MISSING | — | نمايش صفحه شرايط ما ویژه سرویس دعوت از دوستان. Terms/help pages not implemented. |
| Act(SRV)-503 | ASR(Rfl)-503N1 | نمايش صفحه شرايط ما سرويس | MISSING | — | نمايش صفحه شرايط ما ویژه سرویس دعوت از دوستان. Terms/help pages not implemented. |
| Act(SRV)-503 | Adm(Rfl)-503N1 | نمايش صفحه شرايط ما سرويس | MISSING | — | نمايش صفحه شرايط ما ویژه سرویس دعوت از دوستان. Terms/help pages not implemented. |
| Act(SRV)-503 | Usr(Bus)-503N2 | نمايش صفحه شرايط ما سرويس | MISSING | — | نمايش صفحه شرايط ما ویژه سرویس تخفیف کالا و خدمات. Terms/help pages not implemented. |
| Act(SRV)-503 | ASR(Bus)-503N2 | نمايش صفحه شرايط ما سرويس | MISSING | — | نمايش صفحه شرايط ما ویژه سرویس تخفیف کالا و خدمات. Terms/help pages not implemented. |
| Act(SRV)-503 | Adm(Bus)-503N2 | نمايش صفحه شرايط ما سرويس | MISSING | — | نمايش صفحه شرايط ما ویژه سرویس تخفیف کالا و خدمات. Terms/help pages not implemented. |
| Act(SRV)-504 | Usr(Rfl)-504N1 | نمايش صفحه راهنما سرويس | MISSING | — | نمايش صفحه راهنما ما ویژه سرویس دعوت از دوستان. Terms/help pages not implemented. |
| Act(SRV)-504 | ASR(Rfl)-504N1 | نمايش صفحه راهنما سرويس | MISSING | — | نمايش صفحه راهنما ما ویژه سرویس دعوت از دوستان. Terms/help pages not implemented. |
| Act(SRV)-504 | Adm(Rfl)-504N1 | نمايش صفحه راهنما سرويس | MISSING | — | نمايش صفحه راهنما ما ویژه سرویس دعوت از دوستان. Terms/help pages not implemented. |
| Act(SRV)-504 | Usr(Bus)-504N2 | نمايش صفحه راهنما سرويس | MISSING | — | نمايش صفحه راهنما ویژه سرویس تخفیف کالا و خدمات. Terms/help pages not implemented. |
| Act(SRV)-504 | ASR(Bus)-504N2 | نمايش صفحه راهنما سرويس | MISSING | — | نمايش صفحه راهنما ویژه سرویس تخفیف کالا و خدمات. Terms/help pages not implemented. |
| Act(SRV)-504 | Adm(Bus)-504N2 | نمايش صفحه راهنما سرويس | MISSING | — | نمايش صفحه راهنما ویژه سرویس تخفیف کالا و خدمات. Terms/help pages not implemented. |
| Act(SRV)-505 | Usr(Bus)-505N1 | مشاهده عملگرهای ارائه کننده سرویس | PARTIAL | apps/usr/src/app/(public)/home/data/search-mock.ts, home-search-results.tsx | مشاهده کسب و کارهای ارائه کننده تخفیف. Mock list; SRS requires DB-backed providers/products. |
| Act(SRV)-505 | Usr(Bus)-505N2 | مشاهده عملگرهای ارائه کننده سرویس | PARTIAL | home-search-filter-bar.tsx, search-mock.ts | فیلتر گذاری. Client-side filters on mock data. |
| Act(SRV)-505 | Usr(Bus)-505N3 | مشاهده عملگرهای ارائه کننده سرویس | PARTIAL | home-search-sort-menu.tsx, search-mock.ts | مرتب سازی. Client-side sort on mock data. |
| Act(SRV)-505 | Usr(Bus)-505N4 | مشاهده عملگرهای ارائه کننده سرویس | MISSING | — | انتخاب کشور/ شهر /محله. Geo selector (country/city/neighborhood) not built. |
| Act(SRV)-501 | Usr(Bus)-505N1 | مشاهده عملگرهای ارائه کننده سرویس | PARTIAL | apps/usr/src/app/(public)/home/data/search-mock.ts, home-search-results.tsx | مشاهده کسب و کارهای ارائه کننده تخفیف. Mock list; SRS requires DB-backed providers/products. SRS detail typo `Act(SRV)-501`; summary uses `505`/`506` (README). |
| Act(SRV)-501 | Usr(Bus)-505N2 | مشاهده عملگرهای ارائه کننده سرویس | PARTIAL | home-search-filter-bar.tsx, search-mock.ts | فیلتر گذاری. Client-side filters on mock data. SRS detail typo `Act(SRV)-501`; summary uses `505`/`506` (README). |
| Act(SRV)-501 | Usr(Bus)-505N3 | مشاهده عملگرهای ارائه کننده سرویس | PARTIAL | home-search-sort-menu.tsx, search-mock.ts | مرتب سازی. Client-side sort on mock data. SRS detail typo `Act(SRV)-501`; summary uses `505`/`506` (README). |
| Act(SRV)-501 | Usr(Bus)-505N4 | مشاهده عملگرهای ارائه کننده سرویس | MISSING | — | انتخاب کشور/ شهر /محله. Geo selector (country/city/neighborhood) not built. |
| Act(SRV)-506 | Usr(Bus)-506N1 | مشاهده محصولات ارائه شده | PARTIAL | apps/usr/src/app/(public)/home/data/search-mock.ts, home-search-results.tsx | مشاهده محصولات ارائه شده تخفیف دار. Mock list; SRS requires DB-backed providers/products. |
| Act(SRV)-506 | Usr(Bus)-506N2 | مشاهده محصولات ارائه شده | PARTIAL | home-search-filter-bar.tsx, search-mock.ts | فیلتر گذاری. Client-side filters on mock data. |
| Act(SRV)-506 | Usr(Bus)-506N3 | مشاهده محصولات ارائه شده | PARTIAL | home-search-sort-menu.tsx, search-mock.ts | مرتب سازی. Client-side sort on mock data. |
| Act(SRV)-506 | Usr(Bus)-506N4 | مشاهده محصولات ارائه شده | MISSING | — | انتخاب کشور/ شهر /محله. Geo selector (country/city/neighborhood) not built. |
| Usr(SRV)-522 | Adm-Usr(SRV)-522N1 | مشاهده سرویس های کاربر | MISSING | — | مشاهده سرویس های کاربر. Admin user-service list / service-operation approval not in `apps/usr`. |
| Usr(SRV)-522 | Act-Usr(SRV)-522N1 | مشاهده سرویس های کاربر | MISSING | — | مشاهده سرویس های کاربر. Admin user-service list / service-operation approval not in `apps/usr`. |
| Usr(SRV)-522 | Adm-Usr(SRV)-522N2 | مشاهده سرویس های کاربر | MISSING | — | مشاهده جزئیات سرویس. Admin user-service list / service-operation approval not in `apps/usr`. |
| Usr(SRV)-522 | Act-Usr(SRV)-522N2 | مشاهده سرویس های کاربر | MISSING | — | مشاهده جزئیات سرویس. Admin user-service list / service-operation approval not in `apps/usr`. |
| Usr(SRV)-522 | Adm-Usr(SRV)-522N3 | مشاهده سرویس های کاربر | MISSING | — | فیلتر گذاری. Admin user-service list / service-operation approval not in `apps/usr`. |
| Usr(SRV)-522 | Act-Usr(SRV)-522N3 | مشاهده سرویس های کاربر | MISSING | — | فیلتر گذاری. Admin user-service list / service-operation approval not in `apps/usr`. |
| Usr(SRV)-522 | Adm-Usr(SRV)-522N4 | مشاهده سرویس های کاربر | MISSING | — | مرتب سازی. Admin user-service list / service-operation approval not in `apps/usr`. |
| Usr(SRV)-522 | Act-Usr(SRV)-522N4 | مشاهده سرویس های کاربر | MISSING | — | مرتب سازی. Admin user-service list / service-operation approval not in `apps/usr`. |
| Act(SRV)-525 | Adm-Act(SRV)-525N1 | مشاهده/تایید/ رد عملیات سرویس ها | MISSING | — | مشاهده/تاييد/رد فهرست سرويس هاي ايجاد شده توسط عملگر. Admin user-service list / service-operation approval not in `apps/usr`. |
| Act(SRV)-525 | Adm-Act(SRV)-525N2 | مشاهده/تایید/ رد عملیات سرویس ها | MISSING | — | مشاهده/تاييد/رد فهرست سرويس هاي حذف شده توسط عملگر. Admin user-service list / service-operation approval not in `apps/usr`. |
| Act(SRV)-525 | Adm-Act(SRV)-525N3 | مشاهده/تایید/ رد عملیات سرویس ها | MISSING | — | مشاهده/تاييد/رد فهرست سرويس هاي ويرايش شده توسط عملگر. Admin user-service list / service-operation approval not in `apps/usr`. |

**Summary (SRV):** DONE 0, PARTIAL 9, UI-ONLY 0, MISSING 26 (total 35).

### Rwd — rewards

| Feature code | Path code | Feature name | Status | Files | Notes |
|--------------|-----------|--------------|--------|-------|-------|
| Rwd-1 | Adm-Rwd-1N1 | نمایش پاداش کاربران | MISSING | — | مشاهده فهرست پاداش کاربر. Rewards UI/API absent. |
| Rwd-1 | Usr-Rwd-1N1 | نمایش پاداش کاربران | MISSING | — | مشاهده فهرست پاداش کاربر. Rewards UI/API absent. |
| Rwd-1 | Adm-Rwd-1N2 | نمایش پاداش کاربران | MISSING | — | جستجو. Rewards UI/API absent. |
| Rwd-1 | Usr-Rwd-1N2 | نمایش پاداش کاربران | MISSING | — | جستجو. Rewards UI/API absent. |
| Rwd-1 | Adm-Rwd-1N3 | نمایش پاداش کاربران | MISSING | — | فیلترگذاری. Rewards UI/API absent. |
| Rwd-1 | Usr-Rwd-1N3 | نمایش پاداش کاربران | MISSING | — | فیلترگذاری. Rewards UI/API absent. |
| Rwd-1 | Adm-Rwd-1N4 | نمایش پاداش کاربران | MISSING | — | مرتب‌سازی. Rewards UI/API absent. |
| Rwd-1 | Usr-Rwd-1N4 | نمایش پاداش کاربران | MISSING | — | مرتب‌سازی. Rewards UI/API absent. |
| Rwd-2 | Usr-Rwd-2N1 | عملیات تعریف و ثبت تعامل | MISSING | — | دریافت و ثبت تعامل. Rewards UI/API absent. |
| Rwd-2 | Usr-Rwd-2E1 | عملیات تعریف و ثبت تعامل | MISSING | — | خطای عدم دسترسی کاربر میهمان. Declared without detail block (README). |
| Rwd-2 | Sys-Rwd-2N2 | عملیات تعریف و ثبت تعامل | MISSING | — | محاسبه پاداش. Rewards UI/API absent. |
| Rwd-2 | Adm-Rwd-3N1 | مدیریت موضوعات مشمول پاداش | MISSING | — | مشاهده موضوعات مشمول پاداش. Rewards UI/API absent. |
| Rwd-2 | Adm-Rwd-3N2 | مدیریت موضوعات مشمول پاداش | MISSING | — | جستجو در موضوعات مشمول پاداش. Rewards UI/API absent. |
| Rwd-2 | Adm-Rwd-3N3 | مدیریت موضوعات مشمول پاداش | MISSING | — | فیلترگذاری فهرست موضوعات مشمول پاداش. Rewards UI/API absent. |
| Rwd-2 | Adm-Rwd-3N4 | مدیریت موضوعات مشمول پاداش | MISSING | — | مرتب‌سازی فهرست موضوعات مشمول پاداش. Rewards UI/API absent. |
| Rwd-2 | Adm-Rwd-3N5 | مدیریت موضوعات مشمول پاداش | MISSING | — | افزودن موضوع مشمول پاداش. Rewards UI/API absent. |
| Rwd-2 | Adm-Rwd-3N6 | مدیریت موضوعات مشمول پاداش | MISSING | — | ویرایش موضوع مشمول پاداش. Rewards UI/API absent. |
| Rwd-2 | Adm-Rwd-3N7 | مدیریت موضوعات مشمول پاداش | MISSING | — | حذف موضوع مشمول پاداش. Rewards UI/API absent. |
| Rwd-2 | Adm-Rwd-3N8 | مدیریت موضوعات مشمول پاداش | MISSING | — | بازگردانی موضوع مشمول پاداش. Rewards UI/API absent. |
| Rwd-4 | Adm-Rwd-4N1 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده گزارش تعاملات دریافت شده توسط راهبر. Rewards UI/API absent. |
| Rwd-4 | Usr-Rwd-4N2 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده گزارش تعاملات دریافت شده توسط کاربر. Rewards UI/API absent. SRS detail tables use `Adm-Rwd-4N*`; summary correctly lists user paths (README). |
| Rwd-4 | Adm-Rwd-4N3 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده گزارش پاداش‌های محاسبه شده توسط راهبر. Rewards UI/API absent. |
| Rwd-4 | Usr-Rwd-4N4 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده گزارش پاداش‌های محاسبه شده توسط کاربر. Rewards UI/API absent. SRS detail tables use `Adm-Rwd-4N*`; summary correctly lists user paths (README). |
| Rwd-4 | Adm-Rwd-4N5 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده آمارها توسط راهبر. Rewards UI/API absent. |
| Rwd-4 | Usr-Rwd-4N6 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده آمارها توسط کاربر. Rewards UI/API absent. SRS detail tables use `Adm-Rwd-4N*`; summary correctly lists user paths (README). |
| Rwd-4 | Adm-Rwd-4N7 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده نمودارها. Rewards UI/API absent. |

**Summary (Rwd):** DONE 0, PARTIAL 0, UI-ONLY 0, MISSING 26 (total 26).

### Dsc — discount on goods & services

| Feature code | Path code | Feature name | Status | Files | Notes |
|--------------|-----------|--------------|--------|-------|-------|
| Dsc-1 | Adm-Dsc-1N1 | مشاهده محصولات | MISSING | — | مشاهده محصولات در صفحه نخست سرویس. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | ASR-Dsc-1N1 | مشاهده محصولات | MISSING | — | مشاهده محصولات در صفحه نخست سرویس. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | Usr-Dsc-1N1 | مشاهده محصولات | UI-ONLY | apps/usr/src/app/(public)/home/*, discount-offer-card.tsx | مشاهده محصولات در صفحه نخست سرویس. Home/mock discovery; no Discount MS. |
| Dsc-1 | Usr-Dsc-1E1 | مشاهده محصولات | MISSING | — | خطای عدم دسترسی کاربر میهمان. Guest-access error not implemented. |
| Dsc-1 | Adm-Dsc-1N2 | مشاهده محصولات | MISSING | — | مشاهده فهرست همه محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | ASR-Dsc-1N2 | مشاهده محصولات | MISSING | — | مشاهده فهرست همه محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | Usr-Dsc-1N2 | مشاهده محصولات | UI-ONLY | apps/usr/src/app/(public)/home/*, discount-offer-card.tsx | مشاهده فهرست همه محصولات. Home/mock discovery; no Discount MS. |
| Dsc-1 | ASR-Dsc-1N3 | مشاهده محصولات | MISSING | — | مشاهده محصولات در پنل عملیاتی. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | Adm-Dsc-1N4 | مشاهده محصولات | MISSING | — | مشاهده محصولات در پنل راهبری. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | Adm-Dsc-1N5 | مشاهده محصولات | MISSING | — | جستجو در فهرست محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | ASR-Dsc-1N5 | مشاهده محصولات | MISSING | — | جستجو در فهرست محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | Adm-Dsc-1N6 | مشاهده محصولات | MISSING | — | فیلتر گذاری فهرست محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | ASR-Dsc-1N6 | مشاهده محصولات | MISSING | — | فیلتر گذاری فهرست محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | Adm-Dsc-1N7 | مشاهده محصولات | MISSING | — | مرتب سازی فهرست محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | ASR-Dsc-1N7 | مشاهده محصولات | MISSING | — | مرتب سازی فهرست محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | Usr-Dsc-1N8 | مشاهده محصولات | UI-ONLY | public-panel/components/catalog/discount-offer-card.tsx | مشاهده جزئیات محصول توسط کاربر. Profile catalog card; not full product detail. |
| Dsc-1 | Adm-Dsc-1N9 | مشاهده محصولات | MISSING | — | مشاهده جزئیات محصول توسط راهبر/ سرویس‌دهنده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | ASR-Dsc-1N9 | مشاهده محصولات | MISSING | — | مشاهده جزئیات محصول توسط راهبر/ سرویس‌دهنده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | Adm-Dsc-1N10 | مشاهده محصولات | MISSING | — | مشاهده محصولات آرشیو شده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-1 | ASR-Dsc-1N10 | مشاهده محصولات | MISSING | — | مشاهده محصولات آرشیو شده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-1N1 | عملیات محصول | MISSING | — | مشاهده محصولات در صفحه نخست سرویس. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-1N1 | عملیات محصول | MISSING | — | مشاهده محصولات در صفحه نخست سرویس. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Usr-Dsc-1N1 | عملیات محصول | MISSING | — | مشاهده محصولات در صفحه نخست سرویس. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Usr-Dsc-1E1 | عملیات محصول | MISSING | — | خطای عدم دسترسی کاربر میهمان. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-1N2 | عملیات محصول | MISSING | — | مشاهده فهرست همه محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-1N2 | عملیات محصول | MISSING | — | مشاهده فهرست همه محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Usr-Dsc-1N2 | عملیات محصول | MISSING | — | مشاهده فهرست همه محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-1N3 | عملیات محصول | MISSING | — | مشاهده محصولات در پنل عملیاتی. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-1N4 | عملیات محصول | MISSING | — | مشاهده محصولات در پنل راهبری. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-1N5 | عملیات محصول | MISSING | — | جستجو در فهرست محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-1N5 | عملیات محصول | MISSING | — | جستجو در فهرست محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-1N6 | عملیات محصول | MISSING | — | فیلتر گذاری فهرست محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-1N6 | عملیات محصول | MISSING | — | فیلتر گذاری فهرست محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-1N7 | عملیات محصول | MISSING | — | مرتب سازی فهرست محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-1N7 | عملیات محصول | MISSING | — | مرتب سازی فهرست محصولات. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Usr-Dsc-1N8 | عملیات محصول | MISSING | — | مشاهده جزئیات محصول توسط کاربر. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-1N9 | عملیات محصول | MISSING | — | مشاهده جزئیات محصول توسط راهبر/ سرویس‌دهنده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-1N9 | عملیات محصول | MISSING | — | مشاهده جزئیات محصول توسط راهبر/ سرویس‌دهنده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-1N10 | عملیات محصول | MISSING | — | مشاهده محصولات آرشیو شده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-1N10 | عملیات محصول | MISSING | — | مشاهده محصولات آرشیو شده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2N1 | عملیات محصول | MISSING | — | ایجاد محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2N1 | عملیات محصول | MISSING | — | ایجاد محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2E1 | عملیات محصول | MISSING | — | خطای عدم تکمیل فیلدهای اجباری. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2E1 | عملیات محصول | MISSING | — | خطای عدم تکمیل فیلدهای اجباری. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2N2 | عملیات محصول | MISSING | — | تایید انتشار محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2E2 | عملیات محصول | PARTIAL | private-panel/.../documents-panel.tsx, view-field.tsx | خطای بارگذاری فایل تصویر با فرمت نامناسب. Upload size/type checks exist for profile docs; not Dsc product images. |
| Dsc-2 | ASR-Dsc-2E2 | عملیات محصول | PARTIAL | private-panel/.../documents-panel.tsx, view-field.tsx | خطای بارگذاری فایل تصویر با فرمت نامناسب. Upload size/type checks exist for profile docs; not Dsc product images. |
| Dsc-2 | Adm-Dsc-2N3 | عملیات محصول | MISSING | — | لغو انتشار محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2E3 | عملیات محصول | PARTIAL | private-panel/.../documents-panel.tsx, view-field.tsx | خطای بارگذاری فایل تصویر با حجم نامناسب. Upload size/type checks exist for profile docs; not Dsc product images. |
| Dsc-2 | ASR-Dsc-2E3 | عملیات محصول | PARTIAL | private-panel/.../documents-panel.tsx, view-field.tsx | خطای بارگذاری فایل تصویر با حجم نامناسب. Upload size/type checks exist for profile docs; not Dsc product images. |
| Dsc-2 | Adm-Dsc-2N4 | عملیات محصول | MISSING | — | ویرایش اطلاعات محصول رد/ پایان/ در انتظار انتشار. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2N4 | عملیات محصول | MISSING | — | ویرایش اطلاعات محصول رد/ پایان/ در انتظار انتشار. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2E4 | عملیات محصول | MISSING | — | خطای تعریف عنوان محصول تکراری برای یک کسب و کار. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2E4 | عملیات محصول | MISSING | — | خطای تعریف عنوان محصول تکراری برای یک کسب و کار. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2N5 | عملیات محصول | MISSING | — | ویرایش اطلاعات محصول تایید/ منتشر شده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2N5 | عملیات محصول | MISSING | — | ویرایش اطلاعات محصول تایید/ منتشر شده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2E5 | عملیات محصول | MISSING | — | خطای عدم تطابق زبان سایت و زبان سیستم. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2E5 | عملیات محصول | MISSING | — | خطای عدم تطابق زبان سایت و زبان سیستم. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2N6 | عملیات محصول | MISSING | — | تایید/ رد ویرایش محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2N6 | عملیات محصول | MISSING | — | تایید/ رد ویرایش محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2N7 | عملیات محصول | MISSING | — | حذف محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2N7 | عملیات محصول | MISSING | — | حذف محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2N8 | عملیات محصول | MISSING | — | بازگردانی محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2N8 | عملیات محصول | MISSING | — | بازگردانی محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2N9 | عملیات محصول | MISSING | — | درخواست حذف محصول. No detail block in SRS (README). |
| Dsc-2 | ASR-Dsc-2N10 | عملیات محصول | MISSING | — | درخواست بازگردانی محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2N11 | عملیات محصول | MISSING | — | آرشیو محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2N11 | عملیات محصول | MISSING | — | آرشیو محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2N12 | عملیات محصول | MISSING | — | لغو آرشیو محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2N12 | عملیات محصول | MISSING | — | لغو آرشیو محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | Adm-Dsc-2N13 | عملیات محصول | MISSING | — | کپی محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2N13 | عملیات محصول | MISSING | — | کپی محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-2 | ASR-Dsc-2N14 | عملیات محصول | MISSING | — | درخواست اتشار محصول. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | ASR-Dsc-3N1 | عملیات برگه تخفیف | MISSING | — | مشاهده برگه تخفیف‌. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | Adm-Dsc-3N1 | عملیات برگه تخفیف | MISSING | — | مشاهده برگه تخفیف‌. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | Usr-Dsc-3E2 | عملیات برگه تخفیف | MISSING | — | خطای دریافت برگه تخفیف خصوصی. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | ASR-Dsc-3N2 | عملیات برگه تخفیف | MISSING | — | ایجاد کد تخفیف خصوصی از طریق فایل. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | Adm-Dsc-3N2 | عملیات برگه تخفیف | MISSING | — | ایجاد کد تخفیف خصوصی از طریق فایل. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | Adm-Dsc-3E3 | عملیات برگه تخفیف | MISSING | — | خطای حذف برگه تخفیف استفاده شده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | ASR-Dsc-3E3 | عملیات برگه تخفیف | MISSING | — | خطای حذف برگه تخفیف استفاده شده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | ASR-Dsc-3N3 | عملیات برگه تخفیف | MISSING | — | ایجاد کد تخفیف خصوصی به صورت خودکار. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | Adm-Dsc-3N3 | عملیات برگه تخفیف | MISSING | — | ایجاد کد تخفیف خصوصی به صورت خودکار. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | Adm-Dsc-3E4 | عملیات برگه تخفیف | MISSING | — | خطای ثبت کد تخفیف تکراری. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | ASR-Dsc-3E4 | عملیات برگه تخفیف | MISSING | — | خطای ثبت کد تخفیف تکراری. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | ASR-Dsc-3N4 | عملیات برگه تخفیف | MISSING | — | ایجاد کد تخفیف عمومی به صورت دستی. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | Adm-Dsc-3N4 | عملیات برگه تخفیف | MISSING | — | ایجاد کد تخفیف عمومی به صورت دستی. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | ASR-Dsc-3N8 | عملیات برگه تخفیف | MISSING | — | حذف برگه تخفیف. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | Adm-Dsc-3N8 | عملیات برگه تخفیف | MISSING | — | حذف برگه تخفیف. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | ASR-Dsc-3N9 | عملیات برگه تخفیف | MISSING | — | بازگردانی برگه تخفیف. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | Adm-Dsc-3N9 | عملیات برگه تخفیف | MISSING | — | بازگردانی برگه تخفیف. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | Usr-Dsc-3N10 | عملیات برگه تخفیف | MISSING | — | دریافت برگه تخفیف. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | ASR-Dsc-3N11 | عملیات برگه تخفیف | MISSING | — | ایجاد کد تخفیف عمومی به صورت خودکار. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-3 | Adm-Dsc-3N11 | عملیات برگه تخفیف | MISSING | — | ایجاد کد تخفیف عمومی به صورت خودکار. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | ASR-Dsc-4N1 | عملیات رسید پرداخت | MISSING | — | مشاهده رسید پرداخت. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | Adm-Dsc-4N1 | عملیات رسید پرداخت | MISSING | — | مشاهده رسید پرداخت. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | Usr-Dsc-4E2 | عملیات رسید پرداخت | MISSING | — | خطای دریافت رسید پرداخت. SRS pending-decision / undeclared-detail paths (README). |
| Dsc-4 | ASR-Dsc-4N2 | عملیات رسید پرداخت | MISSING | — | ایجاد کد تخفیف خصوصی از طریق فایل. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | Adm-Dsc-4N2 | عملیات رسید پرداخت | MISSING | — | ایجاد کد تخفیف خصوصی از طریق فایل. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | Adm-Dsc-4E2 | عملیات رسید پرداخت | MISSING | — | خطای حذف رسید پرداخت استفاده شده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | ASR-Dsc-4E2 | عملیات رسید پرداخت | MISSING | — | خطای حذف رسید پرداخت استفاده شده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | ASR-Dsc-4N3 | عملیات رسید پرداخت | MISSING | — | ایجاد کد تخفیف خصوصی به صورت خودکار. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | Adm-Dsc-4N3 | عملیات رسید پرداخت | MISSING | — | ایجاد کد تخفیف خصوصی به صورت خودکار. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | Adm-Dsc-4E3 | عملیات رسید پرداخت | MISSING | — | خطای ثبت کد تخفیف تکراری. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | ASR-Dsc-4E3 | عملیات رسید پرداخت | MISSING | — | خطای ثبت کد تخفیف تکراری. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | ASR-Dsc-4N4 | عملیات رسید پرداخت | MISSING | — | ایجاد کد تخفیف عمومی. SRS pending-decision / undeclared-detail paths (README). |
| Dsc-4 | Adm-Dsc-4N4 | عملیات رسید پرداخت | MISSING | — | ایجاد کد تخفیف عمومی. SRS pending-decision / undeclared-detail paths (README). |
| Dsc-4 | Adm-Dsc-4N5 | عملیات رسید پرداخت | MISSING | — | تایید رسید پرداخت. SRS pending-decision / undeclared-detail paths (README). |
| Dsc-4 | Adm-Dsc-4N6 | عملیات رسید پرداخت | MISSING | — | رد رسید پرداخت. SRS pending-decision / undeclared-detail paths (README). |
| Dsc-4 | ASR-Dsc-4N7 | عملیات رسید پرداخت | MISSING | — | ویرایش رسید پرداخت. SRS pending-decision / undeclared-detail paths (README). |
| Dsc-4 | Adm-Dsc-4N7 | عملیات رسید پرداخت | MISSING | — | ویرایش رسید پرداخت. SRS pending-decision / undeclared-detail paths (README). |
| Dsc-4 | ASR-Dsc-4N8 | عملیات رسید پرداخت | MISSING | — | حذف رسید پرداخت. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | Adm-Dsc-4N8 | عملیات رسید پرداخت | MISSING | — | حذف رسید پرداخت. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | ASR-Dsc-4N9 | عملیات رسید پرداخت | MISSING | — | بازگردانی رسید پرداخت. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | Adm-Dsc-4N9 | عملیات رسید پرداخت | MISSING | — | بازگردانی رسید پرداخت. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | Usr-Dsc-4N10 | عملیات رسید پرداخت | MISSING | — | دریافت رسید پرداخت. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-4 | Usr-Dsc-4E1 | عملیات رسید پرداخت | MISSING | — | خطای دریافت رسید پرداخت. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-5 | Adm-Dsc-5N1 | مدیریت دسته‌بندی‌ها | MISSING | — | مشاهده دسته‌بندی‌ها. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-5 | Adm-Dsc-5E1 | مدیریت دسته‌بندی‌ها | MISSING | — | خطای حذف دسته‌بندی اصلی دارای دسته‌بندی فرعی. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-5 | Adm-Dsc-5N2 | مدیریت دسته‌بندی‌ها | MISSING | — | جستجوی دسته‌بندی. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-5 | Adm-Dsc-5E2 | مدیریت دسته‌بندی‌ها | MISSING | — | خطای دسته‌بندی اصلی تکراری. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-5 | Adm-Dsc-5N3 | مدیریت دسته‌بندی‌ها | MISSING | — | افزودن دسته‌بندی اصلی. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-5 | Adm-Dsc-5E3 | مدیریت دسته‌بندی‌ها | MISSING | — | خطای دسته‌بندی فرعی تکراری. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-5 | Adm-Dsc-5N4 | مدیریت دسته‌بندی‌ها | MISSING | — | افزودن دسته‌بندی فرعی. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-5 | Adm-Dsc-5N5 | مدیریت دسته‌بندی‌ها | MISSING | — | ویرایش دسته‌بندی اصلی. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-5 | Adm-Dsc-5N6 | مدیریت دسته‌بندی‌ها | MISSING | — | ویرایش دسته‌بندی فرعی. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-5 | Adm-Dsc-5N7 | مدیریت دسته‌بندی‌ها | MISSING | — | حذف دسته‌بندی اصلی. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-5 | Adm-Dsc-5N8 | مدیریت دسته‌بندی‌ها | MISSING | — | حذف دسته‌بندی فرعی. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-5 | Adm-Dsc-5N9 | مدیریت دسته‌بندی‌ها | MISSING | — | بازگردانی دسته‌بندی اصلی. No detail block in SRS (README). |
| Dsc-5 | Adm-Dsc-5N10 | مدیریت دسته‌بندی‌ها | MISSING | — | بازگردانی دسته‌بندی فرعی. No detail block in SRS (README). |
| Dsc-6 | Adm-Dsc-6N1 | مدیریت دلایل لغو انتشار | MISSING | — | مشاهده فهرست دلایل لغو. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-6 | Adm-Dsc-6E1 | مدیریت دلایل لغو انتشار | MISSING | — | خطای حذف دلایل استفاده شده. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-6 | Adm-Dsc-6N2 | مدیریت دلایل لغو انتشار | MISSING | — | جستجوی دلیل لغو. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-6 | Adm-Dsc-6N3 | مدیریت دلایل لغو انتشار | MISSING | — | افزودن دلیل. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-6 | Adm-Dsc-6N4 | مدیریت دلایل لغو انتشار | MISSING | — | ویرایش دلیل. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-6 | Adm-Dsc-6N5 | مدیریت دلایل لغو انتشار | MISSING | — | حذف دلیل. Discount admin/ASR flows and APIs not in frontend. |
| Dsc-6 | Adm-Dsc-6N6 | مدیریت دلایل لغو انتشار | MISSING | — | بازگردانی دلیل. Discount admin/ASR flows and APIs not in frontend. |

**Summary (Dsc):** DONE 0, PARTIAL 4, UI-ONLY 3, MISSING 129 (total 136).

### Rfl — invite friends

| Feature code | Path code | Feature name | Status | Files | Notes |
|--------------|-----------|--------------|--------|-------|-------|
| Rfl-1 | Usr-Rfl-1N1 | عملیات ایجاد لینک دعوت از دوستان | PARTIAL | apps/usr/src/app/(public)/(auth)/login/login-form.tsx, (auth)/api/auth.ts | ایجاد لینک دعوت. Referral query on auth only. |
| Rfl-1 | Usr-Rfl-1E1 | عملیات ایجاد لینک دعوت از دوستان | PARTIAL | middleware.ts, (auth)/layout.tsx | خطاي اقدام به ایجاد لينك دعوت براي کاربر مهمان. Session gates; not Rfl-specific guest error copy. |
| Rfl-1 | Usr-Rfl-1N2 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | كپي لینک دعوت. Invite link list/share/copy not built. |
| Rfl-1 | ASR-Rfl-1E2 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | خطاي اقدام به ایجاد لينك دعوت براي سرویس‌دهنده حقوقی.  |
| Rfl-1 | Usr-Rfl-1N3 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | اشتراک گذاری لینک دعوت. Invite link list/share/copy not built. |
| Rfl-1 | Usr-Rfl-1N4 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | مشاهده فهرست لینک‌های دعوت ایجاد شده. Invite link list/share/copy not built. |
| Rfl-1 | Usr-Rfl-1N5 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | جستجو در فهرست لینک‌های دعوت. Invite link list/share/copy not built. |
| Rfl-1 | Usr-Rfl-1N6 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | فیلترگذاری فهرست لینک‌های دعوت. Invite link list/share/copy not built. |
| Rfl-1 | Usr-Rfl-1N7 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | مرتب‌سازی فهرست لینک‌های دعوت. Invite link list/share/copy not built. |
| Rfl1 | Usr-Rfl-1N1 | عملیات ایجاد لینک دعوت از دوستان | PARTIAL | apps/usr/src/app/(public)/(auth)/login/login-form.tsx, (auth)/api/auth.ts | ایجاد لینک دعوت. Referral query on auth only. SRS typo: feature code `Rfl1` → `Rfl-1` (README). |
| Rfl1 | Usr-Rfl-1E1 | عملیات ایجاد لینک دعوت از دوستان | PARTIAL | middleware.ts, (auth)/layout.tsx | خطاي اقدام به ایجاد لينك دعوت براي کاربر مهمان. Session gates; not Rfl-specific guest error copy. SRS typo: feature code `Rfl1` → `Rfl-1` (README). |
| Rfl1 | Usr-Rfl-1N2 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | كپي لینک دعوت. Invite link list/share/copy not built. SRS typo: feature code `Rfl1` → `Rfl-1` (README). |
| Rfl1 | ASR-Rfl-1E2 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | خطاي اقدام به ایجاد لينك دعوت براي سرویس‌دهنده حقوقی.  |
| Rfl1 | Usr-Rfl-1N3 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | اشتراک گذاری لینک دعوت. Invite link list/share/copy not built. SRS typo: feature code `Rfl1` → `Rfl-1` (README). |
| Rfl1 | Usr-Rfl-1N4 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | مشاهده فهرست لینک‌های دعوت ایجاد شده. Invite link list/share/copy not built. SRS typo: feature code `Rfl1` → `Rfl-1` (README). |
| Rfl1 | Usr-Rfl-1N5 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | جستجو در فهرست لینک‌های دعوت. Invite link list/share/copy not built. SRS typo: feature code `Rfl1` → `Rfl-1` (README). |
| Rfl1 | Usr-Rfl-1N6 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | فیلترگذاری فهرست لینک‌های دعوت. Invite link list/share/copy not built. SRS typo: feature code `Rfl1` → `Rfl-1` (README). |
| Rfl1 | Usr-Rfl-1N7 | عملیات ایجاد لینک دعوت از دوستان | MISSING | — | مرتب‌سازی فهرست لینک‌های دعوت. Invite link list/share/copy not built. SRS typo: feature code `Rfl1` → `Rfl-1` (README). |
| Rfl-2 | Usr-Rfl-2N1 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده گزارش سابقه لینک های ساخته شده.  |
| Rfl-2 | Adm-Rfl-2N2 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده گزارش کاربران دعوت‌کننده و دعوت‌شونده.  |
| Rfl-2 | Usr-Rfl-2N3 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده آمارها توسط کاربر.  |
| Rfl-2 | Adm-Rfl-2N4 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده آمارها توسط راهبر.  |
| Rfl-2 | Adm-Rfl-2N5 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده نمودارها.  |

**Summary (Rfl):** DONE 0, PARTIAL 4, UI-ONLY 0, MISSING 19 (total 23).

### Msg — messaging

| Feature code | Path code | Feature name | Status | Files | Notes |
|--------------|-----------|--------------|--------|-------|-------|
| Msg-1 | Usr-Msg-1N1 | عملیات گفتگوها | UI-ONLY | public-panel/components/comments/section.tsx | مشاهده فهرست گفتگوها. Not conversation list; panel comments prototype. |
| Msg-1 | Usr-Msg-1E1 | عملیات گفتگوها | MISSING | — | خطای عدم دسترسی کاربر میهمان. Guest messaging error not implemented. |
| Msg-1 | Usr-Msg-1N2 | عملیات گفتگوها | UI-ONLY | public-panel/components/comments/section.tsx | جستجو در فهرست گفتگوها. Not conversation list; panel comments prototype. |
| Msg-1 | Usr-Msg-1N3 | عملیات گفتگوها | MISSING | — | ایجاد گفتگو.  |
| Msg-1 | Usr-Msg-1N4 | عملیات گفتگوها | MISSING | — | حذف یکطرفه گفتگو.  |
| Msg-1 | Usr-Msg-1N5 | عملیات گفتگوها | MISSING | — | حذف دوطرفه گفتگو.  |
| Msg-1 | Usr-Msg-1N6 | عملیات گفتگوها | MISSING | — | آرشیو گفتگو.  |
| Msg-1 | Usr-Msg-1N7 | عملیات گفتگوها | MISSING | — | لغو آرشیو گفتگو.  |
| Msg-1 | Usr-Msg-1N8 | عملیات گفتگوها | MISSING | — | برگزیدن گفتگو.  |
| Msg-1 | Usr-Msg-1N9 | عملیات گفتگوها | MISSING | — | لغو برگزیدن گفتگو.  |
| Msg-2 | Usr-Msg-2N1 | عملیات پیام‌ها | MISSING | — | مشاهده پیام‌ها.  |
| Msg-2 | Usr-Msg-2E1 | عملیات پیام‌ها | MISSING | — | خطای ارسال ناموفق پیام. SRS exception/report path not implemented or no detail block (README). |
| Msg-2 | Usr-Msg-2N2 | عملیات پیام‌ها | UI-ONLY | comments/section.tsx | ارسال پیام. Local compose only. |
| Msg-2 | Usr-Msg-2E2 | عملیات پیام‌ها | MISSING | — | خطای محتوای نامناسب در متن پیام. SRS exception/report path not implemented or no detail block (README). |
| Msg-2 | Usr-Msg-2N3 | عملیات پیام‌ها | UI-ONLY | comments/card.tsx | ارسال پاسخ به یک پیام. Reply UI; client state. |
| Msg-2 | Usr-Msg-2N4 | عملیات پیام‌ها | MISSING | — | ارسال پاسخ به بخشی از پیام.  |
| Msg-2 | Usr-Msg-2N5 | عملیات پیام‌ها | MISSING | — | ویرایش پیام.  |
| Msg-2 | Usr-Msg-2N6 | عملیات پیام‌ها | MISSING | — | حذف یکطرفه پیام.  |
| Msg-2 | Usr-Msg-2N7 | عملیات پیام‌ها | MISSING | — | حذف دوطرفه پیام.  |
| Msg-2 | Usr-Msg-2N8 | عملیات پیام‌ها | MISSING | — | بازارسال پیام.  |
| Msg-2 | Usr-Msg-2N9 | عملیات پیام‌ها | MISSING | — | کپی پیام.  |
| Msg-2 | Usr-Msg-2N10 | عملیات پیام‌ها | MISSING | — | سنجاق کردن پیام.  |
| Msg-2 | Usr-Msg-2N11 | عملیات پیام‌ها | MISSING | — | لغو سنجاق کردن پیام.  |
| Msg-2 | Usr-Msg-2N12 | عملیات پیام‌ها | MISSING | — | ارسال مجدد پیام.  |
| Msg-2 | Usr-Msg-2N13 | عملیات پیام‌ها | MISSING | — | جستجوی پیام.  |
| Msg-3 | Adm-Msg-3N1 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده گزارش گفتگوهای ایجاد شده/ فعال کاربر. SRS exception/report path not implemented or no detail block (README). |
| Msg-3 | Adm-Msg-3N2 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده گزارش گفتگوهای حذف شده کاربر.  |
| Msg-3 | Adm-Msg-3N3 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده گزارش گفتگوهای آرشیو/ لغو آرشیو شده کاربر.  |
| Msg-3 | Adm-Msg-3N4 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده گزارش تعداد پیام های تبادلی.  |
| Msg-3 | Usr-Msg-3N5 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده گزارش درصد مطلق و درصد وزنی پیام‌های تبادلی کاربر به پیام‌های دیگر کاربران. SRS exception/report path not implemented or no detail block (README). |
| Msg-3 | Adm-Msg-3N6 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده آمارها.  |
| Msg-3 | Adm-Msg-3N7 | مشاهده گزارش، نمودار، آمارهای سرویس | MISSING | — | مشاهده نمودارها.  |

**Summary (Msg):** DONE 0, PARTIAL 0, UI-ONLY 4, MISSING 28 (total 32).

### Nws — news

| Feature code | Path code | Feature name | Status | Files | Notes |
|--------------|-----------|--------------|--------|-------|-------|
| Nws-1 | Adm-Nws-1N1 | مشاهده اخبار | UI-ONLY | news-offer-card.tsx, public-panel/catalog | مشاهده اخبار در صفحه نخست. Static catalog slice. |
| Nws-1 | ASR-Nws-1N1 | مشاهده اخبار | UI-ONLY | news-offer-card.tsx, public-panel/catalog | مشاهده اخبار در صفحه نخست. Static catalog slice. |
| Nws-1 | Usr-Nws-1N1 | مشاهده اخبار | UI-ONLY | news-offer-card.tsx, public-panel/catalog | مشاهده اخبار در صفحه نخست. Static catalog slice. |
| Nws-1 | Usr-Nws-1E1 | مشاهده اخبار | MISSING | — | خطای عدم دسترسی کاربر میهمان. Guest error not implemented. |
| Nws-1 | Adm-Nws-1N2 | مشاهده اخبار | MISSING | — | مشاهده فهرست همه اخبار.  |
| Nws-1 | ASR-Nws-1N2 | مشاهده اخبار | MISSING | — | مشاهده فهرست همه اخبار.  |
| Nws-1 | Usr-Nws-1N2 | مشاهده اخبار | MISSING | — | مشاهده فهرست همه اخبار.  |
| Nws-1 | ASR-Nws-1E2 | مشاهده اخبار | MISSING | — | خطای عدم دسترسی سرویس‌دهنده حقوقی.  |
| Nws-1 | Usr-Nws-1N3 | مشاهده اخبار | MISSING | — | مشاهده اخبار در پنل عملیاتی.  |
| Nws-1 | ASR-Nws-1N3 | مشاهده اخبار | MISSING | — | مشاهده اخبار در پنل عملیاتی.  |
| Nws-1 | Adm-Nws-1N3 | مشاهده اخبار | MISSING | — | مشاهده اخبار در پنل عملیاتی.  |
| Nws-1 | Adm-Nws-1N4 | مشاهده اخبار | MISSING | — | مشاهده فهرست اخبار در پنل راهبری.  |
| Nws-1 | Adm-Nws-1N5 | مشاهده اخبار | MISSING | — | مشاهده اخبار آرشیو شده.  |
| Nws-1 | ASR-Nws-1N5 | مشاهده اخبار | MISSING | — | مشاهده اخبار آرشیو شده.  |
| Nws-1 | Usr-Nws-1N5 | مشاهده اخبار | MISSING | — | مشاهده اخبار آرشیو شده.  |
| Nws-1 | Adm-Nws-1N6 | مشاهده اخبار | MISSING | — | مشاهده جزئیات خبر.  |
| Nws-1 | ASR-Nws-1N6 | مشاهده اخبار | MISSING | — | مشاهده جزئیات خبر.  |
| Nws-1 | Usr-Nws-1N6 | مشاهده اخبار | UI-ONLY | news-offer-card.tsx, public-panel/catalog | مشاهده جزئیات خبر. Static catalog slice. |
| Nws-1 | Adm-Nws-1N7 | مشاهده اخبار | MISSING | — | جستجو در فهرست همه اخبار.  |
| Nws-1 | ASR-Nws-1N7 | مشاهده اخبار | MISSING | — | جستجو در فهرست همه اخبار.  |
| Nws-1 | Usr-Nws-1N7 | مشاهده اخبار | MISSING | — | جستجو در فهرست همه اخبار.  |
| Nws-1 | Adm-Nws-1N8 | مشاهده اخبار | MISSING | — | فیلترگذاری فهرست همه اخبار.  |
| Nws-1 | ASR-Nws-1N8 | مشاهده اخبار | MISSING | — | فیلترگذاری فهرست همه اخبار.  |
| Nws-1 | Usr-Nws-1N8 | مشاهده اخبار | MISSING | — | فیلترگذاری فهرست همه اخبار.  |
| Nws-1 | Adm-Nws-1N9 | مشاهده اخبار | MISSING | — | مرتب‌سازی فهرست همه اخبار.  |
| Nws-1 | ASR-Nws-1N9 | مشاهده اخبار | MISSING | — | مرتب‌سازی فهرست همه اخبار.  |
| Nws-1 | Usr-Nws-1N9 | مشاهده اخبار | MISSING | — | مرتب‌سازی فهرست همه اخبار.  |
| Nws-1 | Adm-Nws-1N10 | مشاهده اخبار | MISSING | — | جستجو در فهرست اخبار در پنل عملیاتی و راهبری.  |
| Nws-1 | ASR-Nws-1N10 | مشاهده اخبار | MISSING | — | جستجو در فهرست اخبار در پنل عملیاتی و راهبری.  |
| Nws-1 | Usr-Nws-1N10 | مشاهده اخبار | MISSING | — | جستجو در فهرست اخبار در پنل عملیاتی و راهبری.  |
| Nws-1 | Adm-Nws-1N11 | مشاهده اخبار | MISSING | — | فیلترگذاری فهرست اخبار در پنل عملیاتی و راهبری.  |
| Nws-1 | ASR-Nws-1N11 | مشاهده اخبار | MISSING | — | فیلترگذاری فهرست اخبار در پنل عملیاتی و راهبری.  |
| Nws-1 | Usr-Nws-1N11 | مشاهده اخبار | MISSING | — | فیلترگذاری فهرست اخبار در پنل عملیاتی و راهبری.  |
| Nws-1 | Adm-Nws-1N12 | مشاهده اخبار | MISSING | — | مرتب‌سازی فهرست اخبار در پنل عملیاتی و راهبری.  |
| Nws-1 | ASR-Nws-1N12 | مشاهده اخبار | MISSING | — | مرتب‌سازی فهرست اخبار در پنل عملیاتی و راهبری.  |
| Nws-1 | Usr-Nws-1N12 | مشاهده اخبار | MISSING | — | مرتب‌سازی فهرست اخبار در پنل عملیاتی و راهبری.  |
| Nws-2 | Adm-Nws-2N1 | مدیریت عملیات اخبار | MISSING | — | ایجاد خبر.  |
| Nws-2 | ASR-Nws-2N1 | مدیریت عملیات اخبار | MISSING | — | ایجاد خبر.  |
| Nws-2 | Usr-Nws-2N1 | مدیریت عملیات اخبار | MISSING | — | ایجاد خبر.  |
| Nws-2 | Adm-Nws-2E1 | مدیریت عملیات اخبار | MISSING | — | خطای خالی ماندن فیلدهای ضروری.  |
| Nws-2 | ASR-Nws-2E1 | مدیریت عملیات اخبار | MISSING | — | خطای خالی ماندن فیلدهای ضروری.  |
| Nws-2 | Usr-Nws-2E1 | مدیریت عملیات اخبار | MISSING | — | خطای خالی ماندن فیلدهای ضروری.  |
| Nws-2 | ASR-Nws-2N2 | مدیریت عملیات اخبار | MISSING | — | ویرایش خبر توسط کاربر/ سرویس‌دهنده.  |
| Nws-2 | Usr-Nws-2N2 | مدیریت عملیات اخبار | MISSING | — | ویرایش خبر توسط کاربر/ سرویس‌دهنده.  |
| Nws-2 | Adm-Nws-2E2 | مدیریت عملیات اخبار | MISSING | — | خطای آپلود تصویر با حجم غیرمجاز.  |
| Nws-2 | ASR-Nws-2E2 | مدیریت عملیات اخبار | MISSING | — | خطای آپلود تصویر با حجم غیرمجاز.  |
| Nws-2 | Usr-Nws-2E2 | مدیریت عملیات اخبار | MISSING | — | خطای آپلود تصویر با حجم غیرمجاز.  |
| Nws-2 | Adm-Nws-2N3 | مدیریت عملیات اخبار | MISSING | — | ویرایش خبر توسط راهبر.  |
| Nws-2 | Adm-Nws-2E3 | مدیریت عملیات اخبار | MISSING | — | خطای آپلود تصویر با فرمت غیرمجاز.  |
| Nws-2 | ASR-Nws-2E3 | مدیریت عملیات اخبار | MISSING | — | خطای آپلود تصویر با فرمت غیرمجاز.  |
| Nws-2 | Usr-Nws-2E3 | مدیریت عملیات اخبار | MISSING | — | خطای آپلود تصویر با فرمت غیرمجاز.  |
| Nws-2 | ASR-Nws-2N4 | مدیریت عملیات اخبار | MISSING | — | حذف خبر توسط کاربر/ سرویس‌دهنده.  |
| Nws-2 | Usr-Nws-2N4 | مدیریت عملیات اخبار | MISSING | — | حذف خبر توسط کاربر/ سرویس‌دهنده.  |
| Nws-2 | Adm-Nws-2N5 | مدیریت عملیات اخبار | MISSING | — | حذف خبر توسط راهبر.  |
| Nws-2 | Adm-Nws-2N6 | مدیریت عملیات اخبار | MISSING | — | بازگردانی خبر.  |
| Nws-2 | ASR-Nws-2N7 | مدیریت عملیات اخبار | MISSING | — | اعتراض به حذف خبر.  |
| Nws-2 | Usr-Nws-2N7 | مدیریت عملیات اخبار | MISSING | — | اعتراض به حذف خبر.  |
| Nws-2 | Adm-Nws-2N8 | مدیریت عملیات اخبار | MISSING | — | آرشیو خبر.  |
| Nws-2 | ASR-Nws-2N8 | مدیریت عملیات اخبار | MISSING | — | آرشیو خبر.  |
| Nws-2 | Usr-Nws-2N8 | مدیریت عملیات اخبار | MISSING | — | آرشیو خبر.  |
| Nws-2 | Adm-Nws-2N9 | مدیریت عملیات اخبار | MISSING | — | لغو آرشیو خبر.  |
| Nws-2 | ASR-Nws-2N9 | مدیریت عملیات اخبار | MISSING | — | لغو آرشیو خبر.  |
| Nws-2 | Usr-Nws-2N9 | مدیریت عملیات اخبار | MISSING | — | لغو آرشیو خبر.  |
| Nws-3 | Adm-Nws-3N1 | عملیات تایید/ رد خبر | MISSING | — | تایید خبر.  |
| Nws-3 | Adm-Nws-3N2 | عملیات تایید/ رد خبر | MISSING | — | رد خبر.  |
| Nws-4 | Adm-Nws-4N1 | مدیریت دلایل رد خبر | MISSING | — | مشاهده فهرست دلایل رد خبر.  |
| Nws-4 | Adm-Nws-4E1 | مدیریت دلایل رد خبر | MISSING | — | خطای حذف دلیل استفاده شده.  |
| Nws-4 | Adm-Nws-4N2 | مدیریت دلایل رد خبر | MISSING | — | جستجوی دلیل رد خبر.  |
| Nws-4 | Adm-Nws-4N3 | مدیریت دلایل رد خبر | MISSING | — | افزودن دلیل رد خبر.  |
| Nws-4 | Adm-Nws-4N4 | مدیریت دلایل رد خبر | MISSING | — | ویرایش دلیل رد خبر.  |
| Nws-4 | Adm-Nws-4N5 | مدیریت دلایل رد خبر | MISSING | — | حذف دلیل رد خبر.  |
| Nws-4 | Adm-Nws-4N6 | مدیریت دلایل رد خبر | MISSING | — | بازگردانی دلیل رد خبر.  |
| Nws-4 | Adm-Nws-5N1 | مدیریت دسته‌بندی‌ها | MISSING | — | مشاهده دسته‌بندی‌ها.  Feature label should be `Nws-5` (README). |
| Nws-4 | Adm-Nws-5E1 | مدیریت دسته‌بندی‌ها | MISSING | — | خطای حذف دسته‌بندی اصلی دارای دسته‌بندی فرعی.  Feature label should be `Nws-5` (README). |
| Nws-4 | Adm-Nws-5N2 | مدیریت دسته‌بندی‌ها | MISSING | — | جستجوی دسته‌بندی.  Feature label should be `Nws-5` (README). |
| Nws-4 | Adm-Nws-5E2 | مدیریت دسته‌بندی‌ها | MISSING | — | خطای دسته‌بندی اصلی تکراری.  Feature label should be `Nws-5` (README). |
| Nws-4 | Adm-Nws-5N3 | مدیریت دسته‌بندی‌ها | MISSING | — | افزودن دسته‌بندی اصلی.  Feature label should be `Nws-5` (README). |
| Nws-4 | Adm-Nws-5E3 | مدیریت دسته‌بندی‌ها | MISSING | — | خطای دسته‌بندی فرعی تکراری.  Feature label should be `Nws-5` (README). |
| Nws-4 | Adm-Nws-5N4 | مدیریت دسته‌بندی‌ها | MISSING | — | افزودن دسته‌بندی فرعی.  Feature label should be `Nws-5` (README). |
| Nws-4 | Adm-Nws-5N5 | مدیریت دسته‌بندی‌ها | MISSING | — | ویرایش دسته‌بندی اصلی.  Feature label should be `Nws-5` (README). |
| Nws-4 | Adm-Nws-5N6 | مدیریت دسته‌بندی‌ها | MISSING | — | ویرایش دسته‌بندی فرعی.  Feature label should be `Nws-5` (README). |
| Nws-4 | Adm-Nws-5N7 | مدیریت دسته‌بندی‌ها | MISSING | — | حذف دسته‌بندی اصلی.  Feature label should be `Nws-5` (README). |
| Nws-4 | Adm-Nws-5N8 | مدیریت دسته‌بندی‌ها | MISSING | — | حذف دسته‌بندی فرعی.  Feature label should be `Nws-5` (README). |
| Nws-4 | Adm-Dsc-5N1 | مدیریت دسته‌بندی‌ها | MISSING | — | مشاهده دسته‌بندی‌ها. News categories admin missing. SRS copy-error: use `Adm-Nws-5N*` under feature `Nws-5` (README). |
| Nws-4 | Adm-Dsc-5E1 | مدیریت دسته‌بندی‌ها | MISSING | — | خطای حذف دسته‌بندی اصلی دارای دسته‌بندی فرعی. News categories admin missing. SRS copy-error: use `Adm-Nws-5N*` under feature `Nws-5` (README). |
| Nws-4 | Adm-Dsc-5N2 | مدیریت دسته‌بندی‌ها | MISSING | — | جستجوی دسته‌بندی. News categories admin missing. SRS copy-error: use `Adm-Nws-5N*` under feature `Nws-5` (README). |
| Nws-4 | Adm-Dsc-5E2 | مدیریت دسته‌بندی‌ها | MISSING | — | خطای دسته‌بندی اصلی تکراری. News categories admin missing. SRS copy-error: use `Adm-Nws-5N*` under feature `Nws-5` (README). |
| Nws-4 | Adm-Dsc-5N3 | مدیریت دسته‌بندی‌ها | MISSING | — | افزودن دسته‌بندی اصلی. News categories admin missing. SRS copy-error: use `Adm-Nws-5N*` under feature `Nws-5` (README). |
| Nws-4 | Adm-Dsc-5E3 | مدیریت دسته‌بندی‌ها | MISSING | — | خطای دسته‌بندی فرعی تکراری. News categories admin missing. SRS copy-error: use `Adm-Nws-5N*` under feature `Nws-5` (README). |
| Nws-4 | Adm-Dsc-5N4 | مدیریت دسته‌بندی‌ها | MISSING | — | افزودن دسته‌بندی فرعی. News categories admin missing. SRS copy-error: use `Adm-Nws-5N*` under feature `Nws-5` (README). |
| Nws-4 | Adm-Dsc-5N5 | مدیریت دسته‌بندی‌ها | MISSING | — | ویرایش دسته‌بندی اصلی. News categories admin missing. SRS copy-error: use `Adm-Nws-5N*` under feature `Nws-5` (README). |
| Nws-4 | Adm-Dsc-5N6 | مدیریت دسته‌بندی‌ها | MISSING | — | ویرایش دسته‌بندی فرعی. News categories admin missing. SRS copy-error: use `Adm-Nws-5N*` under feature `Nws-5` (README). |
| Nws-4 | Adm-Dsc-5N7 | مدیریت دسته‌بندی‌ها | MISSING | — | حذف دسته‌بندی اصلی. News categories admin missing. SRS copy-error: use `Adm-Nws-5N*` under feature `Nws-5` (README). |
| Nws-4 | Adm-Dsc-5N8 | مدیریت دسته‌بندی‌ها | MISSING | — | حذف دسته‌بندی فرعی. News categories admin missing. SRS copy-error: use `Adm-Nws-5N*` under feature `Nws-5` (README). |
| Nws-6 | Adm-Nws-6N1 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش سابقه عملیات مدیریت اخبار.  |
| Nws-6 | ASR-Nws-6N2 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش سابقه عملیات مدیریت اخبار توسط منتشر کننده.  |
| Nws-6 | Adm-Nws-6N3 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش سابقه تایید/ رد اخبار توسط راهبر.  |
| Nws-6 | ASR-Nws-6N4 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش سابقه تایید / رد خبر.  |
| Nws-6 | Adm-Nws-6N4 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش سابقه تایید / رد خبر.  |
| Nws-6 | Adm-Nws-6N5 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش سابقه مدیریت دلایل رد خبر.  |
| Nws-6 | Adm-Nws-6N6 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش سابقه مدیریت دسته‌بندی‌های خبر.  |
| Nws-6 | Adm-Nws-6N7 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده آمارها.  |
| Nws-6 | Adm-Nws-6N8 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده نمودارها.  |

**Summary (Nws):** DONE 0, PARTIAL 0, UI-ONLY 4, MISSING 99 (total 103).

### Nwl — newsletter

| Feature code | Path code | Feature name | Status | Files | Notes |
|--------------|-----------|--------------|--------|-------|-------|
| Nwl-1 | ASR-Nwl-1N1 | مشاهده خبرنامه‌ها | UI-ONLY | newsletter-offer-card.tsx | مشاهده خبرنامه‌ها در صفحه نخست. Display-only card. |
| Nwl-1 | Adm-Nwl-1N1 | مشاهده خبرنامه‌ها | UI-ONLY | newsletter-offer-card.tsx | مشاهده خبرنامه‌ها در صفحه نخست. Display-only card. |
| Nwl-1 | Usr-Nwl-1N1 | مشاهده خبرنامه‌ها | UI-ONLY | newsletter-offer-card.tsx | مشاهده خبرنامه‌ها در صفحه نخست. Display-only card. |
| Nwl-1 | Usr-Nwl-1E1 | مشاهده خبرنامه‌ها | MISSING | — | خطای عدم دسترسی کاربر میهمان. Guest error not implemented. |
| Nwl-1 | ASR-Nwl-1N2 | مشاهده خبرنامه‌ها | MISSING | — | مشاهده فهرست همه خبرنامه‌ها.  |
| Nwl-1 | Adm-Nwl-1N2 | مشاهده خبرنامه‌ها | MISSING | — | مشاهده فهرست همه خبرنامه‌ها.  |
| Nwl-1 | Usr-Nwl-1N2 | مشاهده خبرنامه‌ها | MISSING | — | مشاهده فهرست همه خبرنامه‌ها.  |
| Nwl-1 | ARS-Nwl-1N3 | مشاهده خبرنامه‌ها | MISSING | — | مشاهده فهرست خبرنامه‌ها در پنل عملیاتی ویژه سرویس‌دهنده.  SRS typo: use `ASR-Nwl-1N3` (`docs/srs/README.md`). |
| Nwl-1 | Adm-Nwl-1N3 | مشاهده خبرنامه‌ها | MISSING | — | مشاهده فهرست خبرنامه‌ها در پنل عملیاتی ویژه سرویس‌دهنده.  |
| Nwl-1 | Adm-Nwl-1N4 | مشاهده خبرنامه‌ها | MISSING | — | مشاهده فهرست خبرنامه‌ها در پنل راهبری.  |
| Nwl-1 | ASR-Nwl-1N5 | مشاهده خبرنامه‌ها | MISSING | — | جستجو در فهرست همه خبرنامه‌ها.  |
| Nwl-1 | Adm-Nwl-1N5 | مشاهده خبرنامه‌ها | MISSING | — | جستجو در فهرست همه خبرنامه‌ها.  |
| Nwl-1 | Usr-Nwl-1N5 | مشاهده خبرنامه‌ها | MISSING | — | جستجو در فهرست همه خبرنامه‌ها.  |
| Nwl-1 | ASR-Nwl-1N6 | مشاهده خبرنامه‌ها | MISSING | — | فیلترگذاری فهرست همه خبرنامه‌ها.  |
| Nwl-1 | Adm-Nwl-1N6 | مشاهده خبرنامه‌ها | MISSING | — | فیلترگذاری فهرست همه خبرنامه‌ها.  |
| Nwl-1 | Usr-Nwl-1N6 | مشاهده خبرنامه‌ها | MISSING | — | فیلترگذاری فهرست همه خبرنامه‌ها.  |
| Nwl-1 | ASR-Nwl-1N7 | مشاهده خبرنامه‌ها | MISSING | — | مرتب‌سازی فهرست همه خبرنامه‌ها.  |
| Nwl-1 | Adm-Nwl-1N7 | مشاهده خبرنامه‌ها | MISSING | — | مرتب‌سازی فهرست همه خبرنامه‌ها.  |
| Nwl-1 | Usr-Nwl-1N7 | مشاهده خبرنامه‌ها | MISSING | — | مرتب‌سازی فهرست همه خبرنامه‌ها.  |
| Nwl-1 | ASR-Nwl-1N8 | مشاهده خبرنامه‌ها | MISSING | — | جستجوی خبرنامه در پنل عملیاتی و راهبری.  |
| Nwl-1 | Adm-Nwl-1N8 | مشاهده خبرنامه‌ها | MISSING | — | جستجوی خبرنامه در پنل عملیاتی و راهبری.  |
| Nwl-1 | ASR-Nwl-1N9 | مشاهده خبرنامه‌ها | MISSING | — | فیلترگذاری خبرنامه‌ها در پنل عملیاتی و راهبری.  |
| Nwl-1 | Adm-Nwl-1N9 | مشاهده خبرنامه‌ها | MISSING | — | فیلترگذاری خبرنامه‌ها در پنل عملیاتی و راهبری.  |
| Nwl-1 | ASR-Nwl-1N10 | مشاهده خبرنامه‌ها | UI-ONLY | newsletter-offer-card.tsx | مرتب‌سازی خبرنامه‌ها در پنل عملیاتی و راهبری. Display-only card. |
| Nwl-1 | Adm-Nwl-1N10 | مشاهده خبرنامه‌ها | MISSING | — | مرتب‌سازی خبرنامه‌ها در پنل عملیاتی و راهبری.  |
| Nwl-2 | ASR-Nwl-2N1 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | ایجاد خبرنامه جدید.  |
| Nwl-2 | ASR-Nwl-2E1 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | خطای بارگذاری فایل با فرمت نامناسب.  |
| Nwl-2 | ASR-Nwl-2N2 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | ویرایش خبرنامه.  |
| Nwl-2 | ASR-Nwl-2E2 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | خطای بارگذاری فایل با حجم نامناسب.  |
| Nwl-2 | ARS-Nwl-2N3 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | حذف خبرنامه.  SRS typo: use `ASR-Nwl-2N3` (`docs/srs/README.md`). |
| Nwl-2 | ASR-Nwl-2E3 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | خطای خالی ماندن فیلدهای ضروری.  |
| Nwl-2 | ASR-Nwl-2N4 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | بازگردانی خبرنامه.  |
| Nwl-2 | ASR-Nwl-2N5 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | کپی خبرنامه.  |
| Nwl-3 | Adm-Nwl-3N1 | مدیریت عملیات خبرنامه توسط راهبر | MISSING | — | ایجاد خبرنامه.  |
| Nwl-3 | Adm-Nwl-3E1 | مدیریت عملیات خبرنامه توسط راهبر | MISSING | — | خطای بارگذاری فایل با فرمت نامناسب.  |
| Nwl-3 | Adm-Nwl-3N2 | مدیریت عملیات خبرنامه توسط راهبر | MISSING | — | ویرایش خبرنامه.  |
| Nwl-3 | Adm-Nwl-3E2 | مدیریت عملیات خبرنامه توسط راهبر | MISSING | — | خطای بارگذاری فایل با حجم نامناسب.  |
| Nwl-3 | Adm-Nwl-3N3 | مدیریت عملیات خبرنامه توسط راهبر | MISSING | — | حذف خبرنامه.  |
| Nwl-3 | Adm-Nwl-3E3 | مدیریت عملیات خبرنامه توسط راهبر | MISSING | — | خطای خالی ماندن فیلدهای ضروری.  |
| Nwl-3 | Adm-Nwl-3N4 | مدیریت عملیات خبرنامه توسط راهبر | MISSING | — | بازگردانی خبرنامه.  |
| Nwl-3 | Adm-Nwl-3N5 | مدیریت عملیات خبرنامه توسط راهبر | MISSING | — | تایید انتشار خبرنامه.  |
| Nwl-3 | Adm-Nwl-3N6 | مدیریت عملیات خبرنامه توسط راهبر | MISSING | — | رد انتشار خبرنامه.  |
| Nwl-3 | Adm-Nwl-3N7 | مدیریت عملیات خبرنامه توسط راهبر | MISSING | — | کپی خبرنامه.  |
| Nwl-2 | Adm-Nwl-3N1 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | ایجاد خبرنامه.  |
| Nwl-2 | Adm-Nwl-3E1 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | خطای بارگذاری فایل با فرمت نامناسب.  |
| Nwl-2 | Adm-Nwl-3N2 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | ویرایش خبرنامه.  |
| Nwl-2 | Adm-Nwl-3E2 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | خطای بارگذاری فایل با حجم نامناسب.  |
| Nwl-2 | Adm-Nwl-3N3 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | حذف خبرنامه.  |
| Nwl-2 | Adm-Nwl-3E3 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | خطای خالی ماندن فیلدهای ضروری.  |
| Nwl-2 | Adm-Nwl-3N4 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | بازگردانی خبرنامه.  |
| Nwl-2 | Adm-Nwl-3N5 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | تایید انتشار خبرنامه.  |
| Nwl-2 | Adm-Nwl-3N6 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | رد انتشار خبرنامه.  |
| Nwl-2 | Adm-Nwl-3N7 | مدیریت عملیات خبرنامه توسط سرویس‌دهنده | MISSING | — | کپی خبرنامه.  |
| Nwl-4 | Adm-Nwl-4N1 | تعلیق خبرنامه | MISSING | — | تعلیق خبرنامه.  |
| Nwl-4 | Adm-Nwl-4N2 | تعلیق خبرنامه | MISSING | — | بازگشت تعلیق از خبرنامه.  |
| Nwl-4 | ASR-Nwl-4N3 | تعلیق خبرنامه | MISSING | — | اعتراض به تعلیق خبرنامه.  |
| Nwl-5 | Usr-Nwl-5N1 | تعلیق / بازگشت از تعلیق خبرنامه | MISSING | — | گزارش کردن خبرنامه.  Report path; SRS header typo `Nwl-6N1` → `Nwl-5N1` (README). |
| Nwl_7 | ASR-Nwl-6N1 | آرشیو خبرنامه | MISSING | — | آرشیو خبرنامه.  SRS malformed `Nwl_7` → treat as newsletter archive `Nwl-6` (README). |
| Nwl_7 | Usr-Nwl-6N1 | آرشیو خبرنامه | MISSING | — | آرشیو خبرنامه.  SRS malformed `Nwl_7` → treat as newsletter archive `Nwl-6` (README). |
| Nwl_7 | Adm-Nwl-6N1 | آرشیو خبرنامه | MISSING | — | آرشیو خبرنامه.  SRS malformed `Nwl_7` → treat as newsletter archive `Nwl-6` (README). |
| Nwl_7 | ASR-Nwl-6N2 | آرشیو خبرنامه | MISSING | — | لغو آرشیو خبرنامه.  SRS malformed `Nwl_7` → treat as newsletter archive `Nwl-6` (README). |
| Nwl_7 | Usr-Nwl-6N2 | آرشیو خبرنامه | MISSING | — | لغو آرشیو خبرنامه.  SRS malformed `Nwl_7` → treat as newsletter archive `Nwl-6` (README). |
| Nwl_7 | Adm-Nwl-6N2 | آرشیو خبرنامه | MISSING | — | لغو آرشیو خبرنامه.  SRS malformed `Nwl_7` → treat as newsletter archive `Nwl-6` (README). |
| Nwl_7 | ASR-Nwl-6N3 | آرشیو خبرنامه | MISSING | — | مشاهده خبرنامه‌های آرشیو شده.  SRS malformed `Nwl_7` → treat as newsletter archive `Nwl-6` (README). |
| Nwl_7 | Usr-Nwl-6N3 | آرشیو خبرنامه | MISSING | — | مشاهده خبرنامه‌های آرشیو شده.  SRS malformed `Nwl_7` → treat as newsletter archive `Nwl-6` (README). |
| Nwl_7 | Adm-Nwl-6N3 | آرشیو خبرنامه | MISSING | — | مشاهده خبرنامه‌های آرشیو شده.  SRS malformed `Nwl_7` → treat as newsletter archive `Nwl-6` (README). |
| Nwl-6 | ASR-Nwl-6N1 | آرشیو خبرنامه | MISSING | — | آرشیو خبرنامه.  |
| Nwl-6 | Usr-Nwl-6N1 | آرشیو خبرنامه | MISSING | — | آرشیو خبرنامه.  |
| Nwl-6 | Adm-Nwl-6N1 | آرشیو خبرنامه | MISSING | — | آرشیو خبرنامه.  |
| Nwl-6 | ASR-Nwl-6N2 | آرشیو خبرنامه | MISSING | — | لغو آرشیو خبرنامه.  |
| Nwl-6 | Usr-Nwl-6N2 | آرشیو خبرنامه | MISSING | — | لغو آرشیو خبرنامه.  |
| Nwl-6 | Adm-Nwl-6N2 | آرشیو خبرنامه | MISSING | — | لغو آرشیو خبرنامه.  |
| Nwl-6 | ASR-Nwl-6N3 | آرشیو خبرنامه | MISSING | — | مشاهده خبرنامه‌های آرشیو شده.  |
| Nwl-6 | Usr-Nwl-6N3 | آرشیو خبرنامه | MISSING | — | مشاهده خبرنامه‌های آرشیو شده.  |
| Nwl-6 | Adm-Nwl-6N3 | آرشیو خبرنامه | MISSING | — | مشاهده خبرنامه‌های آرشیو شده.  |
| Nwl-7 | ASR-Nwl-7N1 | پیش نمایش / دانلود خبرنامه | MISSING | — | پیش نمایش/ دانلود خبرنامه.  |
| Nwl-7 | Usr-Nwl-7N1 | پیش نمایش / دانلود خبرنامه | MISSING | — | پیش نمایش/ دانلود خبرنامه.  |
| Nwl-7 | Adm-Nwl-7N1 | پیش نمایش / دانلود خبرنامه | MISSING | — | پیش نمایش/ دانلود خبرنامه.  |
| Nwl-8 | Adm-Nwl-8N1 | مدیریت دلایل رد/ تعلیق خبرنامه | MISSING | — | مشاهده لیست دلایل رد.  |
| Nwl-8 | Adm-Nwl-8E1 | مدیریت دلایل رد/ تعلیق خبرنامه | MISSING | — | خطای حذف دلیل استفاده شده.  |
| Nwl-8 | Adm-Nwl-8N2 | مدیریت دلایل رد/ تعلیق خبرنامه | MISSING | — | مشاهده لیست دلایل تعلیق.  |
| Nwl-8 | Adm-Nwl-8N3 | مدیریت دلایل رد/ تعلیق خبرنامه | MISSING | — | جستجوی عنوان دلیل.  |
| Nwl-8 | Adm-Nwl-8N4 | مدیریت دلایل رد/ تعلیق خبرنامه | MISSING | — | افزودن دلیل رد.  |
| Nwl-8 | Adm-Nwl-8N5 | مدیریت دلایل رد/ تعلیق خبرنامه | MISSING | — | افزودن دلیل تعلیق.  |
| Nwl-8 | Adm-Nwl-8N6 | مدیریت دلایل رد/ تعلیق خبرنامه | MISSING | — | ویرایش دلیل.  |
| Nwl-8 | Adm-Nwl-8N7 | مدیریت دلایل رد/ تعلیق خبرنامه | MISSING | — | حذف دلیل.  |
| Nwl-8 | Adm-Nwl-8N8 | مدیریت دلایل رد/ تعلیق خبرنامه | MISSING | — | بازگردانی دلیل.  |
| Nwl-9 | Adm-Nwl-9N1 | مدیریت دلایل تعلیق خبرنامه | MISSING | — | مشاهده لیست دلایل تعلیق.  |
| Nwl-9 | Adm-Nwl-9N2 | مدیریت دلایل تعلیق خبرنامه | MISSING | — | جستجوی عنوان دلیل.  |
| Nwl-9 | Adm-Nwl-9N3 | مدیریت دلایل تعلیق خبرنامه | MISSING | — | اضافه کردن دلیل.  |
| Nwl-9 | Adm-Nwl-9N4 | مدیریت دلایل تعلیق خبرنامه | MISSING | — | ویرایش دلیل.  |
| Nwl-9 | Adm-Nwl-9N5 | مدیریت دلایل تعلیق خبرنامه | MISSING | — | حذف دلیل.  |
| Nwl-9 | Adm-Nwl-9N6 | مدیریت دلایل تعلیق خبرنامه | MISSING | — | بازگردانی دلیل.  |
| Nwl-9 | Sys-Nwl-9N7 | مدیریت دلایل تعلیق خبرنامه | MISSING | — | حذف خودکار دلیل.  |
| Nwl-8 | Adm-Nwl-9N1 | مدیریت دلایل رد خبرنامه | MISSING | — | مشاهده لیست دلایل تعلیق.  |
| Nwl-8 | Adm-Nwl-9N2 | مدیریت دلایل رد خبرنامه | MISSING | — | جستجوی عنوان دلیل.  |
| Nwl-8 | Adm-Nwl-9N3 | مدیریت دلایل رد خبرنامه | MISSING | — | اضافه کردن دلیل.  |
| Nwl-8 | Adm-Nwl-9N4 | مدیریت دلایل رد خبرنامه | MISSING | — | ویرایش دلیل.  |
| Nwl-8 | Adm-Nwl-9N5 | مدیریت دلایل رد خبرنامه | MISSING | — | حذف دلیل.  |
| Nwl-8 | Adm-Nwl-9N6 | مدیریت دلایل رد خبرنامه | MISSING | — | بازگردانی دلیل.  |
| Nwl-8 | Sys-Nwl-9N7 | مدیریت دلایل رد خبرنامه | MISSING | — | حذف خودکار دلیل.  |
| Nwl-9 | Adm-Nwl-4E1 | عملیات دسته‌بندی خبرنامه | MISSING | — | خطای حذف دسته‌بندی اصلی دارای دسته‌بندی فرعی.  |
| Nwl-9 | Adm-Nwl-4E2 | عملیات دسته‌بندی خبرنامه | MISSING | — | خطای دسته‌بندی اصلی تکراری.  |
| Nwl-9 | Adm-Nwl-4E3 | عملیات دسته‌بندی خبرنامه | MISSING | — | خطای دسته‌بندی فرعی تکراری.  |
| Nwl-9 | Adm-Nwl-9N7 | عملیات دسته‌بندی خبرنامه | MISSING | — | حذف دسته‌بندی فرعی.  |
| Nwl-9 | Adm-Nwl-9N8 | عملیات دسته‌بندی خبرنامه | MISSING | — | جستجوی دسته‌بندی.  |
| Nwl-10 | Adm-Nwl-10N1 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش سابقه خبرنامه ها.  |
| Nwl-10 | Adm-Nwl-10N2 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش خبرنامه‌های تایید / رد شده توسط راهبر.  |
| Nwl-10 | ASR-Nwl-10N3 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش خبرنامه‌های رد شده برای سرویس‌دهنده.  |
| Nwl-10 | Adm-Nwl-10N4 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش خبرنامه‌های تعلیق شده توسط راهبر.  |
| Nwl-10 | Adm-Nwl-10N5 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش خبرنامه‌های لغو تعلیق شده توسط راهبر.  |
| Nwl-10 | ASR-Nwl-10N6 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش خبرنامه‌های تعلیق شده برای سرویس‌دهندگان.  |
| Nwl-10 | ASR-Nwl-10N7 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش خبرنامه‌های لغو تعلیق شده برای سرویس‌دهندگان.  |
| Nwl-10 | Adm-Nwl-10N8 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش خبرنامه‌های گزارش شده برای راهبر.  |
| Nwl-10 | Adm-Nwl-10N9 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش خبرنامه‌های اعتراض شده به تعلیق.  |
| Nwl-10 | Adm-Nwl-10N10 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش خبرنامه‌های دانلود شده.  |
| Nwl-10 | Adm-Nwl-10N11 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش عملیات دلایل.  |
| Nwl-10 | Adm-Nwl-10N12 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده آمارها در پنل راهبری.  |
| Nwl-10 | Adm-Nwl-10N13 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده آمارها در پنل عملیاتی.  |
| Nwl-10 | ASR-Nwl-10N13 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده آمارها در پنل عملیاتی. No detail block (README). |
| Nwl-10 | Adm-Nwl-10N14 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده نمودارها.  |

**Summary (Nwl):** DONE 0, PARTIAL 0, UI-ONLY 4, MISSING 117 (total 121).

### Cln — calendar events

| Feature code | Path code | Feature name | Status | Files | Notes |
|--------------|-----------|--------------|--------|-------|-------|
| Cln-1 | Adm-Cln-1N1 | مشاهده رخدادهای تقویمی | MISSING | — | مشاهده فهرست رخدادهای تقویمی در صفحه نخست. No calendar-events routes or APIs. |
| Cln-1 | Usr-Cln-1N1 | مشاهده رخدادهای تقویمی | MISSING | — | مشاهده فهرست رخدادهای تقویمی در صفحه نخست. No calendar-events routes or APIs. |
| Cln-1 | ASR-Cln-1N1 | مشاهده رخدادهای تقویمی | MISSING | — | مشاهده فهرست رخدادهای تقویمی در صفحه نخست. No calendar-events routes or APIs. |
| Cln-1 | Usr-Cln-1E1 | مشاهده رخدادهای تقویمی | MISSING | — | خطای عدم دسترسی کاربر میهمان. No calendar-events routes or APIs. |
| Cln-1 | Adm-Cln-1N2 | مشاهده رخدادهای تقویمی | MISSING | — | مشاهده فهرست همه رخدادهای تقویمی. No calendar-events routes or APIs. |
| Cln-1 | Usr-Cln-1N2 | مشاهده رخدادهای تقویمی | MISSING | — | مشاهده فهرست همه رخدادهای تقویمی. No calendar-events routes or APIs. |
| Cln-1 | ASR-Cln-1N2 | مشاهده رخدادهای تقویمی | MISSING | — | مشاهده فهرست همه رخدادهای تقویمی. No calendar-events routes or APIs. |
| Cln-1 | Usr-Cln-1N3 | مشاهده رخدادهای تقویمی | MISSING | — | مشاهده جزئیات رخدادهای تقویمی توسط کاربر. No calendar-events routes or APIs. |
| Cln-1 | Adm-Cln-1N4 | مشاهده رخدادهای تقویمی | MISSING | — | مشاهده جزئیات رخدادهای تقویمی توسط راهبر/ سرویس‌دهنده. No calendar-events routes or APIs. |
| Cln-1 | ASR-Cln-1N4 | مشاهده رخدادهای تقویمی | MISSING | — | مشاهده جزئیات رخدادهای تقویمی توسط راهبر/ سرویس‌دهنده. No calendar-events routes or APIs. |
| Cln-1 | Adm-Cln-1N5 | مشاهده رخدادهای تقویمی | MISSING | — | جستجو در فهرست رخدادهای تقویمی. No calendar-events routes or APIs. |
| Cln-1 | Usr-Cln-1N5 | مشاهده رخدادهای تقویمی | MISSING | — | جستجو در فهرست رخدادهای تقویمی. No calendar-events routes or APIs. |
| Cln-1 | ASR-Cln-1N5 | مشاهده رخدادهای تقویمی | MISSING | — | جستجو در فهرست رخدادهای تقویمی. No calendar-events routes or APIs. |
| Cln-1 | Adm-Cln-1N6 | مشاهده رخدادهای تقویمی | MISSING | — | فیلتر گذاری فهرست رخدادهای تقویمی. No calendar-events routes or APIs. |
| Cln-1 | Usr-Cln-1N6 | مشاهده رخدادهای تقویمی | MISSING | — | فیلتر گذاری فهرست رخدادهای تقویمی. No calendar-events routes or APIs. |
| Cln-1 | ASR-Cln-1N6 | مشاهده رخدادهای تقویمی | MISSING | — | فیلتر گذاری فهرست رخدادهای تقویمی. No calendar-events routes or APIs. |
| Cln-1 | Adm-Cln-1N7 | مشاهده رخدادهای تقویمی | MISSING | — | مرتب سازی فهرست رخدادهای تقویمی. No calendar-events routes or APIs. |
| Cln-1 | Usr-Cln-1N7 | مشاهده رخدادهای تقویمی | MISSING | — | مرتب سازی فهرست رخدادهای تقویمی. No calendar-events routes or APIs. |
| Cln-1 | ASR-Cln-1N7 | مشاهده رخدادهای تقویمی | MISSING | — | مرتب سازی فهرست رخدادهای تقویمی. No calendar-events routes or APIs. |
| Cln-1 | Adm-Cln-1N8 | مشاهده رخدادهای تقویمی | MISSING | — | آرشیو رخداد تقویمی. No calendar-events routes or APIs. |
| Cln-1 | Adm-Cln-1N9 | مشاهده رخدادهای تقویمی | MISSING | — | لغو آرشیو رخداد تقویمی. No calendar-events routes or APIs. |
| Cln-2 | Adm-Cln-2N1 | مدیریت رخدادهای تقویمی توسط راهبر | MISSING | — | مشاهده فهرست رخدادها در پنل راهبری. No calendar-events routes or APIs. |
| Cln-2 | Adm-Cln-2E1 | مدیریت رخدادهای تقویمی توسط راهبر | MISSING | — | خطای بارگذاری فایل با حجم نامناسب. No calendar-events routes or APIs. |
| Cln-2 | Adm-Cln-2N2 | مدیریت رخدادهای تقویمی توسط راهبر | MISSING | — | جستجوی رخداد در پنل راهبری. No calendar-events routes or APIs. |
| Cln-2 | Adm-Cln-2E2 | مدیریت رخدادهای تقویمی توسط راهبر | MISSING | — | خطای بارگذاری فایل با فرمت نامناسب. No calendar-events routes or APIs. |
| Cln-2 | Adm-Cln-2N3 | مدیریت رخدادهای تقویمی توسط راهبر | MISSING | — | فیلترگذاری رخدادها در پنل راهبری. No calendar-events routes or APIs. |
| Cln-2 | Adm-Cln-2E3 | مدیریت رخدادهای تقویمی توسط راهبر | MISSING | — | خطای عدم تکمیل فیلدهای اجباری. No calendar-events routes or APIs. |
| Cln-2 | Adm-Cln-2N4 | مدیریت رخدادهای تقویمی توسط راهبر | MISSING | — | مرتب‌سازی رخدادها در پنل راهبری. No calendar-events routes or APIs. |
| Cln-2 | Adm-Cln-2N5 | مدیریت رخدادهای تقویمی توسط راهبر | MISSING | — | تعریف رخداد جدید. No calendar-events routes or APIs. |
| Cln-2 | Adm-Cln-2N6 | مدیریت رخدادهای تقویمی توسط راهبر | MISSING | — | ویرایش رخداد. No calendar-events routes or APIs. |
| Cln-2 | Adm-Cln-2N7 | مدیریت رخدادهای تقویمی توسط راهبر | MISSING | — | حذف رخداد. No calendar-events routes or APIs. |
| Cln-2 | Adm-Cln-2N8 | مدیریت رخدادهای تقویمی توسط راهبر | MISSING | — | بازگردانی از حذف رخداد. No calendar-events routes or APIs. |
| Cln-2 | Adm-Cln-2N9 | مدیریت رخدادهای تقویمی توسط راهبر | MISSING | — | لغو رخداد. No calendar-events routes or APIs. |
| Cln-2 | Adm-Cln-2N10 | مدیریت رخدادهای تقویمی توسط راهبر | MISSING | — | بازگردانی از لغو رخداد. No calendar-events routes or APIs. |
| Cln-3 | Usr-Cln-3N1 | عملیات ثبت‌نام رخداد تقویمی | MISSING | — | ثبت‌نام در رخداد بدون هزینه. No calendar-events routes or APIs. |
| Cln-3 | Usr-Cln-3N2 | عملیات ثبت‌نام رخداد تقویمی | MISSING | — | ثبت‌نام در رخداد از طریق کیف پول. No calendar-events routes or APIs. |
| Cln-3 | Usr-Cln-3N3 | عملیات ثبت‌نام رخداد تقویمی | MISSING | — | ثبت‌نام در رخداد از طریق درگاه پرداخت. No calendar-events routes or APIs. |
| Cln-3 | Usr-Cln-3N4 | عملیات ثبت‌نام رخداد تقویمی | MISSING | — | لغو ثبت‌نام در رخداد بدون هزینه. No calendar-events routes or APIs. |
| Cln-3 | Usr-Cln-3N5 | عملیات ثبت‌نام رخداد تقویمی | MISSING | — | لغو ثبت‌نام در رخداد دارای هزینه. No calendar-events routes or APIs. |
| Cln-3 | Usr-Cln-3N6 | عملیات ثبت‌نام رخداد تقویمی | MISSING | — | مشاهده فهرست رخدادهای ثبت‌نام شده. No calendar-events routes or APIs. |
| Cln-3 | Usr-Cln-3N7 | عملیات ثبت‌نام رخداد تقویمی | MISSING | — | جستجوی رخدادهای ثبت‌نام شده. No calendar-events routes or APIs. Detail codes `Cln-3N7/3N8` vs summary `Usr-Cln-3N1/3N2` mismatch (README). |
| Cln-3 | Usr-Cln-3N8 | عملیات ثبت‌نام رخداد تقویمی | MISSING | — | فیلترگذاری رخدادهای ثبت‌نام شده. No calendar-events routes or APIs. Detail codes `Cln-3N7/3N8` vs summary `Usr-Cln-3N1/3N2` mismatch (README). |
| Cln-4 | Usr-Cln-4N1 | عملیات پیشنهاد رخداد | MISSING | — | مشاهده فهرست رخدادهای پیشنهادی توسط کاربر. No calendar-events routes or APIs. |
| Cln-4 | Usr-Cln-4E1 | عملیات پیشنهاد رخداد | MISSING | — | خطای عدم تکمیل فیلدهای اجباری. No calendar-events routes or APIs. |
| Cln-4 | Adm-Cln-4N2 | عملیات پیشنهاد رخداد | MISSING | — | مشاهده فهرست رخدادهای پیشنهادی توسط راهبر. No calendar-events routes or APIs. |
| Cln-4 | Usr-Cln-4N3 | عملیات پیشنهاد رخداد | MISSING | — | ثبت پیشنهاد رخداد. No calendar-events routes or APIs. |
| Cln-4 | Usr-Cln-4N4 | عملیات پیشنهاد رخداد | MISSING | — | ویرایش پیشنهاد رخداد. No calendar-events routes or APIs. |
| Cln-4 | Usr-Cln-4N5 | عملیات پیشنهاد رخداد | MISSING | — | حذف پیشنهاد رخداد. No calendar-events routes or APIs. |
| Cln-4 | Usr-Cln-4N6 | عملیات پیشنهاد رخداد | MISSING | — | بازگردانی پیشنهاد رخداد. No calendar-events routes or APIs. |
| Cln-4 | Adm-Cln-4N7 | عملیات پیشنهاد رخداد | MISSING | — | تایید پیشنهاد رخداد. No calendar-events routes or APIs. |
| Cln-4 | Adm-Cln-4N8 | عملیات پیشنهاد رخداد | MISSING | — | رد پیشنهاد رخداد. No calendar-events routes or APIs. |
| Cln-5 | Adm-Cln-5N1 | عملیات دسته‌بندی رخداد | MISSING | — | مشاهده فهرست دسته‌بندی‌ها. No calendar-events routes or APIs. |
| Cln-5 | Adm-Cln-5E1 | عملیات دسته‌بندی رخداد | MISSING | — | خطای حذف دسته‌بندی اصلی دارای دسته‌بندی فرعی. No calendar-events routes or APIs. |
| Cln-5 | Adm-Cln-5N2 | عملیات دسته‌بندی رخداد | MISSING | — | تعریف دسته‌بندی اصلی. No calendar-events routes or APIs. |
| Cln-5 | Adm-Cln-5E2 | عملیات دسته‌بندی رخداد | MISSING | — | خطای دسته‌بندی اصلی تکراری. No calendar-events routes or APIs. |
| Cln-5 | Adm-Cln-5N3 | عملیات دسته‌بندی رخداد | MISSING | — | تعریف دسته‌بندی فرعی. No calendar-events routes or APIs. |
| Cln-5 | Adm-Cln-5E3 | عملیات دسته‌بندی رخداد | MISSING | — | خطای دسته‌بندی فرعی تکراری. No calendar-events routes or APIs. |
| Cln-5 | Adm-Cln-5N4 | عملیات دسته‌بندی رخداد | MISSING | — | ویرایش نام دسته‌بندی اصلی. No calendar-events routes or APIs. |
| Cln-5 | Adm-Cln-5N5 | عملیات دسته‌بندی رخداد | MISSING | — | ویرایش نام دسته‌بندی فرعی. No calendar-events routes or APIs. |
| Cln-5 | Adm-Cln-5N6 | عملیات دسته‌بندی رخداد | MISSING | — | حذف دسته‌بندی اصلی. No calendar-events routes or APIs. |
| Cln-5 | Adm-Cln-5N7 | عملیات دسته‌بندی رخداد | MISSING | — | حذف دسته‌بندی فرعی. No calendar-events routes or APIs. |
| Cln-5 | Adm-Cln-5N8 | عملیات دسته‌بندی رخداد | MISSING | — | جستجوی دسته‌بندی. No calendar-events routes or APIs. |
| Cln-6 | Adm-Cln-6N1 | مدیریت دلایل لغو رخداد | MISSING | — | مشاهده فهرست دلایل لغو رخداد. No calendar-events routes or APIs. |
| Cln-6 | Adm-Cln-6E1 | مدیریت دلایل لغو رخداد | MISSING | — | خطای حذف دلیل استفاده شده. No calendar-events routes or APIs. |
| Cln-6 | Adm-Cln-6N2 | مدیریت دلایل لغو رخداد | MISSING | — | جستجو در فهرست دلایل لغو رخداد. No calendar-events routes or APIs. |
| Cln-6 | Adm-Cln-6N3 | مدیریت دلایل لغو رخداد | MISSING | — | ایجاد دلیل لغو رخداد. No calendar-events routes or APIs. |
| Cln-6 | Adm-Cln-6N4 | مدیریت دلایل لغو رخداد | MISSING | — | ویرایش دلیل لغو رخداد. No calendar-events routes or APIs. |
| Cln-6 | Adm-Cln-6N5 | مدیریت دلایل لغو رخداد | MISSING | — | حذف دلیل لغو رخداد. No calendar-events routes or APIs. |
| Cln-6 | Adm-Cln-6N6 | مدیریت دلایل لغو رخداد | MISSING | — | بازگردانی دلیل لغو رخداد. No calendar-events routes or APIs. |
| Cln-7 | Adm-Cln-7N1 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش سوابق رخدادهای برگزار شده. No calendar-events routes or APIs. |
| Cln-7 | Adm-Cln-7N2 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش رخدادهای لغو/ بازگردانی شده. No calendar-events routes or APIs. |
| Cln-7 | Adm-Cln-7N3 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش رخدادهای حذف / بازگردانی شده. No calendar-events routes or APIs. |
| Cln-7 | Adm-Cln-7N4 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش رخدادهای ایجاد شده. No calendar-events routes or APIs. |
| Cln-7 | Adm-Cln-7N5 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش رخدادهای ویرایش شده. No calendar-events routes or APIs. |
| Cln-7 | Usr-Cln-7N6 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش سوابق رخدادهای ثبت‌نام شده. No calendar-events routes or APIs. |
| Cln-7 | Adm-Cln-7N7 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش سابقه عملیات دسته‌بندی ها. No calendar-events routes or APIs. |
| Cln-7 | Adm-Cln-7N8 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده گزارش سوابق پیشنهادات کاربران. No calendar-events routes or APIs. |
| Cln-7 | Adm-Cln-7N9 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده آمارها. No calendar-events routes or APIs. |
| Cln-7 | Usr-Cln-7N9 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده آمارها. No calendar-events routes or APIs. |
| Cln-7 | ASR-Cln-7N9 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده آمارها. No calendar-events routes or APIs. |
| Cln-7 | Adm-Cln-7N10 | گزارش‌ها، آمارها و نمودارها | MISSING | — | مشاهده نمودارها. No calendar-events routes or APIs. |

**Summary (Cln):** DONE 0, PARTIAL 0, UI-ONLY 0, MISSING 81 (total 81).

### Implemented screens / domains with no path code in `path-index.md`

- `/cooperation` — static cooperation copy (`(site)/cooperation/page.tsx`).
- `/dashboard` — linked in nav/middleware; **no** `page.tsx`.
- Auth flows (`/login`, forgot-password, sessions) — Actor auth MS, not in Chapter-2 service path index.
- `private-panel`, `public-panel` — Profile (`Prf`) / Actor MS; paths not in SRV–Cln index.
- `/notifications/*` — Notification MS (`Ntf` in code comments); separate from Msg/Nws/Nwl.
- Interactive ops (follow/like/score/share) — `public-panel/api/interactive-ops.ts` (`USR1-53-*` in comments).
- `apps/adm`, `apps/bus` placeholder landing pages.
- Temporary admin login (`temporary-admin-login-button.tsx`, `TEMP_ADMIN_ACCESS_TOKEN`).

### Cross-service patterns (from `docs/srs/README.md`)

| Pattern | In codebase? | Abstraction |
|---------|--------------|-------------|
| Approval workflow (submit → approve/reject + reason) | **Partial** | Per-profile Actor APIs + `review-pending-list`; not shared for Dsc/Nws/Nwl/Cln |
| Soft delete + restore | **Partial** | `create-delete-panel.tsx`; not service-wide |
| Archive / unarchive | **Not found** for Dsc/Nws/Nwl/Cln | — |
| Main / sub categories | **Partial** | Notification filter categories; not Dsc/Nws admin CRUD |
| Managed reason lists | **Not found** | — |
| Notifications to counterpart | **Partial** | Notification MS inbox; not tied to Dsc/Nws publish |
| Audit logging UI | **Not found** | — |
| Reports / statistics / charts | **Partial** | `notifications/stats`, `charts`, `reports`; not per Dsc/Nws/Nwl/Rwd |
| Upload format/size errors | **Partial** | `documents-panel.tsx`, `view-field.tsx`; Dsc/Nws SRS paths mostly **MISSING** |
| Guest access error | **Partial** | Auth middleware; SRS `*E1` paths largely **MISSING** |

---

## 9. Conventions Actually Used

### Naming and modules

- **Files/folders:** kebab-case (`manage-visibility-panel.tsx`); route groups in parentheses.
- **Components:** PascalCase named exports.
- **Hooks:** `use-*` prefix (`use-fields-section-controller.ts`).
- **API layer:** `api/{http,auth,profiles-*,react-query,transformers,query-keys}.ts`.
- **Imports:** `@/` app alias; feature aliases `@notifications/*`, `@private-panel/*`, `@public-panel/*`, `@auth/*`, `@home/*`.
- **Export style:** Named exports preferred; default exports for Next.js `page.tsx` / `layout.tsx` only.

### Component structure

- Pages are thin server components passing `accessToken` from `getSession()`.
- Heavy logic in client `*View` components and hooks.
- Props typed inline or imported from `types/`.

### Custom hooks

- Feature hooks under `notifications/hooks/`, `private-panel/hooks/`.
- React Query hooks colocated in `api/react-query.ts` per feature.

### Representative excerpts

**Page (server):**

```12:27:apps/usr/src/app/(public)/(site)/private-panel/page.tsx
export default async function PrivatePanelPage({
  searchParams,
}: {
  searchParams: Promise<{ actor_id?: string; actorId?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  const targetActorId =
    parseActorId(params.actor_id) ?? parseActorId(params.actorId);

  return (
    <PrivatePanelView
      accessToken={session?.accessToken}
      targetActorId={targetActorId}
    />
  );
}
```

**Shared component:**

```30:61:apps/usr/src/app/(public)/(site)/private-panel/components/view.tsx
export function PrivatePanelView({
  accessToken,
  targetActorId,
}: PrivatePanelViewProps) {
  const t = useTranslations('privatePanel');
  const profileQuery = usePrivatePanelProfileQuery(accessToken, targetActorId);
  const profile =
    profileQuery.data ??
    (targetActorId ? temporaryAdminProfile(targetActorId) : undefined);
  const isLoading =
    profileQuery.isFetching &&
    (profileQuery.isPlaceholderData || !profile?.displayName);

  return (
    <main
      dir="rtl"
      className="relative mx-auto flex w-full max-w-[1312px] flex-col gap-6 ...
```

**API + hook:**

```37:43:apps/usr/src/app/(public)/(auth)/api/react-query.ts
export function useSendVerifyCodeMutation() {
  return useMutation({ mutationFn: sendVerifyCode });
}

export function useVerifyCodeMutation() {
  return useMutation({ mutationFn: verifyCode });
}
```

```99:114:apps/usr/src/app/(public)/(auth)/api/auth.ts
export async function sendVerifyCode(
  payload: SendVerifyCodePayload
): Promise<SendVerifyCodeResponse> {
  if (isAuthApiMocked()) {
    return withMockFallback(
      async () => {
        const { data, message } = await postAuth<SendCodeData>(
          '/auth/actor_send_code',
          toSendCodeBody(payload),
          toSendCodeQuery(payload)
        );
        return mapSendCodeResponse(data, message);
      },
      mockSendVerifyCode(payload)
    );
  }
```

**Form (manual + zod elsewhere):**

```63:68:apps/usr/src/app/(public)/(site)/notifications/components/inbox/page-view.tsx
  const [tab, setTab] = useState<NotificationTab>('manual');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<NotificationsFilterValues>(
    EMPTY_NOTIFICATION_FILTERS
  );
  const [page, setPage] = useState(1);
```

**Table with filters:**

```70:80:apps/usr/src/app/(public)/(site)/notifications/components/inbox/page-view.tsx
  const categoryIds = resolveApiCategoryIds(filters.categoryIds);
  const listQuery = useNotificationsListQuery({
    accessToken,
    page,
    type: tab,
    search: query.trim() || undefined,
    isRead: resolveIsReadFilter(filters.statuses),
    startDate: filters.sentStart || undefined,
    endDate: filters.sentEnd || undefined,
    mainCategoryId: categoryIds.mainCategoryId,
    subCategoryId: categoryIds.subCategoryId,
```

### Inconsistencies (examples)

| Issue | Example |
|-------|---------|
| Duplicated HTTP helpers | `public-panel/api/http.ts` vs `private-panel/api/http.ts` |
| Duplicated `formatApiResponseError` | `interactive-ops.ts` vs `public-panel/http.ts` |
| Actor query gating vs client base URL | `canQueryActor()` requires `NEXT_PUBLIC_ACTOR_API_URL` but client defaults to `/api` |
| Tailwind version decl | `apps/usr/package.json` lists tailwind 3.x; app uses Tailwind 4 syntax |
| Modal components | `dialog.tsx` vs `app-dialog.tsx` |
| Tests import missing page | Resolved: scaffold `index.spec.tsx` files removed; util specs cover `jalali.ts` and `format-fa.ts` |
| README | Stock Nx template, not product-specific |

---

## 10. Quality and Tooling

| Tool | Config | Key rules / notes |
|------|--------|-------------------|
| ESLint | `eslint.config.mjs`, `apps/usr/eslint.config.mjs` | Nx flat presets; `@nx/enforce-module-boundaries`; Next plugin on usr |
| Prettier | `.prettierrc` | `singleQuote: true` |
| Stylelint | **Not found** | — |
| Husky / lint-staged | **Not found** | — |
| Jest | Nx target `test` on usr/adm | usr: auth specs plus `jalali` / `format-fa` util specs. adm: no specs (`passWithNoTests`) |
| Playwright | In CI `e2e` target | **No** `playwright.config.*` or e2e project in `nx show projects` |
| Storybook | **Not found** | — |
| CI | `.github/workflows/ci.yml` | pnpm 9.8.0, Node 20, `nx run-many -t lint test build typecheck e2e` |

### Accessibility

- Some `role="alert"`, `aria-hidden` on icons, `focus-visible:ring` on buttons.
- No systematic focus trap audit; keyboard nav **UNKNOWN** quality.
- Auth/recaptcha component present (`components/auth/recaptcha.tsx`).

### Performance

- `useMemo` / `useCallback` used sparingly (~15 files).
- `next/image` used in home/site assets (~20 files).
- Code splitting: minimal (no dynamic imports).
- React Query caching reduces refetch; large client bundles likely from monolithic feature components (900+ line files).

---

## 11. Technical Debt and Risks

| Issue | Location | Severity | Suggested fix |
|-------|----------|----------|----------------|
| `NEXT_PUBLIC_ACTOR_API_URL` gate disables queries when using `/api` proxy only | `private-panel/api/react-query.ts` L68–73, `public-panel/api/react-query.ts` L337–342 | **High** | Enable when `accessToken` + same-origin `/api`, or set public env in all envs |
| Hardcoded default interactive-ops backend host in `next.config.js` | `apps/usr/next.config.js` L51–54 | **High** | Require env in prod; redact in docs |
| `/dashboard` protected but no page | `middleware.ts` L5, `auth-routes.ts` L12 | **High** | Add page or remove links/guard |
| Auth OTP dev shortcuts / client-side OTP storage | `auth-forms.tsx`, `auth-flow.ts` TODOs | **High** | Remove before production |
| `TEMP_ADMIN_ACCESS_TOKEN` bypass | `temporary-admin-login.ts` | **High** | Restrict to non-prod or remove |
| Duplicated API error/HTTP layers | multiple `http.ts` | Medium | Consolidate in `@daneshjoam/api-client` or feature lib |
| No global toast / error boundary | app-wide | Medium | Add `error.tsx` + notification pattern |
| Comments/messaging without API | `comments/section.tsx` | Medium | Wire Msg service or mark UI-only in routes |
| Home search entirely mock | `home/data/search-mock.ts` | Medium | Integrate SRV search API |
| Large unmaintainable files (>300 lines) | see list below | Medium | Split by tab/section |
| CI runs `e2e` with no Playwright project | `.github/workflows/ci.yml` | Medium | Add e2e app or drop target |
| Tailwind version mismatch in package.json | `apps/usr/package.json` vs root | Low | Align declarations |
| `any` in TS | only `apps/*/index.d.ts` (image types) | Low | — |

### `any` usage

- **0** in application `.ts/.tsx` (excluding Next image module shims in `index.d.ts`).

### TODO / FIXME (tracked)

| File | Note |
|------|------|
| `auth-forms.tsx` | Remove dev OTP auto-fill (multiple TODOs) |
| `auth-flow.ts` | Remove client-side OTP storage |
| `auth/api/transformers.ts` | Stop exposing OTP from API |
| `restriction-card.tsx` | Wire lift-restriction API |

### Large files (>300 lines) in `apps/usr/src` (sample)

`auth-forms.tsx` (906), `visibility-config.ts` (780), `comments/card.tsx` (776), `use-fields-section-controller.ts` (767), `fields-section-blocks.tsx` (730), `site-header.tsx` (676), `profile-mappers.ts` (658), `notifications/api/transformers.ts` (607), `pending-mappers.ts` (600), `submit-mappers.ts` (553), `outlined-field.tsx` (501), `auth.ts` (501), `notifications/types/api.ts` (490), `public-panel-mock.ts` (477), `manage-visibility-panel.tsx` (471), `public-panel/api/react-query.ts` (448), `menu-panel.tsx` (435), `stats-dialogs.tsx` (435), `private-panel/api/react-query.ts` (433).

---

## 12. Existing Documentation and AI Setup

| Asset | Status |
|-------|--------|
| `README.md` | Generic Nx starter; mentions `nx dev usr` only |
| `docs/srs/` | **Missing** |
| `docs/ai/` | This audit (created by audit task) |
| `.cursor/rules/` | **Not present** in repo (empty `.cursor` dir) |
| `AGENTS.md` / `CLAUDE.md` / `.cursorrules` | **Not found** |
| ADRs | **Not found** |
| `.agents/` | Empty directory |
| OpenAPI references | Comments point to external swagger (Actor MS, Notification MS, Interactive ops) — URLs not committed |

**Contradictions:** README implies standard Nx app; actual product is Persian `usr` app with microservice proxies. `apps/usr` declares Tailwind 3 while using Tailwind 4 CSS.

---

## 13. Open Questions

1. Where is the authoritative **SRS** (path codes for SRV, Rwd, Dsc, Rfl, Msg, Nws, Nwl, Cln)? `docs/srs/` is absent.
2. What is the **production deployment** target (Vercel per `vercel-build` — confirm domains and env matrix)?
3. Are **`apps/adm` and `apps/bus`** planned separate frontends or deprecated scaffolding?
4. What is the **source of truth for roles/permissions** (JWT claims, `loginType`, actor types) beyond ad hoc checks?
5. Where are **OpenAPI specs** hosted for Auth, Actor, Notification, Interactive Ops MS?
6. Should **`/dashboard`** exist, or should menu links point to `private-panel` / a future admin app?
7. Is **`NEXT_PUBLIC_ACTOR_API_URL` required in production** or should same-origin `/api` rewrites suffice?
8. What is the **backend readiness** for Msg, Dsc, Nws, Nwl, Cln, Rwd services?
9. **CI `e2e`**: is it expected to pass? No Playwright project is defined in `nx show projects`.
10. Are **notification settings** categories/channels fully backend-driven or permanently hybrid with `settings-mock.ts`?

---

## 14. Executive Summary

Daneshjoam’s frontend is an **Nx + pnpm monorepo** whose real product lives in **`apps/usr`**: a **Next.js 16 App Router** Persian **RTL** app with **next-intl**, **TanStack Query**, and **Axios** clients aimed at several **microservices** (auth, actor/profiles, notifications, interactive ops) via **Next rewrites** and optional public env base URLs. Rendering is **hybrid**: server components load sessions and pass tokens; rich profile, auth, and notification UIs are client-heavy. **`apps/adm` and `apps/bus` are placeholders**; admin/ASR flows are partially embedded in `usr` via query params and a temporary admin token.

**Maturity** is **mid-stage UI integration**: profile and notification areas are relatively deep and annotated with SRS-like codes in comments; home search, parts of settings, and public-panel comments are **mock or client-only**; entire SRS areas (Rwd, Cln, most Dsc/Nws/Nwl admin flows) are **missing**. Auth works against real endpoints but **defaults to mocks** without `NEXT_PUBLIC_API_URL`.

**Top strengths:** (1) Clear feature colocation (`notifications`, `private-panel`, `public-panel`), (2) solid RTL/Jalali/digit utilities, (3) centralized design tokens in `globals.css`, (4) consistent React Query patterns, (5) extensive handwritten API typings and mappers aligned to backend envelopes.

**Top problems:** (1) Env/gating mismatch for Actor API queries, (2) broken `/dashboard` route, (3) production-risk auth dev shortcuts and temp admin token, (4) duplicated HTTP/error helpers, (5) minimal tests and questionable CI e2e setup.

**AI rules should prioritize:** (1) Never add UI without stating REAL/MOCK/API path, (2) always use `fa.json` for user-visible Persian, (3) follow feature folder `api/react-query.ts` patterns, (4) respect owner vs admin API pairs for profile workflows, (5) do not introduce new hardcoded backend hosts or bypass session cookie auth.
