import { cookies } from 'next/headers';
import type { Session } from '@daneshjoam/shared-types';
import { SESSION_COOKIE } from './constants';

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(token, 'base64').toString('utf-8')
    ) as Session;
    return payload;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
