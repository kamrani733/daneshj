import { cookies } from 'next/headers';

import {
  DEMO_MODE_COOKIE,
  DEMO_MODE_COOKIE_VALUE,
  isDemoModeGateEnabled,
} from '@/lib/demo-mode/config';

export async function readDemoModeCookieServer(): Promise<boolean> {
  if (!isDemoModeGateEnabled()) return false;
  const jar = await cookies();
  return jar.get(DEMO_MODE_COOKIE)?.value === DEMO_MODE_COOKIE_VALUE;
}
