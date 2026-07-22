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

function createMockSessionsForLimitReached(): SessionData[] {
  const now = Date.now();
  return [
    {
      id: 1,
      session_key: 'User_1-mock-session-1',
      device: 'Desktop',
      os: 'Windows 11',
      browser: 'Chrome',
      ip_address: '185.12.34.10',
      app_version: '1.0.0',
      create_time: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      is_current_session: true,
    },
    {
      id: 2,
      session_key: 'User_1-mock-session-2',
      device: 'iPhone',
      os: 'iOS 17',
      browser: 'Safari',
      ip_address: '185.12.34.11',
      app_version: '1.0.0',
      create_time: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
      is_current_session: false,
    },
    {
      id: 3,
      session_key: 'User_1-mock-session-3',
      device: 'Desktop',
      os: 'macOS',
      browser: 'Firefox',
      ip_address: '192.168.1.12',
      app_version: '1.0.0',
      create_time: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
      is_current_session: false,
    },
    {
      id: 4,
      session_key: 'User_1-mock-session-4',
      device: 'Android',
      os: 'Android 14',
      browser: 'Chrome Mobile',
      ip_address: '10.0.0.8',
      app_version: '1.0.0',
      create_time: new Date(now - 1000 * 60 * 60 * 36).toISOString(),
      is_current_session: false,
    },
    {
      id: 5,
      session_key: 'User_1-mock-session-5',
      device: 'Desktop',
      os: 'Ubuntu',
      browser: 'Edge',
      ip_address: '172.16.0.4',
      app_version: '1.0.0',
      create_time: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
      is_current_session: false,
    },
  ];
}

function mockOperationForPurpose(
  payload: SendVerifyCodePayload
): SendVerifyCodeResponse['operation'] {
  if (payload.purpose === 'forgot-password') return 'RESET_PASSWORD';
  // Backend decides LOGIN vs REGISTER; mock: referral → REGISTER
  if (payload.referralCode) return 'REGISTER';
  return 'LOGIN';
}

export function mockSendVerifyCode(
  payload: SendVerifyCodePayload
): SendVerifyCodeResponse {
  const isEmail = payload.identity.includes('@');
  return {
    identityType: isEmail ? 'email' : 'mobile',
    codeType: 'OTP',
    operation: mockOperationForPurpose(payload),
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
    redirect_verify_password:
      payload.purpose === 'forgot-password' ||
      payload.operation === 'RESET_PASSWORD',
    is_two_step_login: false,
  };

  // Forgot-password must continue to the reset form — never invent a login session.
  if (
    payload.purpose === 'forgot-password' ||
    payload.operation === 'RESET_PASSWORD'
  ) {
    return {
      identityInfo,
      redirectVerifyPassword: true,
      resetAccessToken: 'mock-reset-access-token',
    };
  }

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
  return createMockSessionsForLimitReached();
}
