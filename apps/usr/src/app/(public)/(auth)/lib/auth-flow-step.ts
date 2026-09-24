import type { IdentityInfo, VerifyCodeResponse } from '@auth/api/types';

export type AuthFlowStepName = 'verify-password' | 'reset-password' | 'session-limit';

export type StashedAuthFlowStep = {
  step: AuthFlowStepName;
  accessToken: string;
  loginType?: number;
  identityInfo?: IdentityInfo;
};

export type ClientAuthResult = Omit<
  VerifyCodeResponse,
  'verifyPasswordAccessToken' | 'resetAccessToken' | 'pendingAccessToken'
> & {
  step?: AuthFlowStepName;
};

const STEPS = new Set<AuthFlowStepName>([
  'verify-password',
  'reset-password',
  'session-limit',
]);

export function splitAuthStep(result: VerifyCodeResponse): {
  client: ClientAuthResult;
  secret: StashedAuthFlowStep | null;
} {
  const { verifyPasswordAccessToken, resetAccessToken, pendingAccessToken, ...rest } =
    result;

  if (verifyPasswordAccessToken) {
    return {
      client: { ...rest, step: 'verify-password' },
      secret: { step: 'verify-password', accessToken: verifyPasswordAccessToken },
    };
  }

  if (resetAccessToken) {
    return {
      client: { ...rest, step: 'reset-password' },
      secret: { step: 'reset-password', accessToken: resetAccessToken },
    };
  }

  if (pendingAccessToken && result.sessionLimitReached && result.identityInfo) {
    return {
      client: { ...rest, step: 'session-limit' },
      secret: {
        step: 'session-limit',
        accessToken: pendingAccessToken,
        loginType: result.loginType,
        identityInfo: result.identityInfo,
      },
    };
  }

  return { client: rest, secret: null };
}

export function encodeAuthFlowStep(step: StashedAuthFlowStep): string {
  return Buffer.from(JSON.stringify(step), 'utf8').toString('base64url');
}

export function decodeAuthFlowStep(raw: string): StashedAuthFlowStep | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(raw, 'base64url').toString('utf8')
    ) as Partial<StashedAuthFlowStep>;
    if (!parsed.step || !STEPS.has(parsed.step) || !parsed.accessToken) return null;
    return {
      step: parsed.step,
      accessToken: parsed.accessToken,
      loginType: parsed.loginType,
      identityInfo: parsed.identityInfo,
    };
  } catch {
    return null;
  }
}

/** Drops OTP `code` when the build is production. `next build` inlines `NODE_ENV`. */
export function stripProductionOtp<T extends { code?: string }>(
  result: T,
  nodeEnv: string | undefined = process.env.NODE_ENV
): T {
  if (nodeEnv !== 'production' || result.code === undefined) return result;
  const next: T = { ...result };
  delete next.code;
  return next;
}
