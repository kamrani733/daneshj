import {
  DEFAULT_DEMO_PERSONA,
  DEMO_PERSONA_COOKIE,
  isDemoPersonaId,
  type DemoPersonaId,
} from '@/lib/demo-mode/persona';
import { isDemoModeGateEnabled } from '@/lib/demo-mode/config';

export function readDemoPersonaCookieClient(): DemoPersonaId {
  if (typeof document === 'undefined' || !isDemoModeGateEnabled()) {
    return DEFAULT_DEMO_PERSONA;
  }
  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${DEMO_PERSONA_COOKIE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`
    )
  );
  const raw = match?.[1] ? decodeURIComponent(match[1]) : '';
  return isDemoPersonaId(raw) ? raw : DEFAULT_DEMO_PERSONA;
}

export function writeDemoPersonaCookieClient(persona: DemoPersonaId): void {
  if (!isDemoModeGateEnabled()) return;
  const maxAge = 60 * 60 * 24 * 30;
  document.cookie = `${DEMO_PERSONA_COOKIE}=${encodeURIComponent(persona)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
