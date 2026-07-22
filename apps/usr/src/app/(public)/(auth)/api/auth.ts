import { withMockFallback } from '@daneshjoam/api-client';
import type { Session } from '@daneshjoam/shared-types';

import { usrHttpClient } from '@/shared/api/usr-http';
import { USR_ACTOR_TYPE } from './constants';
import { formatApiResponseError } from './errors';
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
  ActorLogoutPayload,
  ApiResponse,
  DeleteSessionForLimitReachedPayload,
  DeleteSessionPayload,
  GetSessionsPayload,
  IdentityInfo,
  InactiveSessionThenGetTokenPayload,
  LoginByIdentityPasswordPayload,
  RefreshTokenData,
  RefreshTokenPayload,
  RefreshTokenResponse,
  ChangePasswordPayload,
  ResetPasswordPayload,
  SecurityQuestion,
  SendCodeData,
  SendOtpForLoginPayload,
  SendVerifyCodePayload,
  SendVerifyCodeResponse,
  SessionData,
  TokenInfoData,
  VerifyCodeData,
  VerifyCodePayload,
  VerifyCodeResponse,
  VerifyPasswordData,
  VerifyPasswordPayload,
} from './types';

function assertApiSuccess<T>(response: ApiResponse<T>, requireData = true): T {
  if (!response.success || (requireData && response.data == null)) {
    throw new Error(formatApiResponseError(response.message, response.errors));
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

/** POST /auth/refresh_token — stay logged in (no Bearer required). */
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

/** GET /auth/get_token_info — check access-token expiry (iat/exp). */
export async function getTokenInfo(accessToken: string): Promise<TokenInfoData> {
  return getAuth<TokenInfoData>('/auth/get_token_info', {}, accessToken);
}

/** POST /auth/actor_send_otp_for_login — send OTP for login step 1. */
export async function sendOtpForLogin(
  payload: SendOtpForLoginPayload
): Promise<SendVerifyCodeResponse> {
  if (isAuthApiMocked()) {
    return mockSendVerifyCode({
      identity: payload.identity,
      purpose: 'login',
    });
  }

  const { data: response } = await usrHttpClient.post<ApiResponse<SendCodeData>>(
    '/auth/actor_send_otp_for_login',
    undefined,
    {
      params: {
        actor_type: USR_ACTOR_TYPE,
        identity: payload.identity,
      },
    }
  );
  const data = assertApiSuccess(response);
  return mapSendCodeResponse(data, response.message);
}

function mapPasswordLoginResponse(
  data: VerifyPasswordData,
  identity: string
): VerifyCodeResponse {
  const sessionInfo = data.session_info;
  const isEmail = identity.includes('@');
  const identityInfo: IdentityInfo = {
    identity_type: isEmail ? 'email' : 'mobile',
    mobile: isEmail ? null : identity,
    email: isEmail ? identity : null,
    operation: 'LOGIN',
    redirect_verify_password: false,
    is_two_step_login: false,
  };

  if (sessionInfo.session_limit_reached && !sessionInfo.session_key) {
    return {
      sessionLimitReached: true,
      pendingAccessToken: data.access_token,
      loginType: sessionInfo.login_type,
      identityInfo,
    };
  }

  if (!sessionInfo.session_key) {
    throw new Error(formatApiResponseError('Login failed.'));
  }

  const session: Session = {
    user: {
      id: sessionInfo.session_key,
      email: isEmail ? identity : '',
      name: identity,
    },
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? undefined,
    sessionKey: sessionInfo.session_key,
    loginType: sessionInfo.login_type,
  };

  return { session, identityInfo };
}

/** POST /auth/actor_verify_password — two-step login (password after OTP). */
export async function verifyPassword(
  payload: VerifyPasswordPayload
): Promise<VerifyCodeResponse> {
  const { data } = await postAuth<VerifyPasswordData>(
    '/auth/actor_verify_password',
    {
      identity: payload.identity,
      password: payload.password,
      recaptcha_response: payload.recaptchaResponse,
      user_agent:
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    },
    {
      actor_type: USR_ACTOR_TYPE,
      login_source: 'Web',
    },
    payload.accessToken
  );

  return mapPasswordLoginResponse(data, payload.identity);
}

/** POST /auth/actor_login_by_identity_and_password — one-step password login. */
export async function loginByIdentityAndPassword(
  payload: LoginByIdentityPasswordPayload
): Promise<VerifyCodeResponse> {
  const { data } = await postAuth<VerifyPasswordData>(
    '/auth/actor_login_by_identity_and_password',
    {
      identity: payload.identity,
      password: payload.password,
      recaptcha_response: payload.recaptchaResponse,
      user_agent:
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      login_source: 'Web',
    },
    { actor_type: USR_ACTOR_TYPE }
  );

  return mapPasswordLoginResponse(data, payload.identity);
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

/** POST /auth/actor_logout — logout current session (USR-Aut-3N1). */
export async function actorLogout(payload: ActorLogoutPayload): Promise<void> {
  if (isAuthApiMocked()) return;

  await postAuth<null>(
    '/auth/actor_logout',
    { session_key: payload.sessionKey },
    { actor_type: USR_ACTOR_TYPE },
    payload.accessToken,
    false
  );
}

export async function inactiveSessionThenGetToken(
  payload: InactiveSessionThenGetTokenPayload
): Promise<VerifyCodeResponse> {
  if (isAuthApiMocked()) {
    return mockVerifyCode({
      identity:
        payload.identityInfo.email ?? payload.identityInfo.mobile ?? 'mock@local',
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

export async function getPublicSecurityQuestions(
  accessToken: string
): Promise<SecurityQuestion[]> {
  return getAuth<SecurityQuestion[]>(
    '/auth/public_security_questions_content',
    {},
    accessToken
  );
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  if (!payload.accessToken?.trim()) {
    throw new Error('Authentication credentials were not provided.');
  }

  if (isAuthApiMocked()) {
    await withMockFallback(async () => {
      await postAuth<null>(
        '/auth/actor_reset_password',
        {
          new_password: payload.password,
          confirm_new_password: payload.confirmPassword,
          security_question_code: null,
          security_question_answer: null,
        },
        { actor_type: USR_ACTOR_TYPE },
        payload.accessToken,
        false
      );
    }, undefined);
    return;
  }

  await postAuth<null>(
    '/auth/actor_reset_password',
    {
      new_password: payload.password,
      confirm_new_password: payload.confirmPassword,
      security_question_code: null,
      security_question_answer: null,
    },
    { actor_type: USR_ACTOR_TYPE },
    payload.accessToken,
    false
  );
}

export async function changePassword(payload: ChangePasswordPayload): Promise<string> {
  const { message } = await postAuth<null>(
    '/auth/actor_change_password',
    {
      current_password: payload.currentPassword,
      new_password: payload.newPassword,
      confirm_new_password: payload.confirmNewPassword,
    },
    { actor_type: USR_ACTOR_TYPE },
    payload.accessToken,
    false
  );
  return message ?? 'Password changed successfully.';
}

/** @deprecated Use sendVerifyCode */
export const sendOtp = sendVerifyCode;

/** @deprecated Use verifyCode */
export const verifyOtp = verifyCode;
