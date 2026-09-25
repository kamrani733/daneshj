import { cookies } from 'next/headers';

import { isDemoModeGateEnabled } from '@/lib/demo-mode/config';
import {
  DEFAULT_DEMO_PERSONA,
  DEMO_PERSONA_COOKIE,
  parseDemoPersonaId,
  type DemoPersonaId,
} from '@/lib/demo-mode/persona';

export async function readDemoPersonaCookieServer(): Promise<DemoPersonaId> {
  if (!isDemoModeGateEnabled()) return DEFAULT_DEMO_PERSONA;
  const jar = await cookies();
  const raw = jar.get(DEMO_PERSONA_COOKIE)?.value;
  return parseDemoPersonaId(raw);
}
