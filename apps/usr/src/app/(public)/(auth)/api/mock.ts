import type {
  RefreshTokenResponse,
  SendVerifyCodePayload,
  SendVerifyCodeResponse,
  SessionData,
  VerifyCodePayload,
  VerifyCodeResponse,
} from './types';

export function isAuthApiMocked() {
  return !process.env.NEXT_PUBLIC_API_URL;
}

export function mockSendVerifyCode(
  payload: SendVerifyCodePayload
): SendVerifyCodeResponse {
  const isEmail = payload.identity.includes('@');
  return {
    identityType: isEmail ? 'email' : 'mobile',
    codeType: 'OTP',
    operation: payload.purpose === 'register' ? 'REGISTER' : 'LOGIN',
    code: '123456',
    message: 'Mock OTP sent.',
  };
}

export function mockVerifyCode(payload: VerifyCodePayload): VerifyCodeResponse {
  const identityInfo = {
    identity_type: payload.identity.includes('@') ? ('email' as const) : ('mobile' as const),
    mobile: payload.identity.includes('@') ? null : payload.identity,
    email: payload.identity.includes('@') ? payload.identity : null,
    operation: payload.operation,
    redirect_verify_password: false,
    is_two_step_login: false,
  };

  return {
    session: {
      user: {
        id: 'mock-user',
        email: payload.identity.includes('@') ? payload.identity : '',
        name: payload.identity,
      },
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      sessionKey: 'mock-session-key',
      loginType: 1,
      identityInfo: {
        identityType: identityInfo.identity_type,
        mobile: identityInfo.mobile,
        email: identityInfo.email,
        operation: identityInfo.operation,
        redirectVerifyPassword: identityInfo.redirect_verify_password,
        isTwoStepLogin: identityInfo.is_two_step_login,
      },
    },
    identityInfo,
  };
}

export function mockRefreshToken(): RefreshTokenResponse {
  return {
    accessToken: 'mock-access-token-refreshed',
    refreshToken: 'mock-refresh-token-refreshed',
  };
}

export function mockSessions(): SessionData[] {
  return [
    {
      id: 1,
      session_key: 'mock-session-1',
      device: 'Desktop',
      os: 'macOS',
      browser: 'Chrome',
      ip_address: '127.0.0.1',
      app_version: '1.0.0',
      create_time: new Date().toISOString(),
      is_current_session: false,
    },
  ];
}
