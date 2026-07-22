import type { Session } from '@daneshjoam/shared-types';

export type AuthPurpose = 'register' | 'login' | 'forgot-password';

export type AuthOperation = 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD';

export type ActorType =
  | 'Admin'
  | 'Business'
  | 'Industry'
  | 'University'
  | 'User';

export type CodeType = 'OTP' | 'TOTP';

export type LoginSource = 'Web' | 'MobileApp';

export type LoginIdentityType = 'email' | 'mobile' | 'username';

export type PageType = 'login_by_username' | 'two_step_login';

export type IdentityType = 'email' | 'mobile' | 'username';

export interface ApiResponse<T> {
  data: T | null;
  message: string | null;
  status_code: number;
  errors: Record<string, string>;
  success: boolean;
}

export interface SendCodeData {
  identity_type: IdentityType;
  mobile: string | null;
  email: string | null;
  redirect_code_type: CodeType;
  code?: string | null;
  operation: AuthOperation;
}

export interface IdentityInfo {
  identity_type: IdentityType;
  mobile: string | null;
  email: string | null;
  operation: AuthOperation;
  redirect_verify_password: boolean;
  is_two_step_login: boolean;
}

export interface SessionInfo {
  session_key: string | null;
  session_limit_reached: boolean;
  login_type: number;
}

export interface VerifyCodeData {
  access_token?: string;
  refresh_token?: string | null;
  session_info?: SessionInfo | null;
  identity_info: IdentityInfo;
}

export interface SessionData {
  id: number;
  session_key: string;
  device: string;
  os: string;
  browser: string;
  ip_address: string;
  app_version: string;
  create_time: string;
  is_current_session?: boolean | null;
}

export interface RefreshTokenData {
  access_token: string;
  refresh_token: string;
}

/** Step 1 — send verify code */
export interface SendVerifyCodePayload {
  identity: string;
  purpose: AuthPurpose;
  referralCode?: string;
  /** Only for RESET_PASSWORD */
  loginIdentityType?: LoginIdentityType;
  pageType?: PageType;
}

export interface SendVerifyCodeResponse {
  identityType: IdentityType;
  codeType: CodeType;
  operation: AuthOperation;
  code?: string;
  message: string;
}

/** Step 2 — verify code */
export interface VerifyCodePayload {
  identity: string;
  code: string;
  operation: AuthOperation;
  codeType: CodeType;
  purpose: AuthPurpose;
}

export interface VerifyCodeResponse {
  session?: Session;
  identityInfo?: IdentityInfo;
  requiresTotp?: boolean;
  /** Two-step login → continue with /auth/actor_verify_password */
  redirectVerifyPassword?: boolean;
  /** Temp token after OTP for two-step password verify */
  verifyPasswordAccessToken?: string;
  resetAccessToken?: string;
  sessionLimitReached?: boolean;
  pendingAccessToken?: string;
  loginType?: number;
}

export interface RefreshTokenPayload {
  refreshToken: string;
  sessionKey: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GetSessionsPayload {
  accessToken: string;
  sessionKey: string;
}

export interface DeleteSessionForLimitReachedPayload {
  accessToken: string;
  sessionIds: number[];
}

export interface DeleteSessionPayload {
  accessToken: string;
  sessionKey: string;
  sessionIds: number[];
}

/** POST /auth/actor_logout — خروج کاربر */
export interface ActorLogoutPayload {
  accessToken: string;
  sessionKey: string;
}

/** GET /auth/get_token_info */
export interface TokenInfoData {
  sub: number;
  iat: number;
  exp: number;
}

/** POST /auth/actor_send_otp_for_login */
export interface SendOtpForLoginPayload {
  identity: string;
}

/** Shared password-login / verify-password response data */
export interface VerifyPasswordData {
  access_token: string;
  refresh_token?: string | null;
  session_info: SessionInfo;
}

/** POST /auth/actor_verify_password — two-step login */
export interface VerifyPasswordPayload {
  identity: string;
  password: string;
  recaptchaResponse: string;
  accessToken: string;
}

/** POST /auth/actor_login_by_identity_and_password */
export interface LoginByIdentityPasswordPayload {
  identity: string;
  password: string;
  recaptchaResponse: string;
}

export interface InactiveSessionThenGetTokenPayload {
  accessToken: string;
  sessionIds: number[];
  loginType: number;
  identityInfo: IdentityInfo;
}

export interface SecurityQuestion {
  code: number;
  question: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
  accessToken: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  accessToken: string;
}

export interface ActorSendCodeQuery {
  actor_type: ActorType;
  operation: AuthOperation;
  login_identity_type?: LoginIdentityType;
  page_type?: PageType;
}

export interface ActorVerifyCodeQuery {
  actor_type: ActorType;
  code_type: CodeType;
  login_source: LoginSource;
  operation: AuthOperation;
}

export interface ActorSendCodeBody {
  identity: string;
  referral_code?: string | null;
  ticket_code?: null;
}

export interface ActorVerifyCodeBody {
  identity: string;
  code: string;
  user_agent?: string;
}

/** @deprecated Use SendVerifyCodePayload */
export type SendOtpPayload = SendVerifyCodePayload;

/** @deprecated Use SendVerifyCodeResponse */
export type SendOtpResult = SendVerifyCodeResponse;

/** @deprecated Use VerifyCodePayload */
export type VerifyOtpPayload = VerifyCodePayload;

/** @deprecated Use VerifyCodeResponse */
export type VerifyCodeResult = VerifyCodeResponse;

/** @deprecated Use PageType */
export type ResetPasswordPageType = PageType;

/** @deprecated Use CodeType */
export type RedirectCodeType = CodeType;
