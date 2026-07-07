'use server';

import { cookies } from 'next/headers';
import type { Session } from '@daneshjoam/shared-types';
import { SESSION_COOKIE } from './constants';

export async function login(session: Session): Promise<void> {
  const token = Buffer.from(JSON.stringify(session)).toString('base64');
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
