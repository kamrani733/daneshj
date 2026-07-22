import type { AuthFlowKind } from '@auth/lib/auth-flow';

export const AUTH_ROUTES = {
  login: '/login',
  loginOtp: '/login/otp',
  loginPassword: '/login/password',
  loginSessions: '/login/sessions',
  loginTotp: '/login/totp',
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
  return kind === 'forgot-password' ? AUTH_ROUTES.forgotOtp : AUTH_ROUTES.loginOtp;
}

export function authNextAfterOtp(kind: AuthFlowKind) {
  return kind === 'forgot-password' ? AUTH_ROUTES.forgotReset : AUTH_ROUTES.loginTotp;
}

export function authTotpPath(kind: AuthFlowKind = 'login') {
  return kind === 'forgot-password' ? AUTH_ROUTES.forgotOtp : AUTH_ROUTES.loginTotp;
}

export function authFallback(kind: AuthFlowKind) {
  return kind === 'forgot-password' ? AUTH_ROUTES.forgot : AUTH_ROUTES.login;
}
