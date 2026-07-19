'use client';

import { useEffect, useRef } from 'react';

import { ensureFreshSession } from '@auth/lib/auth-actions';

/** Poll interval for proactive token refresh (~access token is ~45 min). */
const KEEP_ALIVE_MS = 5 * 60 * 1000;

/**
 * Calls get_token_info / refresh_token via ensureFreshSession so the user
 * stays logged in while the app is open.
 */
export function SessionKeepAlive({ enabled }: { enabled: boolean }) {
  const inFlight = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const run = async () => {
      if (inFlight.current) return;
      inFlight.current = true;
      try {
        await ensureFreshSession();
      } finally {
        inFlight.current = false;
      }
    };

    void run();
    const id = window.setInterval(() => void run(), KEEP_ALIVE_MS);

    const onFocus = () => void run();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void run();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled]);

  return null;
}
