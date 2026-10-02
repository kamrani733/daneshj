import {
  DEMO_MODE_COOKIE,
  DEMO_MODE_COOKIE_VALUE,
  DEMO_MODE_OFF_VALUE,
  isDemoModeGateEnabled,
  resolveDemoModeActive,
} from '@/lib/demo-mode/config';

export function readDemoModeCookieClient(): boolean {
  if (typeof document === 'undefined') return false;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${DEMO_MODE_COOKIE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`)
  );
  return resolveDemoModeActive(match?.[1]);
}

export function writeDemoModeCookieClient(active: boolean): void {
  if (!isDemoModeGateEnabled()) return;
  const maxAge = 60 * 60 * 24 * 30;
  const value = active ? DEMO_MODE_COOKIE_VALUE : DEMO_MODE_OFF_VALUE;
  document.cookie = `${DEMO_MODE_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
