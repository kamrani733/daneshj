'use server';

import { cookies } from 'next/headers';

import {
  getSessionsForLimitReached,
  inactiveSessionThenGetToken,
  loginByIdentityAndPassword,
  resetPassword,
  sendVerifyCode,
  verifyCode,
  verifyPassword,
} from '@auth/api/auth';
import type {
  LoginByIdentityPasswordPayload,
  SendVerifyCodePayload,
  SendVerifyCodeResponse,
  SessionData,
  VerifyCodePayload,
} from '@auth/api/types';
import { getAuthRequestMeta } from '@auth/lib/auth-request-meta';
import {
  loginByIdentityPasswordPayloadSchema,
  resetPasswordPayloadSchema,
  sendVerifyCodePayloadSchema,
  sessionIdsSchema,
  verifyCodePayloadSchema,
  verifyPasswordPayloadSchema,
} from '@auth/lib/auth-flow-action-schemas';
import {
  decodeAuthFlowStep,
  encodeAuthFlowStep,
  splitAuthStep,
  stripProductionOtp,
  type ClientAuthResult,
  type StashedAuthFlowStep,
} from '@auth/lib/auth-flow-step';

const AUTH_FLOW_STEP_COOKIE = 'auth_flow_step';
const AUTH_FLOW_STEP_MAX_AGE = 600;

async function writeAuthFlowStep(step: StashedAuthFlowStep): Promise<void> {
  const jar = await cookies();
  jar.set(AUTH_FLOW_STEP_COOKIE, encodeAuthFlowStep(step), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_FLOW_STEP_MAX_AGE,
  });
}

async function readAuthFlowStep(): Promise<StashedAuthFlowStep | null> {
  const raw = (await cookies()).get(AUTH_FLOW_STEP_COOKIE)?.value;
  if (!raw) return null;
  return decodeAuthFlowStep(raw);
}

export async function clearAuthFlowStep(): Promise<void> {
  (await cookies()).delete(AUTH_FLOW_STEP_COOKIE);
}

async function publishAuthResult(
  result: Awaited<ReturnType<typeof verifyCode>>
): Promise<ClientAuthResult> {
  const { client, secret } = splitAuthStep(result);
  if (secret) await writeAuthFlowStep(secret);
  else await clearAuthFlowStep();
  return client;
}

export async function sendVerifyCodeAction(
  payload: SendVerifyCodePayload
): Promise<SendVerifyCodeResponse> {
  const input = sendVerifyCodePayloadSchema.parse(payload);
  const result = await sendVerifyCode(input, await getAuthRequestMeta());
  return stripProductionOtp(result);
}

export async function verifyCodeAction(
  payload: VerifyCodePayload
): Promise<ClientAuthResult> {
  const input = verifyCodePayloadSchema.parse(payload);
  const result = await verifyCode(input, await getAuthRequestMeta());
  return publishAuthResult(result);
}

export async function verifyPasswordAction(payload: {
  identity: string;
  password: string;
  recaptchaResponse: string;
}): Promise<ClientAuthResult> {
  const input = verifyPasswordPayloadSchema.parse(payload);
  const step = await readAuthFlowStep();
  if (step?.step !== 'verify-password') {
    throw new Error('Authentication credentials were not provided.');
  }

  const result = await verifyPassword(
    { ...input, accessToken: step.accessToken },
    await getAuthRequestMeta()
  );
  return publishAuthResult(result);
}

export async function loginByIdentityAndPasswordAction(
  payload: LoginByIdentityPasswordPayload
): Promise<ClientAuthResult> {
  const input = loginByIdentityPasswordPayloadSchema.parse(payload);
  const result = await loginByIdentityAndPassword(
    input,
    await getAuthRequestMeta()
  );
  return publishAuthResult(result);
}

export async function resetPasswordAction(payload: {
  password: string;
  confirmPassword: string;
}): Promise<void> {
  const input = resetPasswordPayloadSchema.parse(payload);
  const step = await readAuthFlowStep();
  if (step?.step !== 'reset-password') {
    throw new Error('Authentication credentials were not provided.');
  }

  await resetPassword(
    {
      password: input.password,
      confirmPassword: input.confirmPassword,
      accessToken: step.accessToken,
    },
    await getAuthRequestMeta()
  );
  await clearAuthFlowStep();
}

export async function getSessionsForLimitReachedAction(): Promise<SessionData[]> {
  const step = await readAuthFlowStep();
  if (step?.step !== 'session-limit') {
    throw new Error('Authentication credentials were not provided.');
  }
  return getSessionsForLimitReached(step.accessToken, await getAuthRequestMeta());
}

export async function continueAfterSessionLimitAction(
  sessionIds: number[]
): Promise<ClientAuthResult> {
  const input = sessionIdsSchema.parse(sessionIds);
  const step = await readAuthFlowStep();
  if (step?.step !== 'session-limit' || !step.identityInfo) {
    throw new Error('Authentication credentials were not provided.');
  }

  const result = await inactiveSessionThenGetToken(
    {
      accessToken: step.accessToken,
      sessionIds: input,
      loginType: step.loginType ?? 1,
      identityInfo: step.identityInfo,
    },
    await getAuthRequestMeta()
  );
  return publishAuthResult(result);
}
