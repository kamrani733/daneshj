import { withMockFallback } from '@daneshjoam/api-client';

import { usrHttpClient } from '@/shared/api/usr-http';
import { USR_ACTOR_TYPE } from './constants';
import {
  isAuthApiMocked,
  mockRefreshToken,
  mockSendVerifyCode,
  mockSessions,
  mockVerifyCode,
} from './mock';
import {
  mapSendCodeResponse,
  mapToSession,
  mapVerifyCodeResponse,
  toIdentityInfoRequest,
  toSendCodeBody,
  toSendCodeQuery,
  toVerifyCodeBody,
  toVerifyCodeQuery,
} from './transformers';
import type {
  ApiResponse,
  DeleteSessionForLimitReachedPayload,
  DeleteSessionPayload,
  GetSessionsPayload,
  InactiveSessionThenGetTokenPayload,
  RefreshTokenData,
  RefreshTokenPayload,
  RefreshTokenResponse,
  ResetPasswordPayload,
  SendCodeData,
  SendVerifyCodePayload,
  SendVerifyCodeResponse,
  SessionData,
  VerifyCodeData,
  VerifyCodePayload,
  VerifyCodeResponse,
} from './types';

function assertApiSuccess<T>(response: ApiResponse<T>, requireData = true): T {
  if (!response.success || (requireData && response.data == null)) {
    const message =
      response.message ??
      Object.values(response.errors)[0] ??
      'Request failed';
    throw new Error(message);
  }
  return response.data as T;
}

async function postAuth<T>(
  path: string,
  body: unknown,
  params: object,
  accessToken?: string,
  requireData = true
): Promise<{ data: T; message: string | null }> {
  const { data: response } = await usrHttpClient.post<ApiResponse<T>>(path, body, {
    params,
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
  return { data: assertApiSuccess(response, requireData), message: response.message };
}

async function patchAuth<T>(
  path: string,
  body: unknown,
  params: object,
  accessToken: string,
  requireData = true
): Promise<T> {
  const { data: response } = await usrHttpClient.patch<ApiResponse<T>>(path, body, {
    params,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return assertApiSuccess(response, requireData);
}

async function getAuth<T>(
  path: string,
  params: object,
  accessToken: string
): Promise<T> {
  const { data: response } = await usrHttpClient.get<ApiResponse<T>>(path, {
    params,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return assertApiSuccess(response);
}

export async function sendVerifyCode(
  payload: SendVerifyCodePayload
): Promise<SendVerifyCodeResponse> {
  if (isAuthApiMocked()) {
    return withMockFallback(
      async () => {
        const { data, message } = await postAuth<SendCodeData>(
          '/auth/actor_send_code',
          toSendCodeBody(payload),
          toSendCodeQuery(payload)
        );
        return mapSendCodeResponse(data, message);
      },
      mockSendVerifyCode(payload)
    );
  }

  const { data, message } = await postAuth<SendCodeData>(
    '/auth/actor_send_code',
    toSendCodeBody(payload),
    toSendCodeQuery(payload)
  );
  return mapSendCodeResponse(data, message);
}

export async function verifyCode(
  payload: VerifyCodePayload
): Promise<VerifyCodeResponse> {
  if (isAuthApiMocked()) {
    return withMockFallback(
      async () => {
        const { data } = await postAuth<VerifyCodeData>(
          '/auth/actor_verify_code',
          toVerifyCodeBody(payload),
          toVerifyCodeQuery(payload)
        );
        return mapVerifyCodeResponse(data, payload.purpose);
      },
      mockVerifyCode(payload)
    );
  }

  const { data } = await postAuth<VerifyCodeData>(
    '/auth/actor_verify_code',
    toVerifyCodeBody(payload),
    toVerifyCodeQuery(payload)
  );
  return mapVerifyCodeResponse(data, payload.purpose);
}

/**
 * Refresh access token (45 min lifetime). Backend endpoint is ready.
 * TODO: Wire automatic refresh with team — do not enable silent refresh yet.
 */
export async function refreshToken(
  payload: RefreshTokenPayload
): Promise<RefreshTokenResponse> {
  if (isAuthApiMocked()) {
    return withMockFallback(async () => {
      const { data } = await postAuth<RefreshTokenData>(
        '/auth/refresh_token',
        {
          refresh_token: payload.refreshToken,
          session_key: payload.sessionKey,
        },
        { actor_type: USR_ACTOR_TYPE }
      );
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      };
    }, mockRefreshToken());
  }

  const { data } = await postAuth<RefreshTokenData>(
    '/auth/refresh_token',
    {
      refresh_token: payload.refreshToken,
      session_key: payload.sessionKey,
    },
    { actor_type: USR_ACTOR_TYPE }
  );

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}

export async function getSessions(
  payload: GetSessionsPayload
): Promise<SessionData[]> {
  if (isAuthApiMocked()) {
    return withMockFallback(
      async () =>
        (
          await postAuth<SessionData[]>(
            '/auth/display_active_sessions',
            { session_key: payload.sessionKey },
            { actor_type: USR_ACTOR_TYPE },
            payload.accessToken
          )
        ).data,
      mockSessions()
    );
  }

  const { data } = await postAuth<SessionData[]>(
    '/auth/display_active_sessions',
    { session_key: payload.sessionKey },
    { actor_type: USR_ACTOR_TYPE },
    payload.accessToken
  );
  return data;
}

export async function getSessionsForLimitReached(
  accessToken: string
): Promise<SessionData[]> {
  if (isAuthApiMocked()) {
    return withMockFallback(
      async () =>
        getAuth<SessionData[]>(
          '/auth/display_active_sessions_for_limit_reached',
          { actor_type: USR_ACTOR_TYPE },
          accessToken
        ),
      mockSessions()
    );
  }

  return getAuth<SessionData[]>(
    '/auth/display_active_sessions_for_limit_reached',
    { actor_type: USR_ACTOR_TYPE },
    accessToken
  );
}

export async function deleteSessionForLimitReached(
  payload: DeleteSessionForLimitReachedPayload
): Promise<void> {
  if (isAuthApiMocked()) return;

  await patchAuth<null>(
    '/auth/inactive_session_for_limit_reached',
    {},
    {
      actor_type: USR_ACTOR_TYPE,
      session_list: payload.sessionIds.join(','),
    },
    payload.accessToken,
    false
  );
}

export async function deleteSession(
  payload: DeleteSessionPayload
): Promise<void> {
  if (isAuthApiMocked()) return;

  await patchAuth<null>(
    '/auth/inactive_session',
    { session_key: payload.sessionKey },
    {
      actor_type: USR_ACTOR_TYPE,
      session_list: payload.sessionIds.join(','),
    },
    payload.accessToken,
    false
  );
}

export async function inactiveSessionThenGetToken(
  payload: InactiveSessionThenGetTokenPayload
): Promise<VerifyCodeResponse> {
  if (isAuthApiMocked()) {
    return mockVerifyCode({
      identity: payload.identityInfo.email ?? payload.identityInfo.mobile ?? '',
      code: '',
      operation: payload.identityInfo.operation,
      codeType: 'OTP',
      purpose: 'login',
    });
  }

  const data = await patchAuth<VerifyCodeData>(
    '/auth/inactive_session_then_get_token',
    {
      session_list: payload.sessionIds,
      user_agent:
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      login_source: 'Web',
      identity_info: toIdentityInfoRequest(payload.identityInfo),
      login_type: payload.loginType,
    },
    { actor_type: USR_ACTOR_TYPE },
    payload.accessToken
  );

  if (data.access_token && data.session_info?.session_key) {
    return {
      session: mapToSession(data),
      identityInfo: data.identity_info,
    };
  }

  return mapVerifyCodeResponse(data, 'login');
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  await postAuth<null>(
    '/auth/actor_reset_password',
    {
      new_password: payload.password,
      confirm_new_password: payload.confirmPassword,
    },
    { actor_type: USR_ACTOR_TYPE },
    payload.accessToken,
    false
  );
}

/** @deprecated Use sendVerifyCode */
export const sendOtp = sendVerifyCode;

/** @deprecated Use verifyCode */
export const verifyOtp = verifyCode;
