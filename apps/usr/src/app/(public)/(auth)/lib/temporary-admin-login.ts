'use server';

import { login } from '@daneshjoam/auth';
import type { Session } from '@daneshjoam/shared-types';

type TemporaryAdminTokenPayload = {
  sub?: string | number;
  name?: string;
  profile?: {
    email?: string | null;
    phone?: string | null;
    type?: number | null;
  } | null;
};

function decodeJwtPayload(token: string): TemporaryAdminTokenPayload {
  const [, payload] = token.split('.');
  if (!payload) throw new Error('توکن راهبر معتبر نیست.');

  try {
    return JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    ) as TemporaryAdminTokenPayload;
  } catch {
    throw new Error('توکن راهبر قابل خواندن نیست.');
  }
}

function buildTemporaryAdminSession(accessToken: string): Session {
  const payload = decodeJwtPayload(accessToken);
  const actorId = payload.sub != null ? String(payload.sub) : 'admin';
  const email = payload.profile?.email?.trim() || '';
  const name = payload.name?.trim() || email || 'Admin';

  return {
    user: {
      id: `Admin_${actorId}`,
      email,
      name,
    },
    accessToken,
    loginType: payload.profile?.type ?? 2,
    identityInfo: {
      identityType: email ? 'email' : 'username',
      mobile: payload.profile?.phone ?? null,
      email: email || null,
      operation: 'LOGIN',
      redirectVerifyPassword: false,
      isTwoStepLogin: false,
    },
  };
}

export async function loginAsTemporaryAdmin(): Promise<void> {
  const accessToken = process.env.TEMP_ADMIN_ACCESS_TOKEN?.trim();

  if (!accessToken) {
    throw new Error('TEMP_ADMIN_ACCESS_TOKEN در env تنظیم نشده است.');
  }

  await login(buildTemporaryAdminSession(accessToken));
}
