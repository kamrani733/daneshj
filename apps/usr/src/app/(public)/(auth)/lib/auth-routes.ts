import type { AuthFlowKind } from '@auth/lib/auth-flow';

export const AUTH_ROUTES = {
  login: '/login',
  loginOtp: '/login/otp',
  loginSessions: '/login/sessions',
  loginTotp: '/login/totp',
  register: '/register',
  registerOtp: '/register/otp',
  registerSessions: '/register/sessions',
  forgot: '/forgot-password',
  forgotOtp: '/forgot-password/otp',
  forgotReset: '/forgot-password/reset',
  dashboard: '/dashboard',
  home: '/',
} as const;

export function authSessionsPath(kind: AuthFlowKind) {
  switch (kind) {
    case 'login':
      return AUTH_ROUTES.loginSessions;
    default:
      return AUTH_ROUTES.registerSessions;
  }
}

export function authOtpPath(kind: AuthFlowKind) {
  switch (kind) {
    case 'login':
      return AUTH_ROUTES.loginOtp;
    case 'forgot-password':
      return AUTH_ROUTES.forgotOtp;
    default:
      return AUTH_ROUTES.registerOtp;
  }
}

export function authNextAfterOtp(kind: AuthFlowKind) {
  switch (kind) {
    case 'login':
      return AUTH_ROUTES.loginTotp;
    case 'forgot-password':
      return AUTH_ROUTES.forgotReset;
    default:
      return AUTH_ROUTES.dashboard;
  }
}

export function authTotpPath(kind: AuthFlowKind = 'login') {
  if (kind === 'login') return AUTH_ROUTES.loginTotp;
  return authOtpPath(kind);
}

export function authFallback(kind: AuthFlowKind) {
  switch (kind) {
    case 'login':
      return AUTH_ROUTES.login;
    case 'forgot-password':
      return AUTH_ROUTES.forgot;
    default:
      return AUTH_ROUTES.register;
  }
}
