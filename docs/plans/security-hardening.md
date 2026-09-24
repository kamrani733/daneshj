---
title: "Implementation Plan: apps/usr security hardening"
description: "Phase 1 plan for auth-flow storage, dev OTP, temporary admin login, rewrite env, security headers, and CI"
category: "plan"
last_updated: "2026-09-25"
owner: "owner"
---

# Implementation Plan: apps/usr security hardening

Approved 2026-09-25 with items A–E below. Phase 2 implements one item per Conventional Commit.
After items 0 and 1 the work stops for a review. Later items use
`pnpm exec nx run-many -t lint test build -p usr` after each commit.
Item 6’s gate is `pnpm exec nx run-many -t lint test build typecheck`.

## Goal

`apps/usr` cannot return mock auth success from a production build, no longer persists login
step tokens or dev OTPs in browser storage, cannot ship dev OTP autofill or the temporary-admin
token in a production client bundle, does not fall back to a hardcoded Interactive Ops host,
sends the baseline security headers (CSP in report-only), and CI no longer runs an `e2e` target
that has no Playwright project.

## SRS scope

Path codes covered (normal + exception): none. This is platform-shell hardening, not an SRS service.
Red/yellow SRS flags touched: none

## Acceptance criteria

- [ ] Production builds never take the auth mock path. `isAuthApiMocked()` is false, and `withMockFallback` rethrows. `next build` fails unless `NEXT_PUBLIC_API_URL` or `AUTH_API_URL` is set.
- [ ] `useAuthFlowStore` does not write `verifyPasswordAccessToken`, `resetAccessToken`, `pendingSessionLimit.accessToken`, or `devOtpCode` to `localStorage` or `sessionStorage`. Refresh still completes two-step password login, password reset, and the session-limit step. `actor_send_code` runs in a server action that strips `code` in production and forwards `X-Forwarded-For` and `User-Agent`.
- [ ] A production `next build` contains no dev OTP autofill and does not copy `SendCodeData.code` into client auth state. The guard is `process.env.NODE_ENV`, inlined at build time.
- [ ] Temporary admin login is off everywhere except local dev. Vercel preview is off unless `TEMP_ADMIN_ALLOW_PREVIEW=true`. `TEMP_ADMIN_ACCESS_TOKEN` is read only in a server module.
- [ ] `apps/usr/next.config.js` has no default Interactive Ops host. Production `next build` fails when `INTERACTIVE_OPS_API_URL` is unset, and also when both `NEXT_PUBLIC_API_URL` and `AUTH_API_URL` are unset (item 0). `next dev` still starts when interactive-ops is unset.
- [ ] Every response from `apps/usr` includes `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Content-Security-Policy-Report-Only` with the allowlist in item 5.
- [ ] `apps/usr/specs/index.spec.tsx` and `apps/adm/specs/index.spec.tsx` import a real module and pass. CI no longer passes `-t e2e` or installs Playwright. `docs/09-known-issues.md` still records that no Playwright project exists. `pnpm exec nx run-many -t lint test build typecheck` is green.

## Non-goals

- Enforcing CSP (report-only only). Nonce-based CSP is a follow-up after reports are reviewed.
- Replacing the local reCAPTCHA checkbox with the Google widget.
- Changing the established `session` cookie (`libs/auth`) or moving the logged-in access token out of that httpOnly cookie.
- Requiring `ACTOR_API_URL` or `NOTIFICATION_API_URL` at build time.
- Backend Auth MS changes (listed separately below). CSRF rollout and rate limits beyond what already exists.

## Dependencies

| Dependency | Status | Owner |
|------------|--------|-------|
| Auth MS reachable from the Next server (`AUTH_API_URL` or `NEXT_PUBLIC_API_URL`) for step-token server actions | Required for a production build (item 0). Dev may still mock when `NEXT_PUBLIC_API_URL` is unset | frontend |
| `INTERACTIVE_OPS_API_URL` present in the production build environment | Required before the production build of item 4 | owner / Vercel |
| Auth MS omits OTP `code` from `actor_send_code` in production | Not in this repo | backend — see Backend changes |

## Assumptions

- Temporary admin login is on only for local dev (`NODE_ENV !== 'production'` and `VERCEL_ENV` unset). Vercel production and preview are off. Preview turns on only when the server env `TEMP_ADMIN_ALLOW_PREVIEW=true` (intended together with Vercel Deployment Protection).
- Production `next build` requires `INTERACTIVE_OPS_API_URL` and at least one of `NEXT_PUBLIC_API_URL` or `AUTH_API_URL`. `ACTOR_API_URL` and `NOTIFICATION_API_URL` stay optional.
- Pre-session bearer tokens (two-step password, reset password, session-limit) survive refresh via a **separate** httpOnly cookie, not the `session` cookie. The auth layout treats `session.accessToken` as “already logged in” and redirects off the guest flow.
- Non-secret wizard fields (kind, identifier, code type, operation, resend timestamp, `otpVerified`, and booleans that a step token exists) may live in `sessionStorage` so the OTP page survives refresh. They are not credentials.
- Google reCAPTCHA origins are allowlisted now even though `AuthRecaptcha` is still a local checkbox, so turning the widget on later does not require another header change.

## Approach summary

Production builds constant-fold `process.env.NODE_ENV === 'production'` so mock fallbacks,
dev OTP, and temporary admin login cannot be switched on in the browser. Drop Zustand
`persist` to `localStorage`. Keep non-secret wizard fields in `sessionStorage`. When verify-code
or password login returns a step bearer token, a server action stores it in a short-lived
httpOnly cookie and returns only flags to the client. Those actions, including `actor_send_code`,
call Auth MS from the server and forward the incoming `X-Forwarded-For` (else `x-real-ip`) and
`User-Agent`. `actor_send_code` strips `code` before the client sees it in production.
Headers and the CI command are config-only.

## Items

### 0. Mocks impossible in production

**Current behaviour**

`isAuthApiMocked()` (`apps/usr/src/app/(public)/(auth)/api/mock.ts` 10–12) is true exactly when
`NEXT_PUBLIC_API_URL` is unset. `AUTH_API_URL` does not affect it. The browser client then uses
base URL `/api` (`usr-http.ts`).

`withMockFallback` (`libs/api-client/src/lib/transformers.ts` 7–17) always tries the real
request and, on any throw, returns the mock value.

Both apply together on these calls (`auth.ts`): `sendVerifyCode` (102–113), `verifyCode`
(127–138), `refreshToken` (153–167), `getSessions` (304–316), `getSessionsForLimitReached`
(331–340), `resetPassword` (450–465). A failed `/api` call becomes a mock session, mock OTP,
mock session list, or mock reset success.

These skip the network entirely when `isAuthApiMocked()` is true: `sendOtpForLogin` (194–198)
returns a mock OTP; `inactiveSessionThenGetToken` (400–408) returns `mockVerifyCode` (a mock
session); `deleteSessionForLimitReached` (353), `deleteSession` (370), and `actorLogout` (386)
return without calling Auth MS.

When `NEXT_PUBLIC_API_URL` is set, none of these branches run and failures propagate.

**Proposed change**

- `isAuthApiMocked()` returns false when `process.env.NODE_ENV === 'production'` (inlined by
  `next build`), even if `NEXT_PUBLIC_API_URL` is unset.
- `withMockFallback` calls the fetcher and rethrows in production. It does not return `fallback`.
- Outside production, keep today’s dev behaviour (unset public URL → try, then mock).
- In `apps/usr/next.config.js`, when `NODE_ENV === 'production'`, throw if both
  `NEXT_PUBLIC_API_URL` and `AUTH_API_URL` are empty.

**Risk**

- Dev without `NEXT_PUBLIC_API_URL` still mocks, including turning network errors into mock
  sessions. That stays a dev-only footgun.
- A production build on a machine or CI job with neither auth URL set fails at config load.
  Export one of the two before `nx build usr`.

**How to verify**

- Unit: production `withMockFallback` rejects; dev still returns the fallback. Production
  `isAuthApiMocked()` is false with the public URL unset; dev is true only when it is unset.
- `NODE_ENV=production` and both auth URLs unset: `nx build usr` fails naming those variables.
- With `NEXT_PUBLIC_API_URL` or `AUTH_API_URL` set: `pnpm exec nx run-many -t lint test build -p usr`.

**Commit:** `fix(auth): disable mock fallbacks in production builds`

### 1. Auth flow storage

**Current behaviour**

`useAuthFlowStore` in `apps/usr/src/app/(public)/(auth)/lib/auth-flow.ts` wraps the whole
state in Zustand `persist` (`62:113:apps/usr/src/app/(public)/(auth)/lib/auth-flow.ts`, storage
name `auth-flow` at line 111). Zustand’s default storage is `localStorage`. The persisted
blob includes:

| Field | Lines | What it is |
|-------|-------|------------|
| `devOtpCode` on `SendVerifyCodeContext` | 29–30, written from forms | OTP |
| `verifyPasswordAccessToken` | 48–49, 70, 83–85, 92–93, 106 | Bearer after OTP, before password |
| `resetAccessToken` | 47, 69, 91, 105 | Bearer for reset-password |
| `pendingSessionLimit.accessToken` | 35–40, 46, 68, 90, 104 | Bearer while choosing a session to end |

Call sites that need those values after navigation:

- Two-step password: `auth-forms.tsx` 289–297 sets the token; 515–516 and 554–559 send it on `actor_verify_password`.
- Reset: `auth-forms.tsx` 300–306 sets it; 690–702 and 718–721 send it on reset.
- Session limit: `auth-forms.tsx` 273–278 (and the same shape at 452 and 572) stores the token; `session-management-form.tsx` 204–221 and 245–249 lists sessions and continues with it.
- Guards wait for persist hydration before redirecting (`auth-flow.ts` 155–166 and 186–195). A refresh today works because `localStorage` still has the token.

The browser also receives these tokens in the Auth MS JSON body, because `verifyCode` runs in the client (`auth.ts` 124–146) and `mapVerifyCodeResponse` (`transformers.ts` 82–129) returns the raw `access_token`.

**Proposed change**

1. Remove `persist`. Add a one-time `localStorage.removeItem('auth-flow')` on the auth layout so tokens already saved in browsers are deleted.
2. Persist only this non-secret snapshot to `sessionStorage` (key `auth-flow-wizard`): `kind`, `identifier`, `sendVerifyContext` **without** `devOtpCode`, `resendAvailableAt`, `otpVerified`, and booleans `hasVerifyPasswordToken`, `hasResetToken`, `hasSessionLimit`.
3. New server-only module (alongside `auth-actions.ts`) sets cookie `auth_flow_step`:
   - `httpOnly`, `sameSite: 'lax'`, `secure` when `NODE_ENV === 'production'`, `path: '/'`, `maxAge: 600` (session-limit UI window is 5 minutes).
   - Value: base64 JSON `{ step: 'verify-password' \| 'reset-password' \| 'session-limit', accessToken, loginType?, identityInfo? }`.
   - Never the existing `session` cookie.
4. Server actions, called from the forms instead of putting the token in Zustand. Each one that calls Auth MS forwards `X-Forwarded-For` from `next/headers` (falling back to `x-real-ip`) and `User-Agent` on the upstream request, and uses that same user agent in body fields that already send `user_agent`. Existing server actions `clearSession` and `ensureFreshSession` get the same headers.
   - `sendVerifyCodeAction` calls `actor_send_code` and omits `code` from the value returned to the client when `NODE_ENV === 'production'`.
   - `verifyCodeAction`, `verifyPasswordAction`, and `loginByIdentityAndPasswordAction` stash a step token inside the action and return flags only (`step`, plus non-secret fields and `session?`).
   - `resetPasswordAction`, `getSessionsForLimitReachedAction`, and `continueAfterSessionLimitAction` read the cookie. The client does not send the bearer token.
5. A full session still goes through the existing `establishSession` → httpOnly `session` cookie (`libs/auth/src/lib/actions.ts` 7–14).
6. Client `isTwoStep` becomes the boolean `hasVerifyPasswordToken`, not a token string. `ResetPasswordForm` renders when `hasResetToken` is set. The sessions query stops taking an access token argument.
7. Server calls use `AUTH_API_URL` when set, otherwise `NEXT_PUBLIC_API_URL`. `AUTH_API_URL` is read only on the server (it is not `NEXT_PUBLIC_`).

**Risk**

- Refresh on `/login/password`, `/forgot-password/reset`, or `/login/sessions` fails if the cookie is missing or expired; guards must redirect to the start of that flow (same as today’s invalid-state redirect).
- Cookie and `sessionStorage` can diverge if one is cleared. Actions treat a missing cookie as “step expired” and the client clears the boolean.
- `auth-forms.tsx` is already past the split threshold. Touch only the token hand-off; do not split the file in this commit.
- Server actions must call Auth MS with `AUTH_API_URL` when set, otherwise `NEXT_PUBLIC_API_URL`, otherwise the existing mocks. A wrong base URL breaks login only for the three step-token paths.

**How to verify**

- Jest: the wizard snapshot builder omits every token and `devOtpCode`. After `startFlow` / token stash helpers, `localStorage` has no `auth-flow` key and `sessionStorage` has no bearer string.
- Manual: dev login through OTP → password, forgot-password → reset, and session-limit; refresh on each of those pages and submit. Application → Local Storage must not contain the token. The `auth_flow_step` cookie is httpOnly.
- `pnpm exec nx run-many -t lint test build -p usr`.

**Commit:** `fix(auth): keep verify token out of browser storage`

### 2. Dev OTP shortcuts

**Current behaviour**

- `mapSendCodeResponse` copies `data.code` onto the client response (`transformers.ts` 68–79, assignment at 77).
- `IdentifierForm` stores it as `devOtpCode` (`auth-forms.tsx` 141–150). `OtpForm` autofills when `context.devOtpCode` is set (242–245). Resend writes it again (338–345). Password form’s “login with OTP” writes it again (609–614).
- Mocks return `code: '123456'` (`mock.ts` 90–93) when `NEXT_PUBLIC_API_URL` is unset (`mock.ts` 10–12). That is a runtime config check, not a production build guard.
- `SendCodeData.code` (`types.ts` 37) is the Auth MS field. The browser still sees it in the JSON body if the client calls the API directly.

**Proposed change**

One helper, used at every assignment:

```ts
export function devOnlyOtp(code: string | null | undefined): string | undefined {
  if (process.env.NODE_ENV === 'production') return undefined;
  return code ?? undefined;
}
```

Next’s build replaces `process.env.NODE_ENV` with `"production"`, so the production client bundle constant-folds to `return undefined` and the autofill effect’s body is dead. Do not use `NEXT_PUBLIC_*` or any other flag.

- `mapSendCodeResponse` sets `code: devOnlyOtp(data.code)`.
- Mock `code` uses the same helper.
- Autofill effect and the three `devOtpCode:` assignments run only inside `if (process.env.NODE_ENV !== 'production')`.
- Drop `devOtpCode` from the persisted wizard snapshot (item 1). In dev, autofill may use component state for the current page; it is not written to storage.

**Risk**

- Local `next dev` still autofills. That is intended.
- `next build` with `NODE_ENV=development` would keep the shortcut. `next build` sets `NODE_ENV=production`; do not add a second switch.
- Jest runs with `NODE_ENV=test`, so unit tests can still see dev OTP behaviour. A test that assigns `process.env.NODE_ENV = 'production'` covers the helper. The compile-time fold is checked by grepping `.next/static` after `build`.

**How to verify**

- Unit test: `devOnlyOtp('123456')` is `'123456'` when `NODE_ENV` is `test`, and `undefined` when it is `production`.
- After `nx build usr`, search `apps/usr/.next/static` for `devOtpCode`. It must not appear in client chunks.
- Dev server: OTP field still prefills when mocks or the API return a code. Production start (`next start`): the field stays empty.
- `pnpm exec nx run-many -t lint test build -p usr`.

**Commit:** `fix(auth): strip dev OTP from production builds`

### 3. Temporary admin login

**Current behaviour**

- `loginAsTemporaryAdmin` (`temporary-admin-login.ts` 54–62) is a server action (`'use server'` at line 1). It reads `process.env.TEMP_ADMIN_ACCESS_TOKEN` and, if set, builds a session and calls `login()`. There is no production check. The token value is not referenced from client code today.
- `TemporaryAdminLoginButton` (`temporary-admin-login-button.tsx` 19–71) is a client component and is always mounted from `AuthShell` (`auth-shell.tsx` 10 and 301). `AuthShell` is a client component. Any visitor can invoke the action whenever the env var is set, including production.

**Proposed change**

- Add `import 'server-only'` to `temporary-admin-login.ts` (Next provides the package). Keep the token read in that file only.
- `isTemporaryAdminLoginAllowed()` is true only when `TEMP_ADMIN_ACCESS_TOKEN` is non-empty and either:
  - local dev: `VERCEL_ENV` is unset and `NODE_ENV !== 'production'`, or
  - Vercel preview: `VERCEL_ENV === 'preview'` and `TEMP_ADMIN_ALLOW_PREVIEW === 'true'`.
- Every other case is false, including Vercel production, preview without that flag, and a local production build.
- `loginAsTemporaryAdmin` throws a generic Persian error and does not read the token when the helper is false. `NODE_ENV === 'production'` is constant-folded in the server build; `VERCEL_ENV` stays a runtime server read (it is not `NEXT_PUBLIC_`).
- Auth layout (already a server component, `layout.tsx` 10–20) passes `showTemporaryAdminLogin={isTemporaryAdminLoginAllowed()}` into the client shell. `AuthShell` renders the button only when that prop is true. Do not pass the token.

**Risk**

- Preview stays off unless someone sets `TEMP_ADMIN_ALLOW_PREVIEW=true` on that environment. The flag is server-only.
- The button’s JS chunk can still exist in the client bundle. It does not contain the token. Hiding is server-rendered; the action refuses even if the chunk is called.
- `server-only` throws if a client file imports a non-action export. The file must export only the async action plus, if needed, a separate server file for the boolean so the client shell never imports the token module except as the server action reference.

**How to verify**

- `next dev` with the token set: button visible on the login shell; click still opens the private panel.
- `next build && next start` without `VERCEL_ENV`: button not in the login shell HTML; calling the action returns the refusal.
- Grep the client `.next/static` output for the token value (use a dummy value in a local build). It must not appear.
- `pnpm exec nx run-many -t lint test build -p usr`.

**Commit:** `fix(auth): disable temporary admin login in production`

### 4. Interactive Ops rewrite URL

**Current behaviour**

`apps/usr/next.config.js` 51–62 always installs interactive-ops rewrites. If `INTERACTIVE_OPS_API_URL` is unset it uses `http://dev.stella.webpanel.systems:5001`. Auth, notification, and actor rewrites are added only when their env vars are set (33–40, 42–49, 65–80).

**Proposed change**

- Delete the hardcoded host.
- When `INTERACTIVE_OPS_API_URL` is set, keep both rewrites (`/api/interactive-ops/:path*` and `/interactive-ops/:path*`).
- When it is unset and `NODE_ENV === 'production'`, throw during config load so `next build` fails with a message that names `INTERACTIVE_OPS_API_URL`. Item 0 already fails that build when both `NEXT_PUBLIC_API_URL` and `AUTH_API_URL` are unset. `ACTOR_API_URL` and `NOTIFICATION_API_URL` stay optional.
- When interactive-ops is unset and not production, skip those rewrites (same pattern as the other backends).
- Update `docs/08-configuration.md` and the `INTERACTIVE_OPS_API_URL` row in `docs/PROJECT_CONTEXT.md` in this commit so they no longer say a default host is used. `.env.example` may keep the URL as a sample value; it is not a code fallback.

**Risk**

- The next production build fails until the Vercel project has `INTERACTIVE_OPS_API_URL`. Local `nx build usr` fails the same way unless the variable is exported. Document that in the commit message.
- Dev without the variable no longer proxies interactive-ops silently to the old host. Profile follow/like calls through `/api` will 404 until the env is set. That is the intended removal of the hidden default.

**How to verify**

- `INTERACTIVE_OPS_API_URL=http://127.0.0.1:9 pnpm exec nx build usr` configures the rewrite (build may still fail later for unrelated reasons; config load must get past the check).
- Unset variable and `NODE_ENV=production pnpm exec nx build usr` fails naming `INTERACTIVE_OPS_API_URL`.
- `pnpm exec nx dev usr` with the variable unset reaches the dev server.
- `pnpm exec nx run-many -t lint test build -p usr` with the variable set for the build step.

**Commit:** `fix(infra): require interactive-ops rewrite URL in production`

### 5. Security headers

**Current behaviour**

`apps/usr/next.config.js` exports `nextConfig` with `redirects` and `rewrites` only (7–84). No `headers()`. Fonts are local (`next/font/local`: `IRANSansXVF.ttf` in `layout.tsx` 10–15, `Lalezar-Regular.ttf` in `src/lib/fonts.ts`). No Google Fonts stylesheet. `AuthRecaptcha` (`components/auth/recaptcha.tsx` 13–36) is a checkbox that submits `dev-recaptcha-token`; it loads no Google script. Browser API calls use `NEXT_PUBLIC_API_URL` (often an absolute origin, `.env.example` line 9) or same-origin `/api` for actor, notification, and interactive-ops. `next-themes` is mounted in `layout.tsx` 32 and injects an inline script. There is no third-party analytics script.

**Proposed change**

Add `headers()` on `/:path*` in `next.config.js`:

| Header | Value |
|--------|--------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` |
| `Content-Security-Policy-Report-Only` | policy below |

CSP (report-only, one line, built in `next.config.js`):

| Directive | Allow |
|-----------|--------|
| `default-src` | `'self'` |
| `base-uri` | `'self'` |
| `object-src` | `'none'` |
| `frame-ancestors` | `'none'` |
| `form-action` | `'self'` |
| `script-src` | `'self' 'unsafe-inline'` plus `https://www.google.com` `https://www.gstatic.com` (Next.js runtime and the next-themes inline script; reCAPTCHA v2 `api.js`) |
| `style-src` | `'self' 'unsafe-inline'` (Next/Tailwind and reCAPTCHA injected styles) |
| `font-src` | `'self'` (local IRANSans and Lalezar only) |
| `img-src` | `'self' data: blob:` plus the same API origins as `connect-src` (avatars and uploads may be absolute URLs on those hosts) |
| `connect-src` | `'self'` plus each absolute origin among `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_ACTOR_API_URL`, `NEXT_PUBLIC_NOTIFICATION_API_URL`, `NEXT_PUBLIC_INTERACTIVE_OPS_API_URL`, `NEXT_PUBLIC_FILE_UPLOAD_URL`. Values that are `/api` or unset add nothing. Also `https://www.google.com` for the reCAPTCHA widget. |
| `frame-src` | `'self' https://www.google.com https://recaptcha.google.com` |

Do not add `'unsafe-eval'`. Dev-server eval violations will show in the report-only console; they are not a build failure. Rewrite targets (`AUTH_API_URL` and the other server-only URLs) are not browser origins and are not added to `connect-src`.

No report endpoint (`report-uri` / `report-to`) until one exists.

**Risk**

- Report-only does not block XSS or clickjacking yet. `X-Frame-Options: DENY` does block framing.
- A profile image host that is not one of those env origins will report an `img-src` violation and still load, because the policy is report-only. Record that host before switching to enforcing CSP.
- `'unsafe-inline'` on scripts is wider than a nonce policy. Accepted for this step because next-themes and Next’s bootstrap script need it, and the header is report-only.

**How to verify**

- `curl -sI` against `nx dev usr` on `/login` shows all five headers. CSP contains the origins from the current `.env.local` and the reCAPTCHA hosts, and does not contain `unsafe-eval`.
- Load `/`, `/login`, and a public profile in the browser. The page still renders. Console CSP reports are noted, not treated as a functional failure.
- `pnpm exec nx run-many -t lint test build -p usr`.

**Commit:** `fix(infra): add report-only CSP and security headers`

### 6. CI spec and e2e target

**Current behaviour**

- `apps/usr/specs/index.spec.tsx` 1–10 imports `../src/app/page`. That file does not exist. `/` is `apps/usr/src/app/(public)/(site)/page.tsx`, which renders `HomePage`.
- `.github/workflows/ci.yml` line 41 runs `pnpm exec playwright install --with-deps`. Line 46 runs `pnpm exec nx run-many -t lint test build typecheck e2e`.
- `nx.json` 50–55 registers `@nx/playwright/plugin` with target name `e2e`. There is no `playwright.config.*` in the repo, so no project owns that target.
- `docs/09-known-issues.md` already lists both gaps (open decision 8 at line 21; debt rows at lines 57–58).

**Proposed change**

- Point the usr spec at `../src/app/(public)/(site)/page` and render it inside `NextIntlClientProvider` with `fa` messages, so `useTranslations` in the home tree resolves. Do not add a fake e2e test.
- Fix `apps/adm/specs/index.spec.tsx` the same way: import the page module that actually exists for that app (or the smallest real component if `src/app/page` was never added). The full CI command must be green.
- In `ci.yml`, delete the Playwright install step and remove `e2e` from the `nx run-many` target list. Leave `lint test build typecheck`. Leave the Nx Playwright plugin in `nx.json` so a future config picks up the target without another plugin change.
- At the end of phase 2, update `docs/09-known-issues.md`: mark the broken usr spec and the “CI runs e2e” debt resolved; keep a debt row that no Playwright project exists and CI intentionally does not run `e2e`. Update open decision 8 to that fact. Update `docs/CURRENT-PROGRESS.md` tests row the same way. Also resolve the debt rows that items 1–5 close (OTP storage, temp admin bypass, hardcoded interactive-ops host), and add a row that CSP is report-only until reviewed.

**Risk**

- The home page tree is large. The spec may need a `QueryClientProvider` or `next/image` mock if the first render throws. Fix only what that render needs; do not rewrite the page.
- The adm page tree may be a placeholder. Point the spec at a module that renders under Jest without inventing a product page.
- Removing `e2e` does not create end-to-end coverage.

**How to verify**

- `ci.yml` has no `e2e` target and no `playwright install`.
- `pnpm exec nx run-many -t lint test build typecheck` passes, including both retargeted specs.
- Known-issues and current-progress match the new behaviour.

**Commit:** `fix(infra): repair usr page spec and drop e2e from CI`

## Work breakdown

### Phase 1 — Plan (this document)

| Step | Task | Files / modules |
|------|------|-----------------|
| 1.1 | Write this plan and wait for approval | `docs/plans/security-hardening.md` |

### Phase 2 — Implement after approval (estimate: 12h)

| Step | Task | Files / modules |
|------|------|-----------------|
| 2.0 | Item 0, one commit, then `nx run-many -t lint test build -p usr`. Stop is after item 1, not here | `withMockFallback`, `isAuthApiMocked`, `next.config.js`, mock spec, `docs/07-integrations.md`, `docs/08-configuration.md`, `docs/PROJECT_CONTEXT.md` |
| 2.1 | Item 1, one commit, then the same Nx command, then stop for review | `auth-flow.ts`, step-token server actions, `actor_send_code` action, forward headers, `auth-forms.tsx`, `session-management-form.tsx`, `docs/06-state-management.md` |
| 2.2 | Item 2, one commit, then the same Nx command | `transformers.ts`, `mock.ts`, `auth-forms.tsx`, new `devOnlyOtp` helper + spec |
| 2.3 | Item 3, one commit, then the same Nx command | `temporary-admin-login.ts`, auth `layout.tsx`, `auth-shell.tsx`, `docs/08-configuration.md` |
| 2.4 | Item 4, one commit, then the same Nx command with `INTERACTIVE_OPS_API_URL` set | `apps/usr/next.config.js`, `docs/08-configuration.md`, `docs/PROJECT_CONTEXT.md` |
| 2.5 | Item 5, one commit, then the same Nx command, plus header and browser check | `apps/usr/next.config.js` |
| 2.6 | Item 6, one commit, then `nx run-many -t lint test build typecheck` | `apps/usr/specs/index.spec.tsx`, `apps/adm/specs/index.spec.tsx`, `.github/workflows/ci.yml`, `docs/09-known-issues.md`, `docs/CURRENT-PROGRESS.md` |

`docs/09-known-issues.md` and `docs/CURRENT-PROGRESS.md` are updated once, in the last commit. A doc that item 1–4 would leave false (`06-state-management.md`, `08-configuration.md`, `PROJECT_CONTEXT.md`) is updated in the commit that changes the behaviour.

## Risks

| Risk | Mitigation |
|------|------------|
| Step token still visible in a browser XHR if verify-code stays a client call | Server action performs that call and returns flags only |
| Writing the step token into the `session` cookie logs the user in and the auth layout redirects | Separate `auth_flow_step` cookie |
| Production build breaks on item 4 | Set `INTERACTIVE_OPS_API_URL` before that commit’s build; dev stays optional |
| CSP report-only hides real violations until someone reads them | Item 6 records “report-only, not enforcing” in known issues |
| Home page spec needs extra providers | Add the smallest wrapper that makes render succeed |

## Testing plan

- Unit: wizard snapshot omits secrets; `devOnlyOtp` is empty when `NODE_ENV` is production; usr page spec renders the real route module.
- Integration: none new. No Playwright project.
- Manual smoke: OTP → two-step password refresh; forgot-password reset refresh; session-limit refresh; temporary-admin button in dev vs production start; `curl -sI` headers; login page and home still render under report-only CSP.
- After each phase-2 commit: `pnpm exec nx run-many -t lint test build -p usr`.

## Rollout

- Feature flag: No. Production behaviour is `NODE_ENV` / `VERCEL_ENV`.
- Migration order: item 1 clears legacy `localStorage` key `auth-flow` on next visit. No server data migration.
- Backfill: none.

## Documentation updates

- [ ] `docs/06-state-management.md` — wizard persistence (with item 1)
- [ ] `docs/07-integrations.md` — mock rules (item 0)
- [ ] `docs/08-configuration.md` — auth URL required in production (item 0); temp admin (item 3); no interactive-ops default host (item 4)
- [ ] `docs/PROJECT_CONTEXT.md` — auth mock sentence (item 0); interactive-ops sentence (item 4)
- [ ] `docs/09-known-issues.md` — end of phase 2
- [ ] `docs/CURRENT-PROGRESS.md` — end of phase 2
- [ ] Routing doc — no new route
- [ ] ADR — not required (follows the existing httpOnly session pattern)
- [ ] `docs/10-design-system.md` — no token or component change
- [ ] SRS coverage — unchanged

## Backend changes

Not done in this task. The frontend work does not depend on a deploy of these, except that OTP secrecy is incomplete until the first one ships.

| Change | Why |
|--------|-----|
| Auth MS `actor_send_code` must omit `code` when SMS/email delivery is on | Item 1 strips `code` in the server action in production. Auth MS should also stop putting the OTP in the JSON body. |
| Auth MS must trust `X-Forwarded-For` from the frontend server for session/device info and rate limiting | Item 1 forwards the user-agent and `X-Forwarded-For` (or `x-real-ip`) on server-action calls. If Auth MS uses the TCP peer address, it records the Next server instead of the user. |
| No Auth MS change for httpOnly step tokens | The same `access_token` fields are stored by the Next server instead of `localStorage`. |
| No change for headers, rewrites, temporary admin, or CI | Those are frontend/config only. |

## Open questions

- [x] Temporary admin on Vercel preview — owner, 2026-09-25 — off unless `TEMP_ADMIN_ALLOW_PREVIEW=true`.
- [x] Which rewrite env vars fail the production build — owner, 2026-09-25 — `INTERACTIVE_OPS_API_URL`, plus `NEXT_PUBLIC_API_URL` or `AUTH_API_URL`. Others stay optional.
