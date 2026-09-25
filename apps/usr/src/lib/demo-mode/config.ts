/** Cookie set when presentation demo mode is active (public panel only for now). */
export const DEMO_MODE_COOKIE = 'demo_mode';

export const DEMO_MODE_COOKIE_VALUE = '1';

/** Build-time gate: unset in production CI so toggle and mock chunks stay unreachable. */
export function isDemoModeGateEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE_ENABLED === 'true';
}
