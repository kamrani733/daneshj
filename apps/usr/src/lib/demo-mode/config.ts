/** Cookie set when presentation demo mode is active (public panel only for now). */
export const DEMO_MODE_COOKIE = 'demo_mode';

export const DEMO_MODE_COOKIE_VALUE = '1';

export const DEMO_MODE_OFF_VALUE = '0';

/** Build-time gate: unset unless preview/demo deploy wants the toggle and fixtures. */
export function isDemoModeGateEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE_ENABLED === 'true';
}

/** Gate on + no explicit opt-out → fixtures (Vercel preview and local `.env.local`). */
export function resolveDemoModeActive(cookieValue: string | undefined): boolean {
  if (!isDemoModeGateEnabled()) return false;
  if (cookieValue === DEMO_MODE_OFF_VALUE) return false;
  return cookieValue === DEMO_MODE_COOKIE_VALUE || cookieValue === undefined;
}
