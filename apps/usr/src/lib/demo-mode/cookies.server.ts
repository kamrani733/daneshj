import { cookies } from 'next/headers';

import { DEMO_MODE_COOKIE, resolveDemoModeActive } from '@/lib/demo-mode/config';

export async function readDemoModeCookieServer(): Promise<boolean> {
  const jar = await cookies();
  return resolveDemoModeActive(jar.get(DEMO_MODE_COOKIE)?.value);
}
