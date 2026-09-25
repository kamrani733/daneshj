import {
  DEMO_MODE_COOKIE,
  DEMO_MODE_COOKIE_VALUE,
  isDemoModeGateEnabled,
} from '@/lib/demo-mode/config';

export function readDemoModeCookieClient(): boolean {
  if (typeof document === 'undefined' || !isDemoModeGateEnabled()) return false;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${DEMO_MODE_COOKIE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`)
  );
  return match?.[1] === DEMO_MODE_COOKIE_VALUE;
}

export function writeDemoModeCookieClient(active: boolean): void {
  if (!isDemoModeGateEnabled()) return;
  const maxAge = 60 * 60 * 24 * 30;
  if (active) {
    document.cookie = `${DEMO_MODE_COOKIE}=${DEMO_MODE_COOKIE_VALUE}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } else {
    document.cookie = `${DEMO_MODE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
}
