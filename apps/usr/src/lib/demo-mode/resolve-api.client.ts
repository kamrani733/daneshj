'use client';

import { isDemoModeGateEnabled } from '@/lib/demo-mode/config';
import { readDemoModeCookieClient } from '@/lib/demo-mode/cookies.client';

/** Browser-only resolver for client-side API modules (Interactive Ops, React Query). */
export async function resolvePublicPanelApiRuntime<T>(
  real: () => Promise<T>,
  demoRun: () => Promise<T>
): Promise<T> {
  if (!isDemoModeGateEnabled() || !readDemoModeCookieClient()) {
    return real();
  }
  return demoRun();
}
