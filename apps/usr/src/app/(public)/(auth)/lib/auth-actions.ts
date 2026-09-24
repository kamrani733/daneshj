'use server';

import { getSession, login, logout } from '@daneshjoam/auth';
import type { Session } from '@daneshjoam/shared-types';

import { actorLogout, getTokenInfo, refreshToken } from '@auth/api/auth';
import { getAuthRequestMeta } from '@auth/lib/auth-request-meta';

/** Refresh when fewer than 10 minutes remain on the access token. */
const REFRESH_SKEW_SECONDS = 10 * 60;

export async function establishSession(session: Session) {
  await login(session);
}

/** Reject guest auth flows when a real session/token already exists. */
export async function assertGuestAuth() {
  const session = await getSession();
  if (session?.accessToken) {
    throw new Error('Already authenticated.');
  }
}

/** Call POST /auth/actor_logout then clear the local session cookie. */
export async function clearSession() {
  const session = await getSession();

  if (session?.accessToken && session.sessionKey) {
    try {
      await actorLogout(
        {
          accessToken: session.accessToken,
          sessionKey: session.sessionKey,
        },
        await getAuthRequestMeta()
      );
    } catch {
      // Still clear local cookie if the API call fails.
    }
  }

  await logout();
}

/**
 * Keep the user logged in via get_token_info + refresh_token.
 * Updates the httpOnly session cookie with new tokens.
 */
export async function ensureFreshSession(): Promise<boolean> {
  const session = await getSession();
  if (!session?.refreshToken || !session.sessionKey) {
    return false;
  }

  let shouldRefresh = true;

  const meta = await getAuthRequestMeta();

  if (session.accessToken) {
    try {
      const info = await getTokenInfo(session.accessToken, meta);
      const secondsLeft = info.exp - Math.floor(Date.now() / 1000);
      shouldRefresh = secondsLeft <= REFRESH_SKEW_SECONDS;
    } catch {
      // Access token likely expired — refresh with refresh_token.
      shouldRefresh = true;
    }
  }

  if (!shouldRefresh) {
    return true;
  }

  try {
    const tokens = await refreshToken(
      {
        refreshToken: session.refreshToken,
        sessionKey: session.sessionKey,
      },
      meta
    );

    await login({
      ...session,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
    return true;
  } catch {
    return false;
  }
}
