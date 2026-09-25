import { isDemoModeGateEnabled } from '@/lib/demo-mode/config';

async function isDemoModeActiveServer(): Promise<boolean> {
  if (!isDemoModeGateEnabled()) return false;
  const { readDemoModeCookieServer } = await import('@/lib/demo-mode/cookies.server');
  return readDemoModeCookieServer();
}

/** Server-side: pick real API or dynamically loaded demo twin (only when gate + cookie). */
export async function resolvePublicPanelApi<T>(
  real: () => Promise<T>,
  demoLoader: () => Promise<{ run: () => Promise<T> }>
): Promise<T> {
  if (!(await isDemoModeActiveServer())) {
    return real();
  }
  const demo = await demoLoader();
  return demo.run();
}
