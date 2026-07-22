import type { AuthFlowKind } from '@auth/lib/auth-flow';

export const AUTH_ROUTES = {
  login: '/login',
  loginOtp: '/login/otp',
  loginPassword: '/login/password',
  loginSessions: '/login/sessions',
  loginTotp: '/login/totp',
  /** @deprecated Alias of login — login/register share one flow */
  register: '/login',
  registerOtp: '/login/otp',
  registerSessions: '/login/sessions',
  forgot: '/forgot-password',
  forgotOtp: '/forgot-password/otp',
  forgotReset: '/forgot-password/reset',
  dashboard: '/dashboard',
  home: '/',
} as const;

export function authSessionsPath(_kind: AuthFlowKind) {
  return AUTH_ROUTES.loginSessions;
}

export function authOtpPath(kind: AuthFlowKind) {
  switch (kind) {
    case 'forgot-password':
      return AUTH_ROUTES.forgotOtp;
    default:
      return AUTH_ROUTES.loginOtp;
  }
}

export function authNextAfterOtp(kind: AuthFlowKind) {
  switch (kind) {
    case 'forgot-password':
      return AUTH_ROUTES.forgotReset;
    default:
      return AUTH_ROUTES.loginTotp;
  }
}

export function authTotpPath(kind: AuthFlowKind = 'login') {
  if (kind === 'forgot-password') return AUTH_ROUTES.forgotOtp;
  return AUTH_ROUTES.loginTotp;
}

export function authFallback(kind: AuthFlowKind) {
  switch (kind) {
    case 'forgot-password':
      return AUTH_ROUTES.forgot;
    default:
      return AUTH_ROUTES.login;
  }
}
